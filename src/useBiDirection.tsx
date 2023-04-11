import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';
import type { EnhancedScrollViewProps } from './types';
import React, { ComponentType, useRef } from 'react';

const ON_EDGE_REACHED_EPSILON = 0.001;
const DEFAULT_EDGE_REACHED_THRESHOLD = 2;
function onEdgeReachedThresholdOrDefault(
  visibleLength: number,
  onEdgeReachedThreshold?: number | null
) {
  if (typeof onEdgeReachedThreshold === 'number') {
    console.log('??', onEdgeReachedThreshold);
    return onEdgeReachedThreshold * visibleLength;
  }
  return DEFAULT_EDGE_REACHED_THRESHOLD;
}

export function useBiDirection<
  P extends ScrollViewProps &
    EnhancedScrollViewProps & { initialScrollIndex?: number } = {}
>(Component: ComponentType<P>, props: P, ref?: any) {
  const innerRef = useRef<any>();
  const getRef = () => ref || innerRef;

  const scrollMetrics = useRef({ timestamp: 0 });
  const sentEndForContentLength = useRef(0);
  const sentStartForContentLength = useRef(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('scrollEvent start:', e.timeStamp);
    props.onScroll?.(e);

    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const { horizontal, onEndReached, onStartReached } = props;

    const isHorizontal = horizontal ?? false;
    const offset = isHorizontal ? contentOffset.x : contentOffset.y;
    const visibleLength = horizontal
      ? layoutMeasurement.width
      : layoutMeasurement.height;
    const contentLength = horizontal ? contentSize.width : contentSize.height;

    let distanceFromStart = offset;
    let distanceFromEnd = contentLength - visibleLength - offset;

    // Especially when oERT is zero it's necessary to 'floor' very small distance values to be 0
    // since debouncing causes us to not fire this event for every single "pixel" we scroll and can thus
    // be at the edge of the list with a distance approximating 0 but not quite there.
    if (distanceFromStart < ON_EDGE_REACHED_EPSILON) {
      distanceFromStart = 0;
    }
    if (distanceFromEnd < ON_EDGE_REACHED_EPSILON) {
      distanceFromEnd = 0;
    }
    // console.log(onStartReachedThreshold, onEndReachedThreshold);

    const startThreshold = onEdgeReachedThresholdOrDefault(
      visibleLength,
      props.onStartReachedThreshold
    );
    const endThreshold = onEdgeReachedThresholdOrDefault(
      visibleLength,
      props.onEndReachedThreshold
    );

    // console.log('start', startThreshold, distanceFromStart);
    // console.log('end', endThreshold, distanceFromEnd);

    const isWithinStartThreshold = distanceFromStart <= startThreshold;
    const isWithinEndThreshold = distanceFromEnd <= endThreshold;

    // First check if the user just scrolled within the end threshold
    // and call onEndReached only once for a given content length,
    // and only if onStartReached is not being executed
    if (
      onEndReached &&
      isWithinEndThreshold &&
      contentLength !== sentEndForContentLength.current
      //&& this.state.cellsAroundViewport.last === getItemCount(data) - 1 -> is the last item?
    ) {
      sentEndForContentLength.current = contentLength;
      onEndReached({ distanceFromEnd });
    }
    // Next check if the user just scrolled within the start threshold
    // and call onStartReached only once for a given content length,
    // and only if onEndReached is not being executed
    else if (
      onStartReached != null &&
      isWithinStartThreshold &&
      contentLength !== sentStartForContentLength.current
      //&& this.state.cellsAroundViewport.first === 0 && -> is the first item?
    ) {
      // On initial mount when using initialScrollIndex the offset will be 0 initially
      // and will trigger an unexpected onStartReached. To avoid this we can use
      // timestamp to differentiate between the initial scroll metrics and when we actually
      // received the first scroll event.
      if (!props.initialScrollIndex || scrollMetrics.current.timestamp !== 0) {
        sentStartForContentLength.current = contentLength;
        onStartReached({ distanceFromStart });
      }
    }
    // If the user scrolls away from the start or end and back again,
    // cause onStartReached or onEndReached to be triggered again
    else {
      sentStartForContentLength.current = isWithinStartThreshold
        ? sentStartForContentLength.current
        : 0;
      sentEndForContentLength.current = isWithinEndThreshold
        ? sentEndForContentLength.current
        : 0;
    }

    scrollMetrics.current.timestamp = e.timeStamp;
    console.log('scrollEvent end:', e.timeStamp);
  };

  const renderScrollView = () => {
    return (
      <Component
        scrollEventThrottle={16}
        {...props}
        ref={getRef()}
        onScroll={onScroll}
        onEndReached={null}
      />
    );
  };

  return {
    renderScrollView,
  };
}
