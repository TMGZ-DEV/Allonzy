/**
 * Type de démonstration du socle (T00.1) : il prouve que le paquet partagé
 * est importable depuis l'API et depuis l'application mobile. Les vrais
 * contrats (routes, événements Socket.IO) viendront avec les tickets métier.
 */
export interface InfosApplication {
  /** Nom affiché de l'application. */
  nom: string;
  /** Version au format « majeur.mineur.correctif ». */
  version: string;
}

export const NOM_APPLICATION = 'Allonzy';

/** Rend une description lisible, par exemple « Allonzy 0.1.0 ». */
export function decrireApplication(infos: InfosApplication): string {
  return `${infos.nom} ${infos.version}`;
}
