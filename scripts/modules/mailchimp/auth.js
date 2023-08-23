import Mailchimp from 'mailchimp-api-v3'

export default new Mailchimp(process.env.MAILCHIMP_API_KEY)
