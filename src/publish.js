const program = require('commander');
const path = require('path');
const fs = require('fs');
const { mkdirsSync, rmdirsSync, cpdirsSync } = require('@xiaoerr/io');
const convertDate = require('./date');
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
        let stat = fs.statSync(filepath);
        let isInTime = isModifyWithinCertainTime(stat);
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
        return !ret && isInTime;
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
 * Modify within a certain time
 * @param {Stats|String} stat stats or path
 */
function isModifyWithinCertainTime(stat) {

    if (!cnf.lastModify) return true;
    const reg = /^([0-9.]+)([smhdMy]?)$/.exec(cnf.lastModify);
    if (reg) {
        const d = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
            M: 30 * 24 * 60 * 60 * 1000,
            y: 365 * 24 * 60 * 60 * 1000
        };

        var t = parseFloat(reg[1]) * d[reg[2] || 's'];

        if (typeof stat === "string") {
            stat = fs.statSync(stat);
        }

        return Date.now() - stat.mtimeMs < t
    } else {
        if (typeof stat === "string") {
            stat = fs.statSync(stat);
        }

        var lastDatetime = convertDate(cnf.lastModify);
        if(lastDatetime) {
            console.log(stat.mtimeMs, lastDatetime.getTime());
            return stat.mtimeMs >= lastDatetime.getTime();
        } else {
            return true;
        }
    }
}



/**
 * Normalize the configuration file for invocation of the program
 * @param {object} inputConfig Requires a normalized configuration file
 */
function normalizeConfig(inputConfig) {
    var n = require(appRoot + '/' + inputConfig);
    if (!n.output) {
        n.output = path.resolve(appRoot, 'sbtpublish');
    }
    if (!n.ignore) {
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