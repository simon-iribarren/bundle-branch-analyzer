import * as path from 'path';
const cwd = process.cwd()
import chalk from 'chalk';
const log = console.log;

function assetsReducer(result: any, value: any) {
    result[value.name] = parseFloat(value.size) / 1024;
    return result;
}

function formatAssets(current: number = 0, target: number = 0, name: string) {
    //console.log({current, target})
    const diff = current - target;
    const percentage = (1 - (current / target)) * 100;

    return {
        name,
        targetSize: target,
        currentSize: current,
        diference: diff,
        pdiff: percentage}
}

function printReport(result: any) {
    log(chalk`Bundle name: {green ${result.name}}
Current branch: {red ${result.currentSize.toFixed(2)} KB}
Target branch: {green ${result.targetSize.toFixed(2)} KB}
Difference: {rgb(255,131,0) ${result.diference.toFixed(2)} KB}
Percentage: {green ${result.pdiff.toFixed(2)}%}
`);
}

export default function compareStats(currentStats: string, targetStats: string) {
    return new Promise((resolve, rejects) => {
        let output = 'bba/'
        let currentStatsPath = path.resolve(cwd, targetStats)
        let targetStatsPath = path.resolve(cwd, currentStats)
        //let outputPath = path.resolve(cwd, output)

        const currentStateAssets = require(currentStatsPath).assets.reduce(assetsReducer, {})
        const targetStateAssets = require(targetStatsPath).assets.reduce(assetsReducer, {})
        const assetsNames = Object.keys({ ...currentStateAssets, ...targetStateAssets });
        //console.log(currentStateAssets);
        let onlyInCurrent = [];
        let onlyInTarget = [];
        let biggerInCurrent = [];
        let smallerInCurrent = [];
        let equal = [];
        let totalDiff = 0;
        let totalPercentage = 0;

        for (let key of assetsNames) {
            const current = currentStateAssets[key];
            const target = targetStateAssets[key];
            const formatted = formatAssets(current, target, key);

            if (!current) {
                onlyInTarget.push(formatted)
            } else if (!target) {
                onlyInCurrent.push(formatted)
            } else if (formatted.diference > 0) {
                biggerInCurrent.push(formatted)
            } else if (formatted.diference < 0) {
                smallerInCurrent.push(formatted)
            } else {
                equal.push(formatted)
            }
            totalDiff += formatted.diference;
            totalPercentage += formatted.pdiff;
        }
        
        log(chalk.black(''))
        log(chalk.blue('only in current'))
        onlyInCurrent.forEach(printReport);

        log(chalk.black('###############################################'))
        log(chalk.black(''))
        log(chalk.blue('only in target'))
        log(chalk.black(''))

        onlyInTarget.forEach(printReport);

        log(chalk.black('###############################################'))

        log(chalk.black(''))
        log(chalk.blue('bigger in current branch'))
        log(chalk.black(''))
        biggerInCurrent.forEach(printReport);

        log(chalk.black('###############################################'))

        log(chalk.black(''))
        log(chalk.blue('smaller in current branch'))
        log(chalk.black(''))

        smallerInCurrent.forEach(printReport);

        log(chalk.black(''))
        log(chalk.black('###############################################'))
        log(chalk.black(''))

        log(chalk.blue(`Total Difference: ${totalDiff.toFixed(2)} KB`))
        log(chalk.blue(`Total Percentage: ${totalPercentage.toFixed(2)}%`))


    })

}