import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as simplegit from 'simple-git/promise';
import { OptionsI } from './types';

const log = console.log;

const cwd = process.cwd();
const git = simplegit(cwd);

const checkoutOptions = [
  {
    name: `Stash my changes (they can be restored with the command 'git stash pop')`,
    value: 'stash',
  },
  {
    name: `I already fix it, try again`,
    value: 'retry',
  },
  {
    name: `exit`,
    value: 'exit',
  },
];

const errorOnCheckoutQuestion = [
  {
    type: 'list',
    name: 'targetBranch',
    message: 'There was a problem checking out the target branch...',
    choices: checkoutOptions,
  },
];

export async function doCheckout(targetBranch: string) {
  try {
    //log(chalk.blue(`checking out target branch ${options.targetBranch}`));
    await git.checkout(targetBranch);
  } catch (err) {
    const answer = await inquirer.prompt(errorOnCheckoutQuestion);

    switch (answer.targetBranch) {
      case 'stash': {
        log(chalk.blue(`Stashing changes...`));
        await git.stash();
        await doCheckout(targetBranch);
        return;
      }
      case 'retry': {
        await doCheckout(targetBranch);
        return;
      }
      default: {
        process.exit(1);
      }
    }
  }
}

export function getCurrentBranchName(p = process.cwd()): string {
  const gitHeadPath = `${p}/.git/HEAD`;

  return fs.existsSync(p)
    ? fs.existsSync(gitHeadPath)
      ? fs
          .readFileSync(gitHeadPath, 'utf-8')
          .trim()
          .split('/')[2]
      : getCurrentBranchName(path.resolve(p, '..'))
    : '';
}
