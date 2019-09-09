import * as fs from 'fs';
import * as simplegit from 'simple-git/promise';
import { promisify } from 'util';
import getCurrentBundleStats from './getCurrentBundleStats';
import compareStats from './compareStats';
const cwd = process.cwd()
const git = simplegit(cwd)

const mkDir = promisify(fs.mkdir);


export default async function main(options: any) {

    try {
        await mkDir(`${cwd}/bba`)
    } catch (e){

    }

    await getCurrentBundleStats('current')

    try{
        await git.stash();
        await git.checkout(options.targetBranch);
        await getCurrentBundleStats('base')
        await git.checkout('-');
        await compareStats('bba/base-stats.json', 'bba/current-stats.json');

    } catch(err){
        throw new Error(err);
    }

}

