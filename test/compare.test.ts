import { compareStats } from '../src/compareStats';
import { OptionsI } from '../src/types';

const options: OptionsI = {
  targetBranch: 'master',
  currentBranch: 'currentBranch',
  mode: null,
  webpackConfigScript: '',
  outputDir: 'test/bundles/',
};

function getOptionsForBundleCase(bundleCase: string): OptionsI {
  return { ...options, outputDir: options.outputDir + bundleCase };
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

  describe('currentBranch bigger than master', () => {
    const opts = getOptionsForBundleCase('biggerInCurrent');
    const results = compareStats(opts);
    it('should be bigger by 10kbs', () => {
      expect(results.totalDiff).toBe(10);
    });
    it('should have a 10% diference', () => {
      expect(results.totalPercentage).toBe(10);
    });
    it('should containe one asset bigger', () => {
      expect(results.biggerInCurrent.length).toBe(1);
    });
  });
});
