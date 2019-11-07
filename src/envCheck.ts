import { OptionsI } from './types';
import { getCurrentBranchName } from './git';
import { hasYarn, webpackConfigFound } from './utils';

export function initialEnviromentCheck(options: OptionsI) {
  options.currentBranch = getCurrentBranchName();
  options.packageManager = hasYarn() ? 'yarn' : 'npm';

  if (
    options.webpackConfigScript.length > 0 &&
    !webpackConfigFound(options.webpackConfigScript)
  ) {
    throw new TypeError(
      `${options.webpackConfigScript} file not found, please provide a valid path for the configuration script`
    );
  } else if (
    options.webpackConfigScript.length === 0 &&
    !webpackConfigFound()
  ) {
    throw new TypeError(
      `'webpack.config.js' file not found, please run the bundle-branch-analyzer in the same location of the 'webpack.config.js' file or specify the location of the webpack script configuration with the arguments '--webpackConfig scripts/yourWebpackScript.js'`
    );
  }
}
