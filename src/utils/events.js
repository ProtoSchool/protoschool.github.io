import eventsList from '../static/events.json'
import moment from 'moment'

export const futureEvents = function (maxLength) {
  let futureEvents = eventsList
    .filter((event) => isFuture(event.startTime))
    .sort((a, b) => moment(a.startTime) - moment(b.startTime))

  if (!maxLength) {
    return futureEvents
  } else {
    return futureEvents.slice(0, maxLength)
  }
}

export const pastEvents = function (maxLength) {
  let pastEvents = eventsList
    .filter((event) => !isFuture(event.startTime))
    .sort((a, b) => moment(b.startTime) - moment(a.startTime))

  if (!maxLength) {
    return pastEvents
  } else {
    return pastEvents.slice(0, maxLength)
  }
}

export const isFuture = function (date) {
  return (moment(date) >= moment())
}
