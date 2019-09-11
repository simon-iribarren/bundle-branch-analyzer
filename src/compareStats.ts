import * as path from 'path';
import { BundleStatI, BundlesReportI } from './types';
const cwd = process.cwd()



function assetsReducer(result: any, value: any) {
    result[value.name] = parseFloat(value.size) / 1024;
    return result;
}

function formatAssets(current: number = 0, target: number = 0, name: string): BundleStatI {
    const diff = current - target;
    const percentage = (1 - (current / target)) * 100;

    return {
        name,
        targetSize: target,
        currentSize: current,
        difference: diff,
        pdiff: percentage
    }
}


export default function compareStats(currentStats: string, targetStats: string): BundlesReportI {
    let currentStatsPath = path.resolve(cwd, targetStats)
    let targetStatsPath = path.resolve(cwd, currentStats)

    const currentStateAssets = require(currentStatsPath).assets.reduce(assetsReducer, {})
    const targetStateAssets = require(targetStatsPath).assets.reduce(assetsReducer, {})
    const assetsNames = Object.keys({ ...currentStateAssets, ...targetStateAssets });

    let onlyInCurrent: Array<BundleStatI> = [];
    let onlyInTarget: Array<BundleStatI> = [];
    let biggerInCurrent: Array<BundleStatI> = [];
    let smallerInCurrent: Array<BundleStatI> = [];
    let equal: Array<BundleStatI> = [];

    let totalDiff = 0;
    let totalPercentage = 0;

    for (let key of assetsNames) {
        if (!key.includes('.map')) {
            const current = currentStateAssets[key];
            const target = targetStateAssets[key];
            const formatted: BundleStatI = formatAssets(current, target, key);

            if (!current) {
                onlyInTarget.push(formatted)
            } else if (!target) {
                onlyInCurrent.push(formatted)
            } else if (formatted.difference > 0) {
                biggerInCurrent.push(formatted)
            } else if (formatted.difference < 0) {
                smallerInCurrent.push(formatted)
            } else {
                equal.push(formatted)
            }
            totalDiff += formatted.difference;
            totalPercentage += formatted.pdiff;
        }

    }

    return { onlyInCurrent, onlyInTarget, biggerInCurrent, smallerInCurrent, equal, totalDiff, totalPercentage }

}


