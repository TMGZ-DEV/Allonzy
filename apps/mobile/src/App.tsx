import { NOM_APPLICATION, decrireApplication } from '@allonzy/shared';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import configuration from '../app.json';

/**
 * Écran unique du socle (T00.1) : il prouve que @allonzy/shared est importable
 * depuis l'application mobile. Ni thème ni navigation ici (tickets T12.3 et T12.4).
 */
export default function App() {
  return (
    <View style={styles.conteneur}>
      <Text>
        {decrireApplication({ nom: NOM_APPLICATION, version: configuration.expo.version })}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
