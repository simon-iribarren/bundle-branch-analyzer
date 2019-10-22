import chalk from 'chalk';
import { getCurrentBranchName } from './git';

const exec = require('await-exec');
const execOpts = { log: false };

export async function getCurrentBundleStats(filePrefix: string) {
  try {
    const currentBranch = getCurrentBranchName() || filePrefix;
    await exec('npm install', execOpts);
    await exec(
      `webpack --profile --json > bba/${currentBranch}-stats.json`,
      execOpts
    );
  } catch (err) {
    console.log('');
    console.log(
      chalk.red(
        `The following error ocurre while running your webpack configuration:`
      )
    );
    console.error(err);
  }
}
