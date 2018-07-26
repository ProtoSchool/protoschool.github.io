'use strict'

const CID = require('cids')

// Returns all the IPLD links of an object
const findLinks = (data) => {
  const links = []
  for (const [key, value] of Object.entries(data)) {
    if (key === '/') {
      links.push(value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        links.push(...findLinks(item))
      }
    } else if (typeof value === 'object') {
      links.push(...findLinks(value))
    }
  }
  return links
}

// Stringify JSON with space in between
const stringify = (json) => JSON.stringify(json, null, ' ').replace('\n', '')

// Validate that a give array consists of number of CIDs
const validateArrayOfCids = (result, size) => {
  if (!Array.isArray(result) || result.length !== size) {
    return {fail: `You need to return an array of ${size} CIDs`}
  }
  const isCids = result.every(CID.isCID)
  if (!isCids) {
    return {fail: `Array elements need to be CIDs`}
  }
  return {success: ''}
}

export default {
  findLinks,
  stringify,
  validateArrayOfCids
}
