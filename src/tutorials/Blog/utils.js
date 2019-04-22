'use strict'

import CID from 'cids'

// Stringify JSON with space in between
const stringify = (json) => JSON.stringify(json, null, ' ').replace('\n', '')

// Validate that a give array consists of number of CIDs
const validateArrayOfCids = (result, size) => {
  if (!Array.isArray(result) || result.length !== size) {
    return { fail: `You need to return an array of ${size} CIDs.` }
  }
  const isCids = result.every(CID.isCID)
  if (!isCids) {
    return { fail: 'Array elements need to be CIDs.' }
  }
  return { success: '' }
}

export default {
  stringify,
  validateArrayOfCids
}
