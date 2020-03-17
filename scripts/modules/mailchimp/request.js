const log = require('npmlog')

const mailchimp = require('./auth')

module.exports = async function request (params, options = {}) {
  let result

  try {
    result = await mailchimp[options.batch ? 'batch' : 'request'](params)
  } catch (error) {
    log.error('modules:mailchimp:request', `request failed`)
    error.errors && log.error('modules:mailchimp:request', `errors: ${JSON.stringify(error.errors)}`)
    log.error('modules:mailchimp:request', `mailchimp error: ${error.status} ${error.title} - ${error.detail}`)
    log.error('modules:mailchimp:request', `${error.type}`)
    console.log()

    throw error
  }

  if (result.statusCode && result.statusCode !== 200) {
    log.error('modules:mailchimp:request', `request failed with statusCode=${result.statusCode}`)

    throw new Error(`Mailchimp request failed with statusCode=${result.statusCode}`)
  }

  return result
}
