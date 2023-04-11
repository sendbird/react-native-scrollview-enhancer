import { FlatList as RNFlatList, ScrollView as RNScrollView, SectionList as RNSectionList } from 'react-native';
import type { EnhancedScrollViewAbstraction } from './types';
import { enhanceScrollView } from './enhanceScrollView';

const ScrollView = enhanceScrollView(RNScrollView);
const FlatList = enhanceScrollView(RNFlatList) as unknown as
  | typeof RNFlatList
  | EnhancedScrollViewAbstraction<RNFlatList>;
const SectionList = enhanceScrollView(RNSectionList) as unknown as
  | typeof RNSectionList
  | EnhancedScrollViewAbstraction<RNSectionList>;

export { enhanceScrollView } from './enhanceScrollView';
export { useBiDirection } from './useBiDirection';
export { ScrollViewEnhancerView } from './native';
export { ScrollView, FlatList, SectionList };
