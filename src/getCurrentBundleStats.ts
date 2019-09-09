const exec = require('await-exec')
const execOpts = { log: true }

export default async function getCurrentBundleStats(filePrefix: string) {
    await exec('yarn install', execOpts)
    await exec(`webpack --profile --json > bba/${filePrefix}-stats.json`, execOpts)

}