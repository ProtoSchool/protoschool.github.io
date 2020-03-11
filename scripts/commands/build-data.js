/*
    Fetches all the data necessary to render the website:

    - Google APIs for events data
 */

let log = require('npmlog')

const run = require('../modules/run')
const events = require('../modules/data/events')

async function eventsData (options) {
  if (options.dryRun) {
    log.warn('buid:data:events', `dry-run option enabled: will not write events to json file`)
  }

  const fetchedEvents = await events.fetch()

  if (!fetchedEvents.length) {
    log.warn('buid:data:events', 'no events to show - events page will be empty')
    return
  }

  if (options.dryRun) {
    log.info('build:data:events', `events has been processed successfully - would save ${fetchedEvents.length} events (dry run)`)
    return
  }

  await events.save(fetchedEvents)
  log.info('build:data:events', `events have been processed successfully - ${fetchedEvents.length} approved events saved`)
}

async function command (options) {
  await eventsData(options)
}

run(command)
