/*
    Runs a command
 */

let log = require('npmlog')

require('dotenv').config()

// CLI Options
const options = {
  dryRun: process.argv.includes('--dry-run') || !process.env.CI, // do not make any changes
  debug: process.argv.includes('--debug') || !!process.env.DEBUG // more detailed logging
}

if (options.debug) {
  log.level = 'silly'
}

log.info('run', options)

module.exports = async function run (command) {
  await command(options)
}
