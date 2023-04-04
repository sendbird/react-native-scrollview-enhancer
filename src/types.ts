import type {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

export type ScrollViewEnhancerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean | null;
  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
}>;

export type EnhancedScrollViewProps = {
  /**
   * Called once when the scroll position gets within `onStartReachedThreshold`
   * from the logical start of the list.
   */
  onStartReached?:
    | ((info: { distanceFromStart: number }) => void)
    | null
    | undefined;

  /**
   * How far from the start (in units of visible length of the list) the leading edge of the
   * list must be from the start of the content to trigger the `onStartReached` callback.
   * Thus, a value of 0.5 will trigger `onStartReached` when the start of the content is
   * within half the visible length of the list.
   */
  onStartReachedThreshold?: number | null | undefined;

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus, a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number | null | undefined;

  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
};

export type GetProps<T> = T extends ComponentType<infer P> ? P : never;
export type InjectProps<C, P> = C extends ComponentType<infer T>
  ? ComponentType<T & P>
  : never;
export type EnhancedScrollViewAbstraction<T> = ForwardRefExoticComponent<
  PropsWithoutRef<EnhancedScrollViewProps> & RefAttributes<T>
>;
