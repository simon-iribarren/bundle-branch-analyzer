export interface BundleStatI {
  name: string;
  targetSize: number;
  currentSize: number;
  difference: number;
  pdiff: number;
}

export interface BundlesReportI {
  onlyInCurrent: BundleStatI[];
  onlyInTarget: BundleStatI[];
  biggerInCurrent: BundleStatI[];
  smallerInCurrent: BundleStatI[];
  equal: BundleStatI[];
  totalDiff: number;
  totalPercentage: number;
}

export interface OptionsI {
  targetBranch: string;
  skipPrompts: boolean;
  webpackConfigScript: string;
  currentBranch?: string;
  packageManager?: string;
  webpackConfigDir?: string;
}

export interface AssetI {
  name: string;
  size: number;
  chunks: number[];
  chunkNames: string[];
  emitted: boolean;
}

export interface AssetCollectionI {
  [key: string]: number;
}
