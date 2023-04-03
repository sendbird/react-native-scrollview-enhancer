import React from 'react';
import {
  Platform,
  requireNativeComponent,
  ScrollViewProps,
  UIManager,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-scrollview-enhancer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ScrollViewEnhancerProps = React.PropsWithChildren<{
  style?: ViewStyle;
  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
}>;

const ComponentName = 'ScrollViewEnhancerView';

const NativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ScrollViewEnhancerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const ScrollViewEnhancerView = (props: ScrollViewEnhancerProps) => {
  return <NativeView {...props} />;
};
