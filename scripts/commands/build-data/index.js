/*
    Fetches all the data necessary to render the website:

    - Google APIs for events data
 */

const run = require('../../modules/run')
const eventsData = require('./events-data')
const mailchimp = require('./mailchimp')

async function command (options) {
  const events = await eventsData(options)
  await mailchimp({ data: { events } }, options)
}

run(command)
