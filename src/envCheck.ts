import { OptionsI } from './types';
import { getCurrentBranchName } from './git';
import { hasYarn, webpackConfigFound } from './utils';

export function initialEnviromentCheck(options: OptionsI) {
  options.currentBranch = getCurrentBranchName();
  options.packageManager = hasYarn() ? 'yarn' : 'npm';
  if (!webpackConfigFound()) {
    throw new TypeError(`'webpack.config.js' file not found`);
  }
}
