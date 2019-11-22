import { compareStats } from '../src/compareStats';
import { OptionsI } from '../src/types';

const options: OptionsI = {
  targetBranch: 'master',
  currentBranch: 'currentBranch',
  mode: null,
  webpackConfigScript: '',
  bundleDir: 'test/bundles/',
};

function getOptionsForBundleCase(bundleCase: string): OptionsI {
  return { ...options, bundleDir: options.bundleDir + bundleCase };
}

describe('Compare Bundles', () => {
  describe('Bundle report should contain', () => {
    const opts = getOptionsForBundleCase('bundleRename');
    const results = compareStats(opts);
    it('byEntry section', () => {
      expect(Array.isArray(results.byEntry)).toBe(true);
    });
    it('biggerInCurrent section', () => {
      expect(Array.isArray(results.biggerInCurrent)).toBe(true);
    });
    it('smallerInCurrent section', () => {
      expect(Array.isArray(results.smallerInCurrent)).toBe(true);
    });

    it('totalDiff number', () => {
      expect(results.totalDiff).toEqual(expect.any(Number));
    });

    it('totalPercentage number', () => {
      expect(results.totalPercentage).toEqual(expect.any(Number));
    });
  });
});
