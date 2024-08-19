import { warn, info } from 'npmlog'
import { pick, get } from 'lodash'

import { lists as _lists } from '../../modules/mailchimp'
import { getOrganizers } from '../../modules/data/events'

const logGroup = 'buid:data:mailchimp'

export default async function mailchimp (params, options) {
  if (options.dryRun) {
    warn(logGroup, `{ dryRun: true }: will not add event organizers to mailchimp audience.`)
  }

  // Fetch mailchimp data
  const lists = await _lists.getAll()

  if (lists.length > 1) {
    warn(logGroup, `More than one mailchimp audience found. will select the first with id=${lists[0].id}`)
  }

  const list = await _lists.getListMembers(lists[0].id)

  info(logGroup, `Found ${list.total_items} audience members.`)

  const members = list.members.map(member => (
    pick(member, ['id', 'status', 'email_address', 'merge_fields'])
  ))

  info(logGroup, `Found ${members.length} mailchimp audience members.`)

  options.debug &&
    console.log(JSON.stringify(members, null, 2))

  // Compute event organizers list from list of events
  const eventOrganizers = await getOrganizers(params.data.events)

  info(logGroup, `Found ${eventOrganizers.length} event organizers.`)

  options.debug &&
    console.log(JSON.stringify(eventOrganizers, null, 2))

  // Match event organizers with mailchimp's data
  const membersToUpdate = eventOrganizers.filter(organizer => {
    const existsInMailchimp = members.find(mailchimpMember => mailchimpMember.email_address === organizer.emailAddress)

    // Add new member or update their name
    return !existsInMailchimp ||
      !get(existsInMailchimp, 'merge_fields.FNAME') ||
      !get(existsInMailchimp, 'merge_fields.LNAME')
  })

  if (!membersToUpdate.length) {
    info(logGroup, `No members to update.`)
    return
  }

  info(logGroup, `New members to update: ${membersToUpdate.length}!`)

  options.debug &&
    console.log(JSON.stringify(membersToUpdate, null, 2))

  if (options.dryRun) {
    info(logGroup, `would update ${membersToUpdate.length} event organizers (dry run)`)
    return
  }

  let someFailed = false

  // Update mailchimp list members
  await Promise.all(
    membersToUpdate.map(member => (
      _lists.updateListMember(list.list_id, member))
      .catch(error => {
        if (error.status === 400 && error.title === 'Member Exists') {
          someFailed = true
          return
        }

        if (error.status === 400 && error.title === 'Forgotten Email Not Subscribed') {
          someFailed = true
          return
        }

        throw error
      })
    )
  )

  if (someFailed) {
    info(logGroup, `Adding some event organizers to mailchimp audience failed. Please check the above errors.`)
  } else {
    info(logGroup, `Event organizers successfully updated in mailchimp audience.`)
  }
}
