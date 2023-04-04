import { Platform } from 'react-native';
import type { ScrollViewEnhancerProps } from './types';

const pkgVersion = require('react-native/package.json').version as string;
const [major, minor, patch] = pkgVersion.split('.').map((it) => Number(it)) as [
  number,
  number,
  number
];
const parsedVersion = { major, minor, patch };

let _warningCalled = false;
export function warningOnHorizontalScroll(props: ScrollViewEnhancerProps) {
  if (props.horizontal && Platform.OS === 'android' && !_warningCalled) {
    _warningCalled = true;
    console.warn(
      'ScrollViewEnhancerView does not support horizontal direction'
    );
  }
}

export function getRNVersion() {
  return parsedVersion;
}
