const request = require('./request')

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

exports.addListMember = async (id, member) => {
  return request({
    method: 'post',
    path: '/lists/{id}/members',
    path_params: {
      id
    },
    body: {
      email_address: member.emailAddress,
      status: 'subscribed',
      merge_fields: {
        FNAME: member.firstName,
        LNAME: member.lastName
      }
    }
  })
}
