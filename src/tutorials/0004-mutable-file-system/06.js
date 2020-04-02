import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  // cid of directory if empty
  const emptyDirectoryCID = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'

  // results of incorrectly running ls instead of stat
  const lsResult = await all(ipfs.files.ls('/'))

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  } else if (JSON.stringify(result) === JSON.stringify(lsResult)) {
    return {
      fail: 'Oops! Looks like you used `ls` instead of `stat`. Check out the results below, then try again.',
      logDesc: 'Because you used `ls`, your result is an array of files as shown below, not the directory status.',
      log: result.map(utils.format.ipfsObject)
    }
  } else if (!!result & !result.cid) {
    return { fail: "That result doesn't look right. Are you sure you ran the `stat` method on your root directory?" }
  } else if (!!result && result.cid.toString() === emptyDirectoryCID) {
    return { fail: 'Oops! It looks like your directory is empty. Did you delete some of the previous code?' }
  } else if (!!result && result.cid.toString() !== emptyDirectoryCID) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: "Here's the status of your updated root directory ( `/` ). Notice how this data compares to what you saw when the directory was empty. The `cid` has changed because of the new contents, as have the `cumulativeSize` and `blocks`. Because a directory is actually made up of links to content, rather than data itself, a directory's `size` is always `0`. `cumulativeSize` changes because it represents not just the file sizes of all the entries in that directory, but also the metadata that describes those entries: types, block sizes and so on.",
      log: utils.format.ipfsObject(result)
    }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  // this code adds your uploaded files to IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  const rootDirectoryContents = await all(ipfs.files.ls('/'))

  const directoryStatus = // your code goes here

  return directoryStatus
}

return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  // this code adds your uploaded files to IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  const rootDirectoryContents = await all(ipfs.files.ls('/'))
  const directoryStatus = await ipfs.files.stat('/')
  return directoryStatus
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
