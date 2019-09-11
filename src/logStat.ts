import chalk from 'chalk';
import { BundleStatI, BundlesReportI } from "./types";
const log = console.log;


function printItem(bundleStat: BundleStatI) {
    log(chalk`Bundle name: {green ${bundleStat.name}}
Current branch: {red ${bundleStat.currentSize.toFixed(2)} KB}
Target branch: {green ${bundleStat.targetSize.toFixed(2)} KB}
Difference: {rgb(255,131,0) ${bundleStat.difference.toFixed(2)} KB}
Percentage: {green ${bundleStat.pdiff.toFixed(2)}%}
`);
}


function printReport(bundles: Array<BundleStatI>, title: string) {
    if (bundles.length > 0) {
        log(chalk.black(''))
        log(chalk.blue(title))
        log(chalk.black(''))

        bundles.forEach(printItem);

        log(chalk.black(''))
        log(chalk.black('###############################################'))
        log(chalk.black(''))
    }
}

export default function logStats(bundleReport: BundlesReportI): any {
    const { onlyInCurrent, onlyInTarget, biggerInCurrent, smallerInCurrent, totalDiff, totalPercentage } = bundleReport;
    
    printReport(onlyInCurrent, 'Only in current branch')
    printReport(onlyInTarget, 'Only in target branch')
    printReport(biggerInCurrent, 'Bigger in current branch')
    printReport(smallerInCurrent, 'Smaller in current branch')

    log(chalk.blue(`Total Difference: ${totalDiff.toFixed(2)} KB`))
    log(chalk.blue(`Total Percentage: ${totalPercentage.toFixed(2)}%`))
}