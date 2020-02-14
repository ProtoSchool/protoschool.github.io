const validate = async (result, ipfs) => {
  const correctHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'

  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (!!result & !result.hash) {
    return { fail: "That result doesn't look right. Are you sure you ran the `stat` method on your empty root directory?" }
  } else if (!!result && result.hash === correctHash) {
    return {
      success: 'Success! You did it!',
      logDesc: "Here's the status of your root directory ( `/` ). Notice that it has a hash (CID) even though it doesn't have contents yet. Every empty IPFS node has this exact same hash, because their non-existent contents are identical!",
      log: result
    }
  }
}

const code = `/* global ipfs */

const run = async () => {
  // your code goes here
}

return run
`

const solution = `/* global ipfs */

const run = async () => {
  return await ipfs.files.stat('/')
}

return run
`

const modules = { cids: require('cids') }

const options = {
  overrideErrors: true
}

export default {
  validate,
  code,
  solution,
  modules,
  options
}
