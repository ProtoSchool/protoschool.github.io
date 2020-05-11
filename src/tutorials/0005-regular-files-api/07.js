import utils from '../utils'

const validate = async (result, ipfs) => {
  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result. We are looking for the message in the file :('
    }
  }

  if (result instanceof Error) {
    if (result.code === utils.ipfs.errorCodes.ERR_NOT_FOUND) {
      return {
        fail: "Oops, we could not find a file with that IPFS path. Are you sure you're using the correct path with the correct CID? Try checking for typos. Remember, if you use the wrapping directory's CID, you need to append `/fun/success.txt` to the path name. Otherwise, if you're using the `fun` subdirectory's CID, you need to append `/success.txt`.",
        overrideError: true
      }
    }
    if (result.toString().includes('this dag node is a directory')) {
      return {
        fail: "The `cat` method only works on files, but you tried to use it on a directory. Did you forget to include the relative file path? Remember, if you use the wrapping directory's CID, you need to append `/fun/success.txt` to the path name. Otherwise, if you're using the `fun` subdirectory's CID, you need to append `/success.txt`.",
        overrideError: true
      }
    }
    if (result.toString().includes('multihash unknown function code')) {
      return {
        fail: 'The CID you used in the IPFS path for the `cat` method is not valid. Make sure you are using one of the CIDs we provided.',
        overrideError: true
      }
    } else {
      return { error: result }
    }
  }

  if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_TOBUFFER
    }
  }

  if (result instanceof Uint8Array) {
    let isEqual = (new TextEncoder()).encode('You did it!').every((elem, idx) => {
      return elem === result[idx]
    })
    if (isEqual) {
      return {
        fail: "Oops, don't forget to return a string! We included `.toString()` for you in the starter code. Did you remove it?"
      }
    }
  }

  if (result === 'You did it!') {
    return {
      success: 'Success!',
      logDesc: 'Here is the message you read from `success.txt` using `cat`:',
      log: result
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const code = `/* global ipfs, toBuffer */

const run = async () => {
  const bufferedContents = // access the content of the file as a buffer

  // we've taken care of converting the buffer to a string in the return statement below

  return bufferedContents.toString()

}
return run
`

const solution = `/* global ipfs, toBuffer */

const run = async () => {

  // You can access the file in two different ways with the CIDs we gave you

  // Using the CID of the top-level directory and file path relative to it:
  const bufferedContents = await toBuffer(ipfs.cat("/ipfs/QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/fun/success.txt"))

  // Using the dir subdirectory CID and file path relative to it:
  // const bufferedContents = await toBuffer(ipfs.cat("/ipfs/QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r/success.txt"))

  return bufferedContents.toString()
}
return run
`

const options = {
  overrideErrors: true,
  createTestTree: true
}

export default {
  validate,
  code,
  solution,
  options
}
