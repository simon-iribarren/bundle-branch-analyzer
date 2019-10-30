import * as express from 'express';
import * as open from 'open';
import * as fs from 'fs';
import { join, extname } from 'path';
import { BundlesReportI, OptionsI } from '../types';

const ejs = require('ejs');

export function runResultExpress(
  bundleReport: BundlesReportI,
  options: OptionsI
) {
  const app = express();
  app.set('views', join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/', (req: express.Request, res: express.Response) =>
    res.render('result', { bundleReport, options })
  );
  const server = app.listen(3333, () => {
    console.log('open http://localhost:3333/ in your browser');
    open('http://localhost:3333/');
  });
}

export function generateStaticHtml(
  bundleReport: BundlesReportI,
  options: OptionsI
) {
  const path = join(__dirname, 'views', 'result.ejs');
  const targetPath = join(process.cwd(), '/bba', 'bba');
  const ejsString = ejs.fileLoader(path, 'utf8'),
    template = ejs.compile(ejsString, {
      bundleReport,
      options,
      filename: path,
    }),
    html = template({ bundleReport, options }, { filename: path });

  fs.writeFile(targetPath + '.html', html, err => {
    if (err) {
      console.log(err);
    }
  });
}
