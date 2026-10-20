import { NOM_APPLICATION, decrireApplication, type InfosApplication } from '@allonzy/shared';

/** Identité de l'API, fondée sur le type partagé avec l'application mobile. */
export const infosApi: InfosApplication = {
  nom: `${NOM_APPLICATION} API`,
  version: '0.0.0',
};

export function descriptionApi(): string {
  return decrireApplication(infosApi);
}
