const program = require('commander');
const path = require('path');
const fs = require('fs');
const { mkdirsSync, rmdirsSync, cpdirsSync } = require('@xiaoerr/io');
require('colors');

program
    .option('-c, --config <config>', 'Set publishing profile path');

program.parse(process.argv);

const { config } = program.opts();

let cnf,
    appRoot = process.cwd();

print('Start publishing files...'.green);

publish();

/**
 * Publishing project files
 */
function publish() {
    if (config) {
        print('Release configuration file path: '.yellow + config);
        cnf = normalizeConfig(config);
    } else {
        // load default config
        print('No publishing profile is set, the file will be published with default settings'.red);
        cnf = require('../sbtpublish.config')(appRoot);
        // print some config values
        print('Output path: '.yellow + cnf.output);
    }

    // initialize dirs
    if (fs.existsSync(cnf.output))
        rmdirsSync(cnf.output);
    mkdirsSync(cnf.output);

    let isAllowCopy = (filepath) => {
        let p = getRelativePath(appRoot, filepath);
        let publishDir = '/' + getRelativePath(appRoot, cnf.output);
        var ret = cnf.ignore.concat([
            'node_modules',
            publishDir
        ]).some(ig => {
            ig = ig.replace(/\/$/, "");
            if (/^\//.test(ig)) {
                var reg = new RegExp('^' + ig.substring(1).replace(/\./g, '\\.') + '($|\/)', 'i');
                return reg.test(p);
            } else {
                var reg = new RegExp('(^|\/)' + ig.replace(/\./g, '\\.') + '($|\/)', "i");
                return reg.test(p);
            }
        });
        return !ret;
    }

    cpdirsSync(appRoot, cnf.output, isAllowCopy);

    print('Scan all paths...'.green);
}


function getRelativePath(from, to) {
    let fromAb = path.resolve(from);
    let toAb = path.resolve(to);
    let rel = path.relative(fromAb, toAb);
    return rel.replace(/\\/g, '/');
}



/**
 * Normalize the configuration file for invocation of the program
 * @param {object} inputConfig Requires a normalized configuration file
 */
function normalizeConfig(inputConfig) {
    var n = require(appRoot + '/' + inputConfig);
    if(!n.output) {
        n.output = path.resolve(appRoot, 'sbtpublish');
    }
    if(!n.ignore) {
        n.ignore = [];
    }
    return n;
}

/**
 * Added time display for console.log
 * @param {string} str String to print
 */
function print(str) {
    var now = new Date();
    var time = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getMilliseconds()}] `.magenta;
    console.log(`${time}${str}`);
}