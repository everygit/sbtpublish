# sbtpublish

[![image](https://img.shields.io/npm/v/sbtpublish.svg)](https://www.npmjs.com/package/sbtpublish)
[![](https://img.shields.io/npm/l/sbtpublish.svg)](https://www.npmjs.com/package/sbtpublish)
[![](https://img.shields.io/github/issues/everygit/sbtpublish)](https://github.com/everygit/sbtpublish/issues)

Publish the project file to the specified folder, and then it can be easily deployed to the server through tools such as FTP

# install
```
npm install sbtpublish
```
# package.json

```json
{
  "name": "publish",
  "scripts": {
    "sbtpublishconfig": "sbtpublish -c a.config.js",
    "sbtpublish": "sbtpublish"
  },
  "dependencies": {
    "sbtpublish": "sbtpublish"
  }
}
```

# a.config.js
```js
module.exports = {
    output: 'cccc',
    ignore: [
        'build'
    ],
    lastModify: '1d'
}
```
- output  Output folder
- ignore Ignore published files or folders
- lastModify /^([0-9.]+)([smhdMy]?)$/ 
# publish
```
npm run sbtpublishconfig
```
# default
```js
const path = require('path');

module.exports = function (appRoot) {
    return {
        output: path.resolve(appRoot, 'sbtpublish'),
        ignore: [

        ]
    }
}
```
appRoot is the folder where sbtpublish runs 