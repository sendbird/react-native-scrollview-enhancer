# @sendbird/react-native-scrollview-enhancer

A utility package that enables the use of `onStartReached` and `maintainVisibleContentPosition` features in ScrollView components in react-native versions prior to 0.72.

## Installation

```sh
npm install @sendbird/react-native-scrollview-enhancer
```

## Usage

You can use a scroll view components with `onStartReached` and `maintainVisibleContentPosition` applied as follows.

```tsx
import { FlatList, ScrollView, SectionList } from '@sendbird/react-native-scrollview-enhancer';

const App = () => {
  return (
    <FlatList
      inverted
      data={messages}
      renderItem={renderMessageItem}
      onEndReached={onEndReached}
      onStartReached={onStartReached}
    />
  );
};
```

## Customization

### maintainVisibleContentPosition

The `maintainVisibleContentPosition` feature can be used by wrapping the ScrollView component (`ScrollView`, `FlatList`, `SectionList`, `VirtualizedList`) that you want to use with the `ScrollViewEnhancerView` component.

```tsx
import { ScrollView } from 'react-native';
import { ScrollViewEnhancerView } from '@sendbird/react-native-scrollview-enhancer';

const App = () => {
  return (
    <ScrollViewEnhancerView>
      <ScrollView />
    </ScrollViewEnhancerView>
  );
};
```

### onStartReached

This package provides a `useBidirectional` hook that adds `onStartReached` to the `ScrollView`.

```tsx
import { View, FlatList } from 'react-native';
import { useBiDirectional } from '@sendbird/react-native-scrollview-enhancer';

const App = () => {
  const { renderScrollView } = useBiDirectional(FlatList, props, ref);
  return <View>{renderScrollView()}</View>;
};
```

### Utility functions

This package provides the following utility functions to make it easier to use:

- enhanceScrollView: adds `maintainVisibleContentPosition` feature to the ScrollView component
- enhanceScrollViewWithBidirectional: adds `maintainVisibleContentPosition` and `onStartReached` features to the ScrollView component

```tsx
import { ScrollView, FlatList } from 'react-native';
import { enhanceScrollView, enhanceScrollViewWithBidirectional } from '@sendbird/react-native-scrollview-enhancer';

const EnhancedScrollView = enhanceScrollView(ScrollView);
const BiDirectionalFlatList = enhanceScrollViewWithBidirectional(FlatList);
```

## Limitations

Since updates occur in the middle of React-Native's update cycle rather than the normal Android view, VirtualizedList update cycle, some bugs may be caused by delayed updates.
It is recommended to use stable features provided in versions 0.72 and above.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
