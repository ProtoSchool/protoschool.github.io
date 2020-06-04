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
  log.error('error', 'NodeJS Version 10 or higher is required. Please update NodeJS to the current LTS (long-term support) version at https://nodejs.org before running this program.')
  process.exit(1)
}

module.exports = async function run (command) {
  await command(options)
}
