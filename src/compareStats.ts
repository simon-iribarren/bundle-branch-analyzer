import * as path from 'path';
const cwd = process.cwd()

function assetsReducer(result: any, value: any){
    result[value.name] = value.size;
    return result;
}

export default function compareStats(currentStats: string, targetStats: string){
    return new Promise((resolve, rejects) => {
        let output = 'bba/'
        let currentStatsPath = path.resolve(cwd, targetStats)
        let targetStatsPath = path.resolve(cwd, currentStats)
        //let outputPath = path.resolve(cwd, output)

        const currentStateAssets = require(currentStatsPath).assets.reduce(assetsReducer)
        const targetStateAssets = require(targetStatsPath).assets.reduce(assetsReducer)
        const assetsNames = Object.keys({...currentStateAssets, ...targetStateAssets});
        console.log(assetsNames);
               
    })
}