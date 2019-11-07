import * as fs from 'fs';
import * as path from 'path';

const MAX_COUNT = 5;

export function hasYarn(p = process.cwd(), count = 0): boolean {
  const yarnPath = `${p}/yarn.lock`;
  if (count > MAX_COUNT) return false;

  return fs.existsSync(p)
    ? fs.existsSync(yarnPath)
      ? true
      : hasYarn(path.resolve(p, '..'), count + 1)
    : false;
}

export function webpackConfigFound(
  filePath = 'webpack.config.js',
  p = process.cwd()
): boolean {
  const webpackPath = path.join(p, filePath);
  return fs.existsSync(webpackPath);
}
