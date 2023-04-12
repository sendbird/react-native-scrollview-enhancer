import * as React from 'react';
import { useRef, useState } from 'react';

import { FlatList as RNFlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from '@sendbird/react-native-scrollview-enhancer';

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
  const [messages, setMessages] = useState<{ id: string; message: string }[]>(() => query.current.loadPrev(10));

  const viewRef = useRef<RNFlatList>(null);

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
      <FlatList
        inverted
        ref={viewRef}
        style={styles.box}
        onEndReached={onEndReached}
        onStartReached={onStartReached}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View style={styles.message}>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          );
        }}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => viewRef.current?.scrollToEnd()}>
          <Text>{'scroll to end'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => viewRef.current?.scrollToOffset({ offset: 0 })}>
          <Text>{'scroll to start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: 'black',
    flex: 1,
  },
  message: {
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: 4,
    padding: 24,
  },
  messageText: {
    fontWeight: 'bold',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 80,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b77ff',
  },
});
