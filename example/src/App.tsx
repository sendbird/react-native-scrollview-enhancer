import * as React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { ScrollViewEnhancerView } from '@sendbird/react-native-scrollview-enhancer';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollViewEnhancerView
        style={styles.box}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 10,
          minIndexForVisible: 0,
        }}
      >
        <ScrollView
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 10,
            minIndexForVisible: 0,
          }}
        />
      </ScrollViewEnhancerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderWidth: 1,
    backgroundColor: 'red',
    marginVertical: 20,
  },
});
