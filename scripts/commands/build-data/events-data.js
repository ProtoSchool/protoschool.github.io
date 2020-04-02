let log = require('npmlog')

const events = require('../../modules/data/events')

const logGroup = 'build:data:events'

module.exports = async function eventsData (options) {
  if (options.dryRun) {
    log.warn(logGroup, `{ dryRun: true }: will not write events to json file`)
  }

  const fetchedEvents = await events.fetch()

  if (!fetchedEvents.length) {
    log.warn(logGroup, 'no events to show - events page will be empty')
    return fetchedEvents
  }

  const savedEvents = await events.save(fetchedEvents, options)

  savedEvents.length &&
    log.info(logGroup, `events have been processed successfully - ${savedEvents.length} events saved`)

  return fetchedEvents
}
