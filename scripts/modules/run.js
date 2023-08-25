/*
    Runs a command
 */

import { config } from 'dotenv'
import { error, level, verbose } from 'npmlog'
config()

// CLI Options
const options = {
  dryRun: !process.argv.includes('--dry-run=false'), // do not make any changes
  debug: process.argv.includes('--debug') // more detailed logging
}

if (options.debug) {
  level = 'silly'
}

verbose('run', options)

if (parseInt(process.version.replace('v', ''), 10) < 10) {
  error('error', 'Node.js Version 10 or higher is required. Please update NodeJS to the current LTS (long-term support) version at https://nodejs.org before running this program.')
  process.exit(1)
}

export default async function run (command) {
  await command(options)
}
