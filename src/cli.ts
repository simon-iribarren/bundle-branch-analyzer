import * as arg from 'arg';
import * as inquirer from 'inquirer';
import { main } from './main';
import { OptionsI } from './types';

async function promptForMissingOptions(options: OptionsI): Promise<OptionsI> {
  const questions = [];

  if (!options.targetBranch) {
    questions.push({
      type: 'input',
      name: 'targetBranch',
      message: 'Please specify the target branch to be compared',
      default: 'master',
    });
  }

  const answers: OptionsI = await inquirer.prompt(questions);
  return {
    ...options,
    targetBranch: options.targetBranch || answers.targetBranch,
    packageManager: 'npm',
  };
}

export function parseArgumentsIntoOptions(rawArgs: string[]): OptionsI {
  const args = arg(
    {
      '--targetBranch': String,
      '--webpackConfig': String,
      '--mode': String,
      '-t': '--targetBranch',
      '-m': '--mode',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    targetBranch: args['--targetBranch'] || '',
    webpackConfigScript: args['--webpackConfig'] || '',
    mode: args['--mode'] || null,
  };
}

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await main(options);
}
