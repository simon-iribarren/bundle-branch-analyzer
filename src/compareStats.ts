import * as path from 'path';
import { BundleStatI, BundlesReportI, AssetI, AssetCollectionI } from './types';
const cwd = process.cwd();

function assetsReducer(
  result: AssetCollectionI,
  value: AssetI
): AssetCollectionI {
  result[value.name] = value.size / 1024;
  return result;
}

function formatAssets(current = 0, target = 0, name: string): BundleStatI {
  const diff = current - target;
  const percentage = (1 - target / current) * 100;

  return {
    name,
    targetSize: target,
    currentSize: current,
    difference: diff,
    pdiff: percentage,
  };
}

export function compareStats(
  currentStats: string,
  targetStats: string
): BundlesReportI {
  const currentStatsPath = path.resolve(cwd, targetStats);
  const targetStatsPath = path.resolve(cwd, currentStats);

  const currentStateAssets = require(currentStatsPath).assets.reduce(
    assetsReducer,
    {}
  );
  const targetStateAssets = require(targetStatsPath).assets.reduce(
    assetsReducer,
    {}
  );
  const assetsNames = Object.keys({
    ...currentStateAssets,
    ...targetStateAssets,
  });

  const onlyInCurrent: BundleStatI[] = [];
  const onlyInTarget: BundleStatI[] = [];
  const biggerInCurrent: BundleStatI[] = [];
  const smallerInCurrent: BundleStatI[] = [];
  const equal: BundleStatI[] = [];

  let totalDiff = 0;
  let totalPercentage = 0;

  for (const key of assetsNames) {
    if (!key.includes('.map')) {
      const current = currentStateAssets[key];
      const target = targetStateAssets[key];
      const formatted: BundleStatI = formatAssets(current, target, key);

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
      totalDiff += formatted.difference;
      totalPercentage += formatted.pdiff;
    }
  }

  return {
    onlyInCurrent,
    onlyInTarget,
    biggerInCurrent,
    smallerInCurrent,
    equal,
    totalDiff,
    totalPercentage,
  };
}
