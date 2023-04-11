import React, { ComponentType } from 'react';
import { Platform } from 'react-native';
import { ScrollViewEnhancerView } from './native';
import type {
  EnhancedScrollViewProps,
  GetProps,
  ScrollViewEnhancerProps,
} from './types';
import { getRNVersion } from './utils';
import { useBiDirection } from './useBiDirection';

const { minor } = getRNVersion();
const shouldEnhance = Platform.OS === 'android' && minor < 72;

export const enhanceScrollView = <
  T extends ComponentType<P>,
  P extends ScrollViewEnhancerProps = GetProps<T>
>(
  ScrollViewComponent: T
) => {
  return React.forwardRef<T, P & EnhancedScrollViewProps>(
    (props: P, ref?: any): React.ReactElement | null => {
      const { renderScrollView } = useBiDirection(
        ScrollViewComponent,
        props,
        ref
      );

      if (shouldEnhance) {
        return (
          <ScrollViewEnhancerView
            style={props.style}
            horizontal={props.horizontal}
            maintainVisibleContentPosition={
              props.maintainVisibleContentPosition
            }
          >
            {renderScrollView()}
          </ScrollViewEnhancerView>
        );
      } else {
        return renderScrollView();
      }
    }
  );
};
