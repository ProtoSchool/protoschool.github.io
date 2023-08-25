/*
    Fetches all the data necessary to render the website:

    - Google APIs for events data
 */

import { error as _error, warn } from 'npmlog'

const logGroup = 'build:data'

process.on('uncaughtException', (error) => {
  // We can't fail if the branch is code, because it could be the cron job
  if (error.code === 'NO_CONFIG' && process.env.BRANCH !== 'code') {
    _error(logGroup, 'ERROR NO_CONFIG:', error.message)
    warn(logGroup, 'Not enough config set. Skipping build-data script...')
    process.exit(0)
  }

  _error(logGroup, error.code ? `ERROR ${error.code}:` : '', error.message)
  process.exit(1)
})

import run from '../../modules/run'
import eventsData from './events-data'
import mailchimp from './mailchimp'

async function command (options) {
  // Fetch and save all events data
  const events = await eventsData(options)

  // Update mailchimp's audience members based on the event organizers list
  await mailchimp({ data: { events } }, options)
}

run(command)
