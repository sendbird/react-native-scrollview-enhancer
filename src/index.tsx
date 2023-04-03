import React from 'react';
import {
  FlatList as RNFlatList,
  Platform,
  requireNativeComponent,
  ScrollView as RNScrollView,
  ScrollViewProps,
  SectionList as RNSectionList,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-scrollview-enhancer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ScrollViewEnhancerProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean | null;
  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
}>;

const ComponentName = 'ScrollViewEnhancerView';

const NativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ScrollViewEnhancerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

let _warningCalled = false;
function warningOnHorizontalScroll(props: ScrollViewEnhancerProps) {
  if (props.horizontal && Platform.OS === 'android' && !_warningCalled) {
    _warningCalled = true;
    console.warn(
      'ScrollViewEnhancerView does not support horizontal direction'
    );
  }
}

export const ScrollViewEnhancerView = (props: ScrollViewEnhancerProps) => {
  if (__DEV__) warningOnHorizontalScroll(props);
  return <NativeView {...props} />;
};

export const enhanceScrollView = <T extends React.ComponentType<any>>(
  Component: T
): T => {
  return ((props: any) => {
    if (Platform.OS === 'android') {
      return (
        <ScrollViewEnhancerView
          style={props.style}
          horizontal={props.horizontal}
          maintainVisibleContentPosition={props.maintainVisibleContentPosition}
        >
          <Component {...props} />
        </ScrollViewEnhancerView>
      );
    } else {
      return <Component {...props} />;
    }
  }) as T;
};

export const ScrollView = enhanceScrollView(RNScrollView);
export const FlatList = enhanceScrollView(RNFlatList);
export const SectionList = enhanceScrollView(RNSectionList);
