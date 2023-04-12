import React, { ComponentType } from 'react';
import { Dimensions, Platform } from 'react-native';
import { ScrollViewEnhancerView } from './native';
import type { EnhancedScrollViewProps, GetProps, ScrollViewEnhancerProps } from './types';
import { getRNVersion } from './utils';
import { useBiDirection } from './useBiDirection';

const { minor } = getRNVersion();
const SHOULD_ENHANCE = Platform.OS === 'android' && minor < 72;
const DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD = -(Dimensions.get('window').height * 2);

const getMaintainVisibleContentPosition = (option?: ScrollViewEnhancerProps['maintainVisibleContentPosition']) => {
  return {
    autoscrollToTopThreshold: option?.autoscrollToTopThreshold ?? DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD,
    minIndexForVisible: option?.minIndexForVisible ?? 0,
  };
};

export const enhanceScrollView = <T extends ComponentType<P>, P extends ScrollViewEnhancerProps = GetProps<T>>(
  ScrollViewComponent: T
) => {
  return React.forwardRef<T, P & EnhancedScrollViewProps>((props: P, ref?: any): React.ReactElement | null => {
    const { renderScrollView } = useBiDirection(ScrollViewComponent, props, ref);

    if (SHOULD_ENHANCE) {
      return (
        <ScrollViewEnhancerView
          style={props.style}
          horizontal={props.horizontal}
          maintainVisibleContentPosition={getMaintainVisibleContentPosition(props.maintainVisibleContentPosition)}
        >
          {renderScrollView()}
        </ScrollViewEnhancerView>
      );
    } else {
      return renderScrollView();
    }
  });
};
