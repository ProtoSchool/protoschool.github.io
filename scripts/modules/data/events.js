const fs = require('fs')
const promisify = require('util').promisify

const _ = require('lodash')
const log = require('npmlog')
const moment = require('moment')
const Table = require('cli-table')

const allTutorials = require('../../../src/static/tutorials.json')
const googleSheets = require('../googleapis/sheets')

const logGroup = 'modules:data:events'

const EVENTS_FILE = 'src/static/events.json'
const SPREADSHEET = {
  spreadsheetId: '12crFIs4Og35I0pdhutczDNPA1sx48ec4Zgm8fIjVbkM',
  range: 'Form Responses 1!A2:X'
}

// Event properties ordered by the columns order in the spreadsheet
const columns = [
  'createdAt', // Timestamp
  'emailAddress', // Email Address
  'guidelines', // ProtoSchool Event Guidelines
  {
    // Which ProtoSchool tutorial(s) will attendees explore at your event?
    key: 'tutorials',
    transform: event => Object.keys(allTutorials)
      .map(tutorialId => ({ tutorialId, ...allTutorials[tutorialId] }))
      .filter(tutorial => {
        return event.tutorials.split(',')
          .find(featuredTutorial => featuredTutorial.includes(tutorial.url))
      })
      .map(({ tutorialId }) => tutorialId)
  },
  'cocUrl', // Code of Conduct URL
  'url', // Registration Website URL
  'city', // City
  'region', // State/Region
  'country', // Country
  'date', // Date
  {
    // Start Time
    key: 'startTime',
    transform: event => event.date && moment(new Date(`${event.date} ${event.startTime}`)).format('YYYY-MM-DDTHH:mm')
  },
  'hostedByName', // What is the name of your community group or Meetup?
  'hostedByUrl', // What's the URL for your group's overarching website or Meetup page?
  'hostedAtName', // Conference Name
  'hostedAtUrl', // Conference Website
  'firstName', // Name
  'github', // GitHub Handle
  'twitter', // Twitter handle or hashtag for your workshop or group
  'lastName',
  {
    key: 'nameOrder',
    transform: event => event.nameOrder.split('(')[0].trim().replace(' ', '-').toLowerCase()
  },
  {
    // Approved
    key: 'approved',
    transform: event => event.approved === 'Yes'
  },
  'notes'
]

const extraColumns = [
  {
    key: 'fullName',
    value: (event, transformedEvent) => (
      transformedEvent.nameOrder === 'given-family'
        ? `${transformedEvent.firstName} ${transformedEvent.lastName}`
        : `${transformedEvent.lastName} ${transformedEvent.firstName}`
    ).trim()
  },
  {
    key: 'pendingApproval',
    value: event => !event.approved
  }
]

// Event properties to be saved on the events.json file
const whitelist = [
  'id',
  'city',
  'region',
  'country',
  'startTime',
  'endTime',
  'duration',
  'tutorials',
  'cocUrl',
  'url',
  'type',
  'hostedByName',
  'hostedByUrl',
  'hostedAtName',
  'hostedAtUrl'
]

function logEventsResults (events) {
  const approved = events.filter(event => event.approved)
  const rejected = events.filter(event => (!event.approved && !event.pendingApproval))
  const pending = events.filter(event => event.pendingApproval)

  const table = new Table({ head: ['', 'Pending', 'Approved', 'Rejected', 'All'] })
  const isPastEvent = ({ date }) => !moment(new Date(date)).isAfter()
  const isUpcomingEvent = ({ date }) => moment(new Date(date)).isAfter()

  table.push(
    { 'Past Events': [
      pending.filter(isPastEvent).length,
      approved.filter(isPastEvent).length,
      rejected.filter(isPastEvent).length,
      events.filter(isPastEvent).length
    ]},
    { 'Upcoming Events': [
      pending.filter(isUpcomingEvent).length,
      approved.filter(isUpcomingEvent).length,
      rejected.filter(isUpcomingEvent).length,
      events.filter(isUpcomingEvent).length
    ]},
    { 'All': [
      pending.length,
      approved.length,
      rejected.length,
      events.length
    ]}
  )

  console.log()
  console.log(table.toString())
  console.log()

  log.info(logGroup, `total events submitted: ${events.length}`)
}

/*
    Fetch events from Google Sheets and return only the approved ones
 */
exports.fetch = async function () {
  let spreadsheet

  log.info(logGroup, 'fetch: fetching spreadsheet from Google')

  try {
    log.verbose(logGroup, 'sheets.spreadsheets.values.get() request initiated')

    spreadsheet = await googleSheets.getSpreadSheet(SPREADSHEET)

    log.info(logGroup, 'spreadsheet successfully fetched')
  } catch (error) {
    if (error) {
      log.error(logGroup, `Failed to fetch spreadsheet from Google: ${error.message}`)
      console.error(error)

      return
    }
  }

  const rows = spreadsheet.data.values

  if (!rows.length) {
    log.warn(logGroup, 'spreadsheet has no data')
    return
  }

  log.verbose(logGroup, `processing spreadsheet with ${rows.length} rows`)

  // Transform google spreadsheet rows (array of arrays) to array of event objects
  let events = googleSheets.transformSpreadSheet(rows, columns, extraColumns)

  logEventsResults(events)

  return events
}

/*
  Save events to local static file to be used by the application
 */
exports.save = events => {
  log.info(logGroup, `save: saving approved events to ${EVENTS_FILE}`)

  const approved = events.filter(event => event.approved)

  return promisify(fs.writeFile)(
    EVENTS_FILE,
    JSON.stringify(approved.map(event => _.pick(event, whitelist)), null, 2)
  )
}

exports.getOrganizers = async (events) => {
  log.info(logGroup, `getOrganizers: computing organizers from events list.`)

  const organizers = []

  events.forEach(event => {
    if (event.emailAddress && !organizers.find(organizer => event.emailAddress === organizer.emailAddress)) {
      organizers.push(_.pick(event, ['fullName', 'emailAddress']))
    }
  })

  return organizers
}
