// .github/scripts/synchro-labels-board.js
// Fourni par le skill equipe-agents-github (d'après le script de P42).
// Lancé par le workflow « Synchroniser les labels avec le board » via actions/github-script.
//
// Étape 1, lireBoard (jeton BOARD_TOKEN) : lit la colonne de chaque ticket du GitHub Project.
//   Pour un board personnel, seul un jeton personnel classique peut le lire.
// Étape 2, appliquerLabels (jeton automatique du workflow) : recopie ces colonnes dans les
//   labels miroirs, et renvoie les tickets qui viennent d'arriver dans la colonne d'entrée.
//   Chaque étape github-script n'a qu'un jeton, d'où les deux étapes.
//
// Règles :
// - un ticket ouvert porte le label miroir de sa colonne, si elle est suivie ;
// - un ticket fermé, absent du board ou dans une colonne non suivie perd ses labels miroirs ;
// - « nouveau » = le ticket reçoit le label d'entrée alors qu'il ne l'avait pas :
//   la routine n'est prévenue qu'une fois par arrivée.
//
// Variables d'environnement :
//   BOARD_PROPRIETAIRE, BOARD_NUMERO, BOARD_CHAMP          (étape 1)
//   COLONNES (sortie de l'étape 1), ETATS, LABEL_ENTREE      (étape 2)
//   ETATS = {"colonne": "label", ...}, dans l'ordre entrée, revue, autres.

'use strict';

// Couleurs données aux labels miroirs créés, dans l'ordre de ETATS.
const COULEURS = ['fbca04', '0e8a16', '1d76db', 'bfd4f2'];

const REQUETE_BOARD = `
query($login: String!, $numero: Int!, $champ: String!, $curseur: String) {
  repositoryOwner(login: $login) {
    ... on User { projectV2(number: $numero) { ...Elements } }
    ... on Organization { projectV2(number: $numero) { ...Elements } }
  }
}
fragment Elements on ProjectV2 {
  title
  items(first: 100, after: $curseur) {
    pageInfo { hasNextPage endCursor }
    nodes {
      colonne: fieldValueByName(name: $champ) {
        ... on ProjectV2ItemFieldSingleSelectValue { name }
      }
      content {
        ... on Issue { number state repository { nameWithOwner } }
      }
    }
  }
}`;

// Étape 1 : renvoie [{ numero, colonne }] pour chaque ticket du dépôt présent sur le board.
// Un ticket fermé est renvoyé avec colonne = null.
async function lireBoard({ github, context, core }) {
  const login = process.env.BOARD_PROPRIETAIRE;
  const numero = Number(process.env.BOARD_NUMERO);
  const champ = process.env.BOARD_CHAMP || 'Status';
  const depot = `${context.repo.owner}/${context.repo.repo}`.toLowerCase();

  const tickets = [];
  let curseur = null;
  let titre = null;
  do {
    const reponse = await github.graphql(REQUETE_BOARD, { login, numero, champ, curseur });
    const projet = reponse.repositoryOwner && reponse.repositoryOwner.projectV2;
    if (!projet) {
      core.setFailed(
        `Board ${login}/projects/${numero} introuvable ou illisible. Vérifier BOARD_PROPRIETAIRE, ` +
          `BOARD_NUMERO et les droits du secret BOARD_TOKEN.`
      );
      return;
    }
    titre = projet.title;
    for (const element of projet.items.nodes) {
      const ticket = element.content;
      if (!ticket || !ticket.number || !ticket.repository) continue; // brouillon ou PR
      if (ticket.repository.nameWithOwner.toLowerCase() !== depot) continue; // autre dépôt
      const ouvert = ticket.state === 'OPEN';
      tickets.push({ numero: ticket.number, colonne: ouvert && element.colonne ? element.colonne.name : null });
    }
    curseur = projet.items.pageInfo.hasNextPage ? projet.items.pageInfo.endCursor : null;
  } while (curseur);

  core.info(`Board « ${titre} » : ${tickets.length} ticket(s) de ${depot}.`);
  core.setOutput('colonnes', JSON.stringify(tickets));
}

// Fonction pure (testable sans GitHub) : labels à poser et à retirer.
//   tickets : [{ numero, colonne }]   etats : { colonne: label }
//   actuels : { label: Set(numéros) } labels miroirs posés aujourd'hui
function calculerChangements(tickets, etats, actuels) {
  const aPoser = [];
  const aRetirer = [];
  for (const label of [...new Set(Object.values(etats))]) {
    const voulus = new Set(tickets.filter((t) => t.colonne && etats[t.colonne] === label).map((t) => t.numero));
    const poses = actuels[label] || new Set();
    for (const n of voulus) if (!poses.has(n)) aPoser.push({ numero: n, label });
    for (const n of poses) if (!voulus.has(n)) aRetirer.push({ numero: n, label });
  }
  const tri = (a, b) => a.numero - b.numero;
  return { aPoser: aPoser.sort(tri), aRetirer: aRetirer.sort(tri) };
}

// Étape 2 : applique les changements et signale les nouvelles arrivées.
async function appliquerLabels({ github, context, core }) {
  const { owner, repo } = context.repo;
  const etats = JSON.parse(process.env.ETATS || '{}');
  const labelEntree = process.env.LABEL_ENTREE;
  const tickets = JSON.parse(process.env.COLONNES || '[]');
  const labels = [...new Set(Object.values(etats))];

  if (!labelEntree || !labels.includes(labelEntree)) {
    core.setFailed(`LABEL_ENTREE (« ${labelEntree} ») doit être l'un des labels de ETATS.`);
    return;
  }

  // Créer les labels miroirs manquants
  const colonneDe = Object.fromEntries(Object.entries(etats).map(([colonne, label]) => [label, colonne]));
  for (const [i, nom] of labels.entries()) {
    try {
      await github.rest.issues.getLabel({ owner, repo, name: nom });
    } catch (erreur) {
      if (erreur.status !== 404) throw erreur;
      await github.rest.issues.createLabel({
        owner, repo, name: nom, color: COULEURS[Math.min(i, COULEURS.length - 1)],
        description: `Copie de la colonne ${colonneDe[nom]} du board (posé par une Action)`,
      });
      core.info(`Label créé : ${nom}`);
    }
  }

  // Labels miroirs posés aujourd'hui (tickets ouverts ou fermés, hors PR)
  const actuels = {};
  for (const nom of labels) {
    const issues = await github.paginate(github.rest.issues.listForRepo, {
      owner, repo, labels: nom, state: 'all', per_page: 100,
    });
    actuels[nom] = new Set(issues.filter((issue) => !issue.pull_request).map((issue) => issue.number));
  }

  const { aPoser, aRetirer } = calculerChangements(tickets, etats, actuels);

  for (const { numero, label } of aRetirer) {
    try {
      await github.rest.issues.removeLabel({ owner, repo, issue_number: numero, name: label });
    } catch (erreur) {
      if (erreur.status !== 404) throw erreur; // déjà retiré entre-temps
    }
    core.info(`#${numero} : label ${label} retiré.`);
  }
  for (const { numero, label } of aPoser) {
    await github.rest.issues.addLabels({ owner, repo, issue_number: numero, labels: [label] });
    core.info(`#${numero} : label ${label} posé.`);
  }
  if (aPoser.length === 0 && aRetirer.length === 0) core.info('Labels déjà à jour, rien à changer.');

  const nouveaux = aPoser.filter(({ label }) => label === labelEntree).map(({ numero }) => `#${numero}`);
  core.info(nouveaux.length ? `Nouveaux dans ${labelEntree} : ${nouveaux.join(', ')}` : `Aucun nouveau ticket dans ${labelEntree}.`);
  core.setOutput('nouveaux_en_attente', nouveaux.join(', '));
}

module.exports = { lireBoard, appliquerLabels, calculerChangements };
