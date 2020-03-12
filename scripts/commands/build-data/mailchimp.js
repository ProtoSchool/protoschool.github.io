const log = require('npmlog')
const _ = require('lodash')

const mailchimpApi = require('../../modules/mailchimp')
const events = require('../../modules/data/events')

const logGroup = 'buid:data:mailchimp'

module.exports = async function mailchimp (params, options) {
  if (options.dryRun) {
    log.warn(logGroup, `dry-run option enabled: will not add event organizers to mailchimp audience.`)
  }

  const lists = await mailchimpApi.lists.getAll()

  if (lists.length > 1) {
    log.warn(logGroup, `More than one mailchimp audience found. will select the first with id=${lists[0].id}`)
  }

  const list = await mailchimpApi.lists.getListMembers(lists[0].id)

  log.info(logGroup, `Found ${list.total_items} audience members.`)

  const members = list.members.map(member => _.pick(member, ['id', 'status', 'email_address']))

  const eventOrganizers = await events.getOrganizers(params.data.events)

  log.info(logGroup, `Found ${eventOrganizers.length} event organizers.`)

  options.dryRun && options.debug &&
    console.log(JSON.stringify(eventOrganizers, null, 2))

  const membersToAdd = eventOrganizers.filter(organizer => {
    return !members.find(mailchimpMember => mailchimpMember.email_address === organizer.emailAddress)
  })

  log.info(logGroup, `New members to add: ${membersToAdd.length}!`)

  options.dryRun && options.debug &&
    console.log(JSON.stringify(membersToAdd, null, 2))

  if (options.dryRun) {
    log.info(logGroup, `would subscribe ${membersToAdd.length} members={${membersToAdd.map(member => member.emailAddress).join(',')}} (dry run)`)
    return
  }

  await Promise.all(
    membersToAdd.map(member => (
      mailchimpApi.lists.addListMember(list.list_id, member))
      .catch(error => {
        if (error.status === 400 && error.title === 'Member Exists') {
          return
        }

        throw error
      })
    )
  )

  log.info(logGroup, `Event organizers successfully added to mailchimp audience.`)
}
