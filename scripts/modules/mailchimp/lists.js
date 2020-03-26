const crypto = require('crypto')
const request = require('./request')

const AUDIENCE_INTEREST = '8589872a32' // event organizer newsletter

exports.getAll = async () => {
  const result = await request({
    method: 'get',
    path: '/lists',
    query: {
      fields: ['id']
    }
  })

  return result.lists
}

exports.get = async (id) => {
  const result = await request({
    method: 'get',
    path: '/lists/{id}',
    path_params: {
      id
    }
  })

  return result
}

exports.getListMembers = async (id) => {
  const result = await request({
    method: 'get',
    path: '/lists/{id}/members',
    path_params: {
      id
    },
    query: {
      count: 10000000000
    }
  }, { batch: true })

  return result
}

exports.updateListMember = async (id, member) => {
  const hash = crypto.createHash('md5').update(member.emailAddress).digest('hex')

  return request({
    method: 'put',
    path: `/lists/{id}/members/${hash}`,
    path_params: {
      id
    },
    body: {
      email_address: member.emailAddress,
      status: 'subscribed',
      merge_fields: {
        FNAME: member.firstName,
        LNAME: member.lastName
      },
      interests: {
        [AUDIENCE_INTEREST]: true
      }
    }
  })
}
