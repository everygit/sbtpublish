const program = require('commander');
const path = require('path');
require('colors');

program
    .option('-c, --config <config>', 'Set publishing profile path');

program.parse(process.argv);

const { config } = program.opts();

let cnf,
    appRoot = process.cwd();

print('Start publishing files...'.green);

if(config) {
    print('Release configuration file path: '.yellow + config);
    cnf = normalizeConfig(config);
} else {
    print('No publishing profile is set, the file will be published with default settings'.red);
    cnf = {
        output: path.resolve(appRoot, 'sbtpublish')
    }
    print('Output path: '.yellow + cnf.output);
}

print('Scan all paths...'.green);


/**
 * Normalize the configuration file for invocation of the program
 * @param {object} inputConfig Requires a normalized configuration file
 */
function normalizeConfig(inputConfig) {
    return {};
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