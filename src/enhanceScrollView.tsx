import React, { ComponentType, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollViewProps,
} from 'react-native';
import { ScrollViewEnhancerView } from './native';
import type {
  EnhancedScrollViewProps,
  GetProps,
  ScrollViewEnhancerProps,
} from './types';
import { getRNVersion } from './utils';

export const enhanceScrollView = <
  T extends ComponentType<P>,
  P extends ScrollViewEnhancerProps = GetProps<T>
>(
  ScrollViewComponent: T
) => {
  const { minor } = getRNVersion();
  return React.forwardRef<T, P & EnhancedScrollViewProps>(
    (props: P, ref?: any): React.ReactElement | null => {
      const { renderScrollView } = useBiDirection(
        ScrollViewComponent,
        props,
        ref
      );

      if (Platform.OS === 'android' && minor < 72) {
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

export function useBiDirection<
  P extends ScrollViewProps & EnhancedScrollViewProps = {}
>(Component: ComponentType<P>, props: P, ref?: any) {
  const innerRef = useRef<any>();
  const getRef = () => ref || innerRef;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    props.onScroll?.(e);

    console.log(getRef());
  };

  const renderScrollView = () => {
    return (
      <Component
        scrollEventThrottle={16}
        {...props}
        ref={getRef()}
        onScroll={onScroll}
      />
    );
  };

  return {
    renderScrollView,
  };
}
