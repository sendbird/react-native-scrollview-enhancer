import type { NativeScrollEvent, NativeSyntheticEvent, VirtualizedListProps } from 'react-native';
import type { EnhancedScrollViewProps } from './types';
import React, { ComponentType, useRef } from 'react';
import { deferred } from './deferred';

type ScrollMetrics = {
  offset: number;
  visibleLength: number;
  contentLength: number;
  timestamp: number;
};

const ON_EDGE_REACHED_EPSILON = 0.001;
const DEFAULT_LAZY_FETCH_MS = 250;
const DEFAULT_EDGE_REACHED_THRESHOLD = 2;

function onEdgeReachedThresholdOrDefault(visibleLength: number, onEdgeReachedThreshold?: number | null) {
  if (typeof onEdgeReachedThreshold === 'number') {
    return onEdgeReachedThreshold * visibleLength;
  }
  return DEFAULT_EDGE_REACHED_THRESHOLD;
}

export function useBiDirection<P extends Partial<VirtualizedListProps<any> & EnhancedScrollViewProps> = {}>(
  Component: ComponentType<P>,
  props: P,
  ref?: any
) {
  const innerRef = useRef<any>();
  const scrollRef = () => ref || innerRef;
  const scrollMetrics = useRef<ScrollMetrics>({ offset: 0, visibleLength: -1, contentLength: -1, timestamp: 0 });

  const isHorizontal = props.horizontal ?? false;
  const sentEndForContentLength = useRef(0);
  const sentStartForContentLength = useRef(0);

  function maybeRecallOnEdgeReached(key: 'distanceFromStart' | 'distanceFromEnd', threshold: number) {
    const distanceFromEdge = getDistanceFrom(
      scrollMetrics.current.offset,
      scrollMetrics.current.visibleLength,
      scrollMetrics.current.contentLength
    )[key];

    if (distanceFromEdge <= threshold) {
      const lazyOnEdgeReached = key === 'distanceFromStart' ? lazyOnStartReached : lazyOnEndReached;
      lazyOnEdgeReached(distanceFromEdge);
    }
  }

  function getDistanceFrom(offset: number, visibleLength: number, contentLength: number) {
    let distanceFromStart = offset;
    let distanceFromEnd = contentLength - visibleLength - offset;

    // Especially when oERT is zero it's necessary to 'floor' very small distance values to be 0
    // since debouncing causes us to not fire this event for every single "pixel" we scroll and can thus
    // be at the edge of the list with a distance approximating 0 but not quite there.
    if (distanceFromStart < ON_EDGE_REACHED_EPSILON) distanceFromStart = 0;
    if (distanceFromEnd < ON_EDGE_REACHED_EPSILON) distanceFromEnd = 0;

    return { distanceFromStart, distanceFromEnd };
  }

  function updateScrollMetrics(metrics: Partial<ScrollMetrics>) {
    if (typeof metrics.offset === 'number') {
      scrollMetrics.current.offset = metrics.offset;
    }
    if (typeof metrics.visibleLength === 'number') {
      scrollMetrics.current.visibleLength = metrics.visibleLength;
    }
    if (typeof metrics.contentLength === 'number') {
      scrollMetrics.current.contentLength = metrics.contentLength;
    }
    if (typeof metrics.timestamp === 'number') {
      scrollMetrics.current.timestamp = metrics.timestamp;
    }
  }

  async function lazyOnEndReached(distanceFromEnd: number): Promise<void> {
    const p = deferred<void>();

    const res = props.onEndReached?.({ distanceFromEnd });
    // @ts-ignore
    if (res instanceof Promise) {
      res.then(() => p.resolve());
    } else {
      setTimeout(() => p.resolve(), DEFAULT_LAZY_FETCH_MS);
    }

    return p.promise;
  }

  async function lazyOnStartReached(distanceFromStart: number): Promise<void> {
    const p = deferred<void>();

    const res = props.onStartReached?.({ distanceFromStart });
    // @ts-ignore
    if (res instanceof Promise) {
      res.then(() => p.resolve());
    } else {
      setTimeout(() => {
        p.resolve();
      }, DEFAULT_LAZY_FETCH_MS);
    }

    return p.promise;
  }

  const maybeCallOnEdgeReached = (offset: number, visibleLength: number, contentLength: number) => {
    if (visibleLength < 0 || contentLength < 0) return;

    const { onEndReached, onStartReached } = props;

    const { distanceFromStart, distanceFromEnd } = getDistanceFrom(offset, visibleLength, contentLength);

    const startThreshold = onEdgeReachedThresholdOrDefault(visibleLength, props.onStartReachedThreshold);
    const endThreshold = onEdgeReachedThresholdOrDefault(visibleLength, props.onEndReachedThreshold);

    const isWithinStartThreshold = distanceFromStart <= startThreshold;
    const isWithinEndThreshold = distanceFromEnd <= endThreshold;

    // First check if the user just scrolled within the end threshold
    // and call onEndReached only once for a given content length,
    // and only if onStartReached is not being executed
    if (onEndReached && isWithinEndThreshold && sentEndForContentLength.current !== contentLength) {
      sentEndForContentLength.current = contentLength;

      lazyOnEndReached(distanceFromEnd).then(() => {
        maybeRecallOnEdgeReached('distanceFromEnd', endThreshold);
      });
    }
    // Next check if the user just scrolled within the start threshold
    // and call onStartReached only once for a given content length,
    // and only if onEndReached is not being executed
    else if (onStartReached != null && isWithinStartThreshold && sentStartForContentLength.current !== contentLength) {
      // On initial mount when using initialScrollIndex the offset will be 0 initially
      // and will trigger an unexpected onStartReached. To avoid this we can use
      // timestamp to differentiate between the initial scroll metrics and when we actually
      // received the first scroll event.
      if (!props.initialScrollIndex || scrollMetrics.current.timestamp !== 0) {
        sentStartForContentLength.current = contentLength;

        lazyOnStartReached(distanceFromStart).then(() => {
          maybeRecallOnEdgeReached('distanceFromStart', endThreshold);
        });
      }
    }
    // If the user scrolls away from the start or end and back again,
    // cause onStartReached or onEndReached to be triggered again
    else {
      if (!isWithinEndThreshold) {
        sentEndForContentLength.current = 0;
      }
      if (!isWithinStartThreshold) {
        sentStartForContentLength.current = 0;
      }
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    props.onScroll?.(e);

    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;

    const offset = isHorizontal ? contentOffset.x : contentOffset.y;
    const visibleLength = isHorizontal ? layoutMeasurement.width : layoutMeasurement.height;
    const contentLength = isHorizontal ? contentSize.width : contentSize.height;

    maybeCallOnEdgeReached(offset, visibleLength, contentLength);
    updateScrollMetrics({ offset, visibleLength, contentLength, timestamp: e.timeStamp });
  };

  const onContentSizeChange = (w: number, h: number) => {
    props.onContentSizeChange?.(w, h);
    updateScrollMetrics({ contentLength: isHorizontal ? w : h });
  };

  const renderScrollView = () => {
    return (
      <Component
        {...props}
        ref={scrollRef()}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        onEndReached={null}
      />
    );
  };

  return {
    renderScrollView,
  };
}
