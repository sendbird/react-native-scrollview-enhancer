import { FlatList as RNFlatList, ScrollView as RNScrollView, SectionList as RNSectionList } from 'react-native';
import type { EnhancedScrollViewAbstraction } from './types';
import { enhanceScrollViewWithBidirectional } from './enhanceScrollView';

const ScrollView = enhanceScrollViewWithBidirectional(RNScrollView);
const FlatList = enhanceScrollViewWithBidirectional(RNFlatList) as unknown as
  | typeof RNFlatList
  | EnhancedScrollViewAbstraction<RNFlatList>;
const SectionList = enhanceScrollViewWithBidirectional(RNSectionList) as unknown as
  | typeof RNSectionList
  | EnhancedScrollViewAbstraction<RNSectionList>;

export { enhanceScrollView, enhanceScrollViewWithBidirectional } from './enhanceScrollView';
export { useBiDirectional } from './useBiDirectional';
export { ScrollViewEnhancerView } from './native';
export { ScrollView, FlatList, SectionList };
