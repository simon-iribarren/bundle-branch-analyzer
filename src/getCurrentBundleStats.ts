import chalk from "chalk";

const exec = require('await-exec')
const execOpts = { log: false }

export default async function getCurrentBundleStats(filePrefix: string) {
    try {
        await exec(`webpack --profile --json > bba/${filePrefix}-stats.json`, execOpts)
    } catch(err){
        console.log(chalk.red(`The following error ocurre while running your webpack configuration:`))
    }

}