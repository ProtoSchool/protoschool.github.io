import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  const uploadedFiles = window.uploadedFiles || false

  const iterable = ipfs.add(window.uploadedFiles)
  const expectedResult = await all(iterable)

  if (!result) {
    return {
      fail: utils.validationMessages.NO_RESULT
    }
  }

  if (result.error) {
    return { error: result.error }
  }

  if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The returned value should be an array.'
    }
  }

  if (result.length > uploadedFiles.length) {
    return {
      fail: 'The array you returned has more items than the number of files you uploaded. Be sure to add each file to IPFS just once, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  if (result.length < uploadedFiles.length) {
    return {
      fail: 'The array you returned has fewer items than the number of files you uploaded. Be sure to add each file to IPFS, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  const fileText = result.length > 1 ? `these files` : 'this file'
  const valueText = result.length > 1 ? `values` : 'value'
  const thatText = result.length > 1 ? `them` : 'it'

  if (JSON.stringify(expectedResult) === JSON.stringify(result)) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: 'Your `add` command returned the array of objects below. Notice in particular the `cid` ' + valueText + ", since we'll need " + thatText + ' to access ' + fileText + ' again later. The `path` matches the `cid` for ' + fileText + ", but we'll see in future lessons that that's not always true.",
      log: result.map(utils.format.ipfsObject)
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  const result = // Place your code to add a file or files here

  return result
}
return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  const result = await all(ipfs.add(files))

  // or using for await...of loop
  //const result = []
  //
  //for await (const resultPart of ipfs.add(files)) {
  //  result.push(resultPart)
  //}

  return result
}
return run
`

const options = {
  overrideErrors: true
}

export default {
  validate,
  code,
  solution,
  options
}
