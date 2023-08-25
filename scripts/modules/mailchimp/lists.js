import { createHash } from 'crypto'
import request from './request.js'

const AUDIENCE_INTEREST = '8589872a32' // event organizer newsletter

export async function getAll() {
  const result = await request({
    method: 'get',
    path: '/lists',
    query: {
      fields: ['id']
    }
  })

  return result.lists
}

export async function get(id) {
  const result = await request({
    method: 'get',
    path: '/lists/{id}',
    path_params: {
      id
    }
  })

  return result
}

export async function getListMembers(id) {
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

export async function updateListMember(id, member) {
  const hash = createHash('md5').update(member.emailAddress).digest('hex')

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
