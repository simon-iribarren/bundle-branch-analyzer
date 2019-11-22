import * as path from 'path';
import {
  BundleStatI,
  BundlesReportI,
  AssetI,
  AssetCollectionI,
  OptionsI,
  AssetsByChunkI,
  ChunksByAssetI,
} from './types';
const cwd = process.cwd();

function assetsReducer(
  result: AssetCollectionI,
  value: AssetI
): AssetCollectionI {
  result[value.name] = value.size / 1024;
  return result;
}

function getPercentage(current: number, target: number): number {
  if (current === 0) {
    return 100;
  } else if (target === 0) {
    return -100;
  } else {
    return (1 - target / current) * 100;
  }
}

function formatAssets(current = 0, target = 0, name: string): BundleStatI {
  const diff = current - target;
  const percentage = getPercentage(current, target);

  return {
    name,
    targetSize: target,
    currentSize: current,
    difference: diff,
    pdiff: percentage,
  };
}

function getChunksByAsset(chunkNames: AssetsByChunkI): ChunksByAssetI {
  return Object.entries(chunkNames).reduce(
    (result: ChunksByAssetI, [name, assets]) => {
      for (const asset of assets) {
        result[asset] = name;
      }
      return result;
    },
    {}
  );
}

function getStatAssets(options: OptionsI) {
  const targetStatsPath = path.join(
    cwd,
    options.bundleDir,
    `${options.targetBranch}-stats.json`
  );
  const currentStatsPath = path.join(
    cwd,
    options.bundleDir,
    `${options.currentBranch}-stats.json`
  );
  const currentStats = require(currentStatsPath);
  const targetStats = require(targetStatsPath);

  const currentStatsAssets = currentStats.assets.reduce(assetsReducer, {});

  const targetStatsAssets = targetStats.assets.reduce(assetsReducer, {});

  const currentBranchChunkNames = getChunksByAsset(
    currentStats.assetsByChunkName
  );
  const targetBranchChunkNames = getChunksByAsset(
    targetStats.assetsByChunkName
  );

  return {
    currentStatsAssets,
    currentBranchChunkNames,
    targetStatsAssets,
    targetBranchChunkNames,
  };
}

export function compareStats(options: OptionsI): BundlesReportI {
  const {
    currentStatsAssets,
    targetStatsAssets,
    currentBranchChunkNames,
    targetBranchChunkNames,
  } = getStatAssets(options);

  const assetsNames = Object.keys({
    ...currentStatsAssets,
    ...targetStatsAssets,
  });

  const onlyInCurrent: BundleStatI[] = [];
  const onlyInTarget: BundleStatI[] = [];
  const biggerInCurrent: BundleStatI[] = [];
  const smallerInCurrent: BundleStatI[] = [];
  const equal: BundleStatI[] = [];
  const byEntry: BundleStatI[] = [];

  let totalDiff = 0;
  let totalCurrent = 0;
  let totalTarget = 0;

  for (const key of assetsNames) {
    if (!key.includes('.map')) {
      const current = currentStatsAssets[key];
      const target = targetStatsAssets[key];
      const formatted: BundleStatI = formatAssets(current, target, key);

      if (currentBranchChunkNames[key] || targetBranchChunkNames[key]) {
        byEntry.push({
          ...formatted,
          name: currentBranchChunkNames[key] || targetBranchChunkNames[key],
        });
      }

      if (!current) {
        onlyInTarget.push(formatted);
      } else if (!target) {
        onlyInCurrent.push(formatted);
      } else if (formatted.difference > 0) {
        biggerInCurrent.push(formatted);
      } else if (formatted.difference < 0) {
        smallerInCurrent.push(formatted);
      } else {
        equal.push(formatted);
      }
      totalCurrent += formatted.currentSize;
      totalTarget += formatted.targetSize;
      totalDiff += formatted.difference;
    }
  }

  const totalPercentage = getPercentage(totalCurrent, totalTarget);

  return {
    onlyInCurrent,
    onlyInTarget,
    biggerInCurrent,
    smallerInCurrent,
    equal,
    totalDiff,
    totalPercentage,
    byEntry,
  };
}
