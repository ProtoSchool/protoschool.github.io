/*
    Fetches all the data necessary to render the website:

    - Google APIs for events data
 */

let log = require('npmlog')

const logGroup = 'build:data'

process.on('uncaughtException', (error) => {
  // We can't fail if the branch is code, because it could be the cron job
  if (error.code === 'NO_CONFIG' && process.env.BRANCH !== 'code') {
    log.error(logGroup, 'ERROR NO_CONFIG:', error.message)
    log.warn(logGroup, 'Not enough config set. Skipping build-data script...')
    process.exit(0)
  }

  log.error(logGroup, error.code ? `ERROR ${error.code}:` : '', error.message)
  process.exit(1)
})

const run = require('../../modules/run')
const eventsData = require('./events-data')
const mailchimp = require('./mailchimp')

async function command (options) {
  // Fetch and save all events data
  const events = await eventsData(options)

  // Update mailchimp's audience members based on the event organizers list
  await mailchimp({ data: { events } }, options)
}

run(command)
