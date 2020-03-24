/*
    Fetches all the data necessary to render the website:

    - Google APIs for events data
 */

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
