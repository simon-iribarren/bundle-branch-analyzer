import * as fs from 'fs';
import { promisify } from 'util';
import getCurrentBundleStats from './getCurrentBundleStats';
import compareStats from './compareStats';
import chalk from 'chalk';
import { doCheckout } from './git';

const log = console.log;
const cwd = process.cwd()
const mkDir = promisify(fs.mkdir);


export default async function main(options: any) {

    try {
        await mkDir(`${cwd}/bba`)
    } catch (e) {

    }

    log(chalk.blue(`Getting current branch stats...`))
    await getCurrentBundleStats('current')

    log(chalk.blue(`checking out target branch ${options.targetBranch}`))
    await doCheckout(options);

    try {
        log(chalk.blue(`getting ${options.targetBranch} stats...`))
        await getCurrentBundleStats('base');
        await doCheckout({targetBranch: '-'});

    } catch (err) {
        throw new Error(err);
    }

    log(chalk.blue(`Comparing stats...`))
    await compareStats('bba/base-stats.json', 'bba/current-stats.json');


}
