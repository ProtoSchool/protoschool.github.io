let log = require('npmlog')

const events = require('../../modules/data/events')

module.exports = async function eventsData (options) {
  if (options.dryRun) {
    log.warn('buid:data:events', `dry-run option enabled: will not write events to json file`)
  }

  const fetchedEvents = await events.fetch()

  if (!fetchedEvents.length) {
    log.warn('buid:data:events', 'no events to show - events page will be empty')
    return fetchedEvents
  }

  if (options.dryRun) {
    log.info('build:data:events', `events has been processed successfully - would save ${fetchedEvents.length} events (dry run)`)
    return fetchedEvents
  }

  await events.save(fetchedEvents)
  log.info('build:data:events', `events have been processed successfully - ${fetchedEvents.length} approved events saved`)

  return fetchedEvents
}
