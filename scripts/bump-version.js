/* eslint-disable @typescript-eslint/no-var-requires */
const { writeFileSync } = require('fs')
const { join } = require('path')

console.log('Updating version code...')

const pkg = require('../package.json')
pkg.versionCode = pkg.versionCode + 1

writeFileSync(join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2))
console.log(`Version code updated to ${pkg.versionCode}`)
