import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  let uploadedFiles = window.uploadedFiles || []
  const fileObjectsArray = window.uploadedFiles.map((file) => { return { path: file.name, content: file } })
  const addedFiles = await all(ipfs.addAll(fileObjectsArray, { wrapWithDirectory: true }))
  const directoryCID = addedFiles[addedFiles.length - 1].cid

  const expectedResults = await all(ipfs.ls(directoryCID))

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    if (result.error.toString().includes("Cannot read property 'indexOf' of null") ||
        result.error.toString().includes('path.indexOf is not a function') ||
        result.error.toString().includes('multihash unknown function code')) {
      return {
        fail: "The CID provided to `ipfs.ls` is incorrect. Make sure you're using the `directoryCID` variable we provided as an argument to `ipfs.ls`."
      }
    } else {
      return { error: result.error }
    }
  }

  if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The return value should be an array, just like the `ls` function returns. Make sure you are returning the correct value.'
    }
  }

  if (uploadedFiles.length !== result.length) {
    return {
      fail: "The number of uploaded files is different from the number of files in the top-level directory. Make sure you're using the correct `CID` and not changing the preset code block."
    }
  }

  let isStructureValid = result.every((elem) => {
    if (!elem.cid || typeof elem.cid !== 'object') return false
    if (!elem.path || typeof elem.path !== 'string') return false
    if (!elem.name || typeof elem.name !== 'string') return false
    if (!elem.depth || typeof elem.depth !== 'number') return false
    if (!elem.size || typeof elem.size !== 'number') return false
    if (!elem.type || typeof elem.type !== 'string') return false
    return true
  })

  if (!isStructureValid) {
    return {
      fail: "The returned value doesn't match the structure normally returned by `ls`. Are you sure you're returning the result of the `ls` method?"
    }
  }

  let rootIsFile = result.every((elem) => {
    if (elem.path === elem.name && elem.path === elem.cid.toString()) return true
    return false
  })

  if (rootIsFile) {
    return {
      fail: "You passed a file's CID as an argument to the `ls` method, rather than the wrapping directory's CID. If you reset your code, you'll find that we've already saving the needed CID for you as `directoryCID` (see the hint above)."
    }
  }

  if (JSON.stringify(expectedResults) === JSON.stringify(result)) {
    return {
      success: 'Success!',
      logDesc: "Here are the results returned by the `ls` method for the top-level directory. Notice that there are new fields here that we didn't see in the data returned by the `addAll` method. Also, take a look at how the `cid` and `path` values now differ. The `cid` for each file is the CID of the file itself, while the the `path` is the CID of the top-level directory followed by the filename.",
      log: result.map(utils.format.ipfsObject)
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  const fileObjectsArray = files.map((file) => { return { path: file.name, content: file }})
  const addedFiles = await all(ipfs.addAll(fileObjectsArray, { wrapWithDirectory: true }))
  const directoryCID = addedFiles[addedFiles.length - 1].cid

  // only edit code below this point

  return // your code to list the contents of the top-level directory
}
return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  const fileObjectsArray = files.map((file) => { return { path: file.name, content: file }})
  const addedFiles = await all(ipfs.addAll(fileObjectsArray, { wrapWithDirectory: true }))
  const directoryCID = addedFiles[addedFiles.length - 1].cid

  return all(ipfs.ls(directoryCID))
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
