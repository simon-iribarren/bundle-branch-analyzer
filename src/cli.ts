import * as arg from 'arg';
import * as inquirer from 'inquirer';
import { main } from './main';
import { OptionsI } from './types';

async function promptForMissingOptions(options: OptionsI): Promise<OptionsI> {
  if (options.skipPrompts) {
    return {
      ...options,
    };
  }

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
  };
}

function parseArgumentsIntoOptions(rawArgs: string[]) {
  const args = arg(
    {
      '--targetBranch': String,
      '--yes': Boolean,
      '-t': '--targetBranch',
      '-y': '--yes',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: !!args['--yes'] || false,
    targetBranch: args['--targetBranch'] || '',
  };
}

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await main(options);
}
