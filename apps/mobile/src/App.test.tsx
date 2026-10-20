import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
  it('affiche le nom et la version venant de @allonzy/shared', async () => {
    await render(<App />);

    expect(screen.getByText('Allonzy 0.1.0')).toBeTruthy();
  });
});
