const fs = require('fs')
const promisify = require('util').promisify

const log = require('npmlog')
const moment = require('moment')

const allTutorials = require('../../../src/static/tutorials.json')
const googleSheets = require('../googleapis/sheets')

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
    transform: event => new Date(`${event.date} ${event.startTime}`).toISOString()
  },
  {
    // End Time
    key: 'endTime',
    transform: event => new Date(`${event.date} ${event.endTime}`).toISOString()
  },
  {
    // How is this workshop being presented?
    key: 'type',
    transform: event => {
      if (event.type.includes('community')) {
        return 'community'
      } else if (event.type.includes('conference')) {
        return 'conference'
      } else if (event.type.includes('event')) {
        return 'event'
      }
    }
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
  },
  {
    key: 'duration',
    value: (event, transformedEvent) => (
      Math.abs(moment(new Date(transformedEvent.endTime)).diff(new Date(transformedEvent.startTime), 'minutes'))
    )
  }
]

/*
    Fetch events from Google Sheets and return only the approved ones
 */
exports.fetch = async function () {
  let spreadsheet

  log.info('data:events', 'fetching spreadsheet from Google')

  try {
    log.verbose('data:events', 'sheets.spreadsheets.values.get() request initiated')

    spreadsheet = await googleSheets.getSpreadSheet(SPREADSHEET)

    log.info('data:events', 'spreadsheet successfully fetched')
  } catch (error) {
    if (error) {
      log.error('data:events', `Failed to fetch spreadsheet from Google: ${error.message}`)
      console.error(error)

      return
    }
  }

  const rows = spreadsheet.data.values

  if (!rows.length) {
    log.warn('data:events', 'spreadsheet has no data')
    return
  }

  log.verbose('data:events', `processing spreadsheet with ${rows.length} rows`)

  // Transform google spreadsheet rows (array of arrays) to array of event objects
  let events = googleSheets.transformSpreadSheet(rows, columns, extraColumns)
  const approvedEvents = events.filter(event => event.approved)
  const pendingApprovalEvents = events.filter(event => event.pendingApproval)

  log.info('data:events', `total events: ${events.length}`)
  log.info('data:events', `events approved: ${approvedEvents.length}`)
  log.info('data:events', `events rejected: ${events.length - approvedEvents.length - pendingApprovalEvents.length}`)
  log.info('data:events', `events pending approval: ${pendingApprovalEvents.length}`)

  return approvedEvents
}

/*
    Save events to local static file to be used by the website
 */
exports.save = events => (
  promisify(fs.writeFile)('src/static/events.json', JSON.stringify(events, null, 2))
)
