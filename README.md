# @sendbird/react-native-scrollview-enhancer

A utility package that enables the use of `onStartReached` and `maintainVisibleContentPosition` features in ScrollView components in react-native versions prior to 0.72.

## Installation

```sh
npm install @sendbird/react-native-scrollview-enhancer
```

| React-Native version | react-native-scrollview-enhancer version |
| -------------------- | ---------------------------------------- |
| `>=0.64`             | `0.2.x`                                  |
| `<=0.63`             | `0.1.2`                                  |

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

It is recommended to use stable features provided in versions 0.72 and above.

- Since updates occur in the middle of React-Native's update cycle rather than the Android view and VirtualizedList update cycle, some bugs may be caused by delayed updates.
- Fabric(new architecture of React-Native) is not supported.
- Horizontal maintainVisibleContentPosition is not supported.

## Related PRs

You can find the related work for these features in the following PR.

- [#35993 Fix VirtualizedList with maintainVisibleContentPosition](https://github.com/facebook/react-native/pull/35993)
- [#35321 Add onStartReached and onStartReachedThreshold to VirtualizedList](https://github.com/facebook/react-native/pull/35321)
- [#35049 Add maintainVisibleContentPosition support on Android for legacy renderer](https://github.com/facebook/react-native/pull/35049)
- [#35994 Add fabric support for maintainVisibleContentPosition on Android](https://github.com/facebook/react-native/pull/35994)
- [#36095 Add fabric support for maintainVisibleContentPosition on iOS](https://github.com/facebook/react-native/pull/36095)

## License

MIT

<br/>

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
