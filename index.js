'use strict';

const chalk = require('chalk');
const stringLength = require('string-length');
const table = require('text-table');
const tableOptions = { stringLength: stringLength };

class Reporter {

  constructor (done) {
    this.done = done;
  }

  log (file) {
    if (!('david' in file)) {
      throw new Error(`[${ pkg.name }] Dependencies not found.`);
    }

    console.log('\n', chalk.underline(file.path), '\n');

    let types = Object.keys(file.david)
                      .filter(type => Object.keys(file.david[type]).length > 0);

    if (!types.length) {
      console.log(chalk.green('\n  All dependencies up to date.\n'));
    }
    else {
      types.forEach(type => {

        let deps = file.david[type],
          rows = [
            [ `  ${type}`, 'package.json', 'stable', 'latest' ]
              .map(cell => chalk.grey(cell))
          ];

        for (let name in deps) {
          let dependency = deps[name],
            requiredVersion = chalk.red(dependency.required || '*'),
            stableVersion = chalk.green(dependency.stable || '*'),
            latestVersion = chalk.yellow(dependency.latest || '*'),
            pkgName = chalk.blue(name);

          rows.push([ `  ${pkgName}`, requiredVersion, stableVersion, latestVersion ]);
        }

        console.log(table(rows, tableOptions));
      });
    }

    console.log();

    this.done && this.done();
  }
}

module.exports = { Reporter: Reporter };
