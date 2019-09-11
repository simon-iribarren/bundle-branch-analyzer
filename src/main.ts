import * as fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';
import getCurrentBundleStats from './getCurrentBundleStats';
import compareStats from './compareStats';
import { doCheckout, getCurrentBranchName } from './git';
import logStats from './logStat';

const log = console.log;
const cwd = process.cwd()
const mkDir = promisify(fs.mkdir);


export default async function main(options: any) {

    try {
        await mkDir(`${cwd}/bba`)
    } catch (e) {

    }
    const currentBranch = getCurrentBranchName();

    log(chalk.blue(`Getting ${currentBranch} stats...`))
    await getCurrentBundleStats('current');

    await doCheckout(options);

    try {
        log(chalk.blue(`Getting ${options.targetBranch} stats...`))
        await getCurrentBundleStats('target');
        await doCheckout({targetBranch: '-'});

    } catch (err) {
        throw new Error(err);
    }

    log(chalk.blue(`Comparing stats...`))
    const bundlesStatReport = compareStats(`bba/${options.targetBranch}-stats.json`, `bba/${currentBranch}-stats.json`);
    logStats(bundlesStatReport);

}
