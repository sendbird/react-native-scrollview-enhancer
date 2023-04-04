import * as React from 'react';
import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  FlatList,
  ScrollView,
} from '@sendbird/react-native-scrollview-enhancer';

let lastIdx = 0;
function messageFetcher(count: number) {
  const response = new Array(count)
    .fill(0)
    .map((_, index) => ({
      id: `${index}+${Date.now()}`,
      message: `Message ${lastIdx + index}`,
    }))
    .reverse();
  lastIdx += count;
  return response;
}

export default function App() {
  const [layout, setLayout] = useState(50);
  const [messages, setMessages] = useState<{ id: string; message: string }[]>(
    () => messageFetcher(5)
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>{'123'}</Text>
      </ScrollView>
      <FlatList
        inverted
        style={styles.box}
        onStartReachedThreshold={2}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
          minIndexForVisible: 1,
        }}
        onStartReached={() => {
          setMessages((prev) => [...prev, ...messageFetcher(20)]);
        }}
        onEndReached={() => {
          setMessages((prev) => [...messageFetcher(20), ...prev]);
        }}
        onLayout={(e) => console.log('flatlist', e.nativeEvent)}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: '100%',
                backgroundColor: 'gray',
                marginBottom: 4,
                padding: 24,
              }}
            >
              <Text style={{ color: 'white' }}>{item.message}</Text>
            </View>
          );
        }}
      />
      <Pressable
        style={{ width: 100, height: 100 }}
        onPress={() => {
          setMessages((prev) => [...messageFetcher(20), ...prev]);
        }}
      >
        <Text>{'Load more'}</Text>
      </Pressable>

      <View style={{ width: layout, height: 20, backgroundColor: 'blue' }}>
        <Pressable onPress={() => setLayout((prev) => (prev === 25 ? 50 : 25))}>
          <Text>{'Change'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
  },
});
