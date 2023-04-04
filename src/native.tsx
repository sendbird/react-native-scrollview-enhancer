import React from 'react';
import { Platform, requireNativeComponent, UIManager } from 'react-native';

import type { ScrollViewEnhancerProps } from './types';
import { warningOnHorizontalScroll } from './utils';

const LINKING_ERROR =
  `The package 'react-native-scrollview-enhancer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'ScrollViewEnhancerView';
export const NativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ScrollViewEnhancerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const ScrollViewEnhancerView = (props: ScrollViewEnhancerProps) => {
  if (__DEV__) warningOnHorizontalScroll(props);
  return <NativeView {...props} />;
};
