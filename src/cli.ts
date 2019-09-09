import * as arg from 'arg';
import * as inquirer from 'inquirer';
import getBundles from './main';


async function promptForMissingOptions(options: any) {
    const defaultTemplate = 'JavaScript';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
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
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      targetBranch: options.targetBranch || answers.targetBranch,
    };
   }
   


function parseArgumentsIntoOptions(rawArgs: any) {
 const args = arg(
   {
     '--targetBranch': String,
     '-t': '--targetBranch',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
   skipPrompts: args['--targetBranch'] || false,
 };
}


export default async function cli(args: any) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await getBundles(options)
    console.log('finish');
}