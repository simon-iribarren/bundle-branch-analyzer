import * as fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';
import { getCurrentBundleStats } from './getCurrentBundleStats';
import { compareStats } from './compareStats';
import { doCheckout, getCurrentBranchName } from './git';
import { OptionsI } from './types';
import ora from 'ora';
import { resultPrompt } from './resultPrompt';

const log = console.log;
const cwd = process.cwd();
const mkDir = promisify(fs.mkdir);

export async function main(options: OptionsI) {
  try {
    await mkDir(`${cwd}/bba`);
  } catch (e) {}
  const currentBranch = getCurrentBranchName();

  const spinner = ora(`Getting ${currentBranch} stats...`).start();

  await getCurrentBundleStats('current');

  await doCheckout(options);

  try {
    spinner.text = `Getting ${options.targetBranch} stats...`;
    await getCurrentBundleStats('target');
    await doCheckout({ ...options, targetBranch: '-' });
  } catch (err) {
    throw new Error(err);
  }

  spinner.text = `Comparing stats...`;
  const bundlesStatReport = compareStats(
    `bba/${options.targetBranch}-stats.json`,
    `bba/${currentBranch}-stats.json`
  );
  spinner.stop();
  resultPrompt(bundlesStatReport);  
}
