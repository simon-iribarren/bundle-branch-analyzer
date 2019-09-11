
export interface BundleStatI {
    name: string;
    targetSize: number;
    currentSize: number;
    difference: number;
    pdiff: number;
}

export interface BundlesReportI {
    onlyInCurrent: Array<BundleStatI>; 
    onlyInTarget: Array<BundleStatI>; 
    biggerInCurrent: Array<BundleStatI>; 
    smallerInCurrent: Array<BundleStatI>; 
    equal: Array<BundleStatI>; 
    totalDiff: number;
    totalPercentage: number;
    
}