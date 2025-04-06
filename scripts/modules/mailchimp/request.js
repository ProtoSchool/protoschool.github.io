import { error as _error } from 'npmlog'

import mailchimp from './auth'

export default async function request (params, options = {}) {
  let result

  try {
    result = await mailchimp[options.batch ? 'batch' : 'request'](params)
  } catch (error) {
    _error('modules:mailchimp:request', `request failed`)
    error.errors && _error('modules:mailchimp:request', `errors: ${JSON.stringify(error.errors)}`)
    _error('modules:mailchimp:request', `mailchimp error: ${error.status} ${error.title} - ${error.detail}`)
    _error('modules:mailchimp:request', `${error.type}`)
    console.log()

    throw error
  }

  if (result.statusCode && result.statusCode !== 200) {
    _error('modules:mailchimp:request', `request failed with statusCode=${result.statusCode}`)

    throw new Error(`Mailchimp request failed with statusCode=${result.statusCode}`)
  }

  return result
}
