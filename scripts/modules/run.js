/*
    Runs a command
 */

let log = require('npmlog')

// CLI Options
const options = {
  dryRun: process.argv.includes('--dry-run'), // do not make any changes
  debug: process.argv.includes('--debug') // more detailed logging
}

if (options.debug) {
  log.level = 'silly'
}

module.exports = async function run (command) {
  await command(options)
}
