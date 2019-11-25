import * as fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';
import { getCurrentBundleStats } from './getCurrentBundleStats';
import { compareStats } from './compareStats';
import { doCheckout, getCurrentBranchName } from './git';
import { OptionsI } from './types';
import ora from 'ora';
import { resultPrompt } from './resultPrompt';
import { initialEnviromentCheck } from './envCheck';

const log = console.log;
const cwd = process.cwd();
const mkDir = promisify(fs.mkdir);

export async function main(options: OptionsI) {
  try {
    await mkDir(`${cwd}/${options.outputDir}`);
  } catch (e) {}

  initialEnviromentCheck(options);

  const spinner = ora(`Getting ${options.currentBranch} stats...`).start();

  await getCurrentBundleStats(options);

  await doCheckout(options.targetBranch);

  try {
    spinner.text = `Getting ${options.targetBranch} stats...`;
    await getCurrentBundleStats(options);
    await doCheckout('-');
  } catch (err) {
    throw new Error(err);
  }

  spinner.text = `Comparing stats...`;
  const bundlesStatReport = compareStats(options);
  spinner.stop();
  resultPrompt(bundlesStatReport, options);
}
