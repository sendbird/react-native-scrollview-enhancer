import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-scrollview-enhancer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ScrollviewEnhancerProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ScrollviewEnhancerView';

export const ScrollviewEnhancerView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ScrollviewEnhancerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
