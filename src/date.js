/**
 * convert string to date
 */
module.exports = function convertDate(str) {
    str = str.trim();
    var regStr = /^(\d+)[-/](\d+)[-/](\d+) (\d+):(\d+):(\d+)$/;
    var regExec = regStr.exec(str);
    if(regExec) {
        return new Date(+regExec[1], +regExec[2] - 1, +regExec[3], +regExec[4], +regExec[5], +regExec[6]);
    }
    regStr = /^(\d+)[-/](\d+)[-/](\d+) (\d+):(\d+)$/;
    regExec = regStr.exec(str);
    if(regExec) {
        return new Date(+regExec[1], +regExec[2] - 1, +regExec[3], +regExec[4], +regExec[5], 0);
    }
    regStr = /^(\d+)[-/](\d+)[-/](\d+) (\d+)$/;
    regExec = regStr.exec(str);
    if(regExec) {
        return new Date(+regExec[1], +regExec[2] - 1, +regExec[3], +regExec[4], 0, 0);
    }
    regStr = /^(\d+)[-/](\d+)[-/](\d+)$/;
    regExec = regStr.exec(str);
    if(regExec) {
        return new Date(+regExec[1], +regExec[2] - 1, +regExec[3], 0, 0, 0);
    }
    return null;
}