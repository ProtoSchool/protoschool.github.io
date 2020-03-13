const Mailchimp = require('mailchimp-api-v3')

module.exports = new Mailchimp(process.env.MAILCHIMP_API_KEY)
