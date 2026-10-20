import { describe, expect, it } from 'vitest';

import { descriptionApi, infosApi } from './application';

describe("identité de l'API", () => {
  it('utilise le type et la fonction de @allonzy/shared', () => {
    expect(infosApi.nom).toBe('Allonzy API');
    expect(descriptionApi()).toBe('Allonzy API 0.0.0');
  });
});
