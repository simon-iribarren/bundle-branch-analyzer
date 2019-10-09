import * as express from "express";
import { join } from 'path';
import { BundlesReportI } from '../types';



export function runResultExpress(bundleReport: BundlesReportI) {
    const app = express();
    app.set('views', join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.get('/', (req: express.Request, res: express.Response) => res.render('result', { bundleReport }));
    const server = app.listen(3333, () => console.log('open http://localhost:3333/ in your browser'));
}