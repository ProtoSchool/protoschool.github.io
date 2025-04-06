import { warn, info } from 'npmlog'

import { fetch, save } from '../../modules/data/events'

const logGroup = 'build:data:events'

export default async function eventsData (options) {
  if (options.dryRun) {
    warn(logGroup, `{ dryRun: true }: will not write events to json file`)
  }

  const fetchedEvents = await fetch()

  if (!fetchedEvents.length) {
    warn(logGroup, 'no events to show - events page will be empty')
    return fetchedEvents
  }

  const savedEvents = await save(fetchedEvents, options)

  savedEvents.length &&
    info(logGroup, `events have been processed successfully - ${savedEvents.length} events saved`)

  return fetchedEvents
}
