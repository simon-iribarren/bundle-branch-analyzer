import { BundlesReportI, OptionsI } from './types';
import inquirer = require('inquirer');
import { logStats } from './logStat';
import { runResultExpress, generateStaticHtml } from './generateTemplate';
import { ResultTypes } from './enums';

const resultOptions = [
  {
    name: `Show the report in the console`,
    value: 'console',
  },
  {
    name: `Generate static HTML file with the bundle report.`,
    value: 'static',
  },
  {
    name: `Start HTTP server to show the bundle report in the browser`,
    value: 'server',
  },
];

const resultPromptOpts = [
  {
    type: 'list',
    name: 'type',
    message: 'There was a problem checking out the target branch...',
    choices: resultOptions,
  },
];

export async function resultPrompt(
  bundleReport: BundlesReportI,
  options: OptionsI
): Promise<void> {
  let answer;

  if (options.mode) {
    answer = { type: options.mode };
  } else {
    answer = await inquirer.prompt(resultPromptOpts);
  }

  switch (answer.type) {
    case ResultTypes.CONSOLE: {
      logStats(bundleReport);
      return;
    }
    case ResultTypes.STATIC: {
      //GenerateHTML function
      generateStaticHtml(bundleReport, options);
      return;
    }
    case ResultTypes.SERVER: {
      //Generate HTML and serve.
      runResultExpress(bundleReport, options);
      return;
    }
    default:
      return;
  }
}
