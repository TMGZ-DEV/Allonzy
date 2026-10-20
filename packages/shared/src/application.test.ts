import { describe, expect, it } from 'vitest';

import { NOM_APPLICATION, decrireApplication } from './index';

describe('decrireApplication', () => {
  it('assemble le nom et la version', () => {
    expect(decrireApplication({ nom: NOM_APPLICATION, version: '0.1.0' })).toBe('Allonzy 0.1.0');
  });
});
