import * as React from 'react';
import { useRef, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  FlatList,
  ScrollView,
} from '@sendbird/react-native-scrollview-enhancer';

function messageFetcher(count: number) {
  return new Array(count)
    .fill(0)
    .map((_, index) => ({
      id: `${index}+${Date.now()}`,
      message: `Message ${index}`,
    }))
    .reverse();
}

class BasicQuery {
  private _messages = messageFetcher(500).reverse();
  private _cursor = {
    prev: this._messages.length / 2,
    next: this._messages.length / 2 - 1,
  };

  loadPrev(count: number) {
    const sliceRange = [this._cursor.prev, this._cursor.prev + count];
    this._cursor.prev += count;
    return this._messages.slice(...sliceRange);
  }
  loadNext(count: number) {
    const sliceRange = [this._cursor.next - count, this._cursor.next];
    this._cursor.next -= count;
    return this._messages.slice(...sliceRange);
  }
  get hasNext() {
    return this._cursor.next > 0;
  }
  get hasPrev() {
    return this._cursor.prev < this._messages.length;
  }
}

export default function App() {
  const query = useRef(new BasicQuery());
  const [layout, setLayout] = useState(50);
  const [messages, setMessages] = useState<{ id: string; message: string }[]>(
    () => query.current.loadPrev(10)
  );

  const onEndReached = () => {
    console.log('onEndReached');
    setMessages((prev) => [...prev, ...query.current.loadPrev(5)]);
  };

  const onStartReached = () => {
    console.log('onStartReached');
    setMessages((prev) => [...query.current.loadNext(5), ...prev]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>{'123'}</Text>
      </ScrollView>
      <FlatList
        inverted
        style={styles.box}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
          minIndexForVisible: 1,
        }}
        onEndReached={onEndReached}
        onStartReached={onStartReached}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View style={styles.message}>
              <Text style={{ color: 'white' }}>{item.message}</Text>
            </View>
          );
        }}
      />

      <Pressable style={{ width: 100, height: 100 }} onPress={onStartReached}>
        <Text>{'Load next'}</Text>
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
  message: {
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: 4,
    padding: 24,
  },
});
