/**
 * Default profile
 */
const path = require('path');

module.exports = function (appRoot) {
    return {
        output: path.resolve(appRoot, 'sbtpublish'),
        ignore: [

        ]
    }
}