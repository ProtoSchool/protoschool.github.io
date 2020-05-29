/*
    Runs a command
 */

let log = require('npmlog')

require('dotenv').config()

// CLI Options
const options = {
  dryRun: !process.argv.includes('--dry-run=false'), // do not make any changes
  debug: process.argv.includes('--debug') // more detailed logging
}

if (options.debug) {
  log.level = 'silly'
}

log.verbose('run', options)

if (parseInt(process.version.replace('v', ''), 10) < 10) {
  log.error('error', 'at least nodejs version 10 is required. please update nodejs to the current LTS at https://nodejs.org before running this program.')
  process.exit(1)
}

module.exports = async function run (command) {
  await command(options)
}
