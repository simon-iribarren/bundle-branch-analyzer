# Bundle Branch Analyzer (Beta)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)


**Compare the bundle size of different branchs in seconds** ✨

CLI tool to compare the bundle size generated by webpack from different git branches, useful to optimize your bundle size and to prevent big bundle size increases between branches.


# Upcoming Features

* **Generate html** - Show the report in browser or get a HTML with the report. ✔️
* **CI Setup** - Integrate with Jenkins or Travis to make it part of your CI process.
* **Configuration** - Generate default config (webpack config, default target branch, use yarn or npm, assets folder)
* **react-create-app Support** - Currently is not possible to run without eject.
* **Error Handling** - Currently we are not handling properly all the error cases with git, or while running some other required commands.


# Optional Arguments

```
  -t, --targetBranch <branch> Define target branch to compare with your current branch.
  -m, --mode <mode>           Output format. Should be `server`, `static` or `console`.
                              In `server` mode the analyzer will start HTTP server to show bundle report.
                              In `static` mode single HTML file with bundle report will be generated.
                              In `console` mode it will output the bundle report in the console
  -wc, --webpackConfig <path> Define the path location of your webpack config script (default: webpack.config.js)
```


# Requirements
- [webpack-cli](https://github.com/webpack/webpack-cli)
- [git](https://git-scm.com/)


# Installation
```shell
npm install -g bundle-branch-analyzer
```

# License

MIT © Simón Iribarren Godoy

Any suggestion or collaborations are very welcome! (simon.ig13@gmail.com)