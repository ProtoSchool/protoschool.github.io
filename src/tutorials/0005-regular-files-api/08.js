const validate = async (result, ipfs) => {
  const expectedResult = await ipfs.get('QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy')

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
        fail: "The `CID` provided to `ipfs.get` is incorrect. Make sure you're using the `CID` we provided"
      }
    } else {
      return { error: result.error }
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The return value should be an array identical to the one returned by the `get` function.'
    }
  }

  let isStructureValid = result.every((elem) => {
    if (elem.hash === undefined || typeof elem.hash !== 'string') return false
    if (elem.path === undefined || typeof elem.path !== 'string') return false
    if (elem.name === undefined || typeof elem.name !== 'string') return false
    if (elem.depth === undefined || typeof elem.depth !== 'number') return false
    if (elem.size === undefined || typeof elem.size !== 'number') return false
    if (elem.type === undefined || typeof elem.type !== 'string') return false
    return true
  })

  if (!isStructureValid) {
    return {
      fail: 'The returned value does not match the structure of the typical output of the `get` method. Did you accidentally use a method other than `get`?'
    }
  }

  let usedLsInsteadOfGet = result.every((elem) => {
    if (elem.type === 'file' && elem.content === undefined) return true
    return false
  })

  if (usedLsInsteadOfGet) {
    return {
      fail: 'It appears you used the `ls` method instead of the `get` method. Please try again with the get method.'
    }
  }

  if (JSON.stringify(result) === JSON.stringify(expectedResult)) {
    return {
      success: "Congratulations! You've completed this series of lessons!",
      logDesc: 'Below is the result of calling the `get` method on the top-level directory. (Normally the results would be much more dense because of the buffered file contents included, but we intentionally created tiny text files to limit this effect.)' +
              "\n\n Notice that because we created these files using `{ wrapWithDirectory: true }`, each item's `path` is defined here by the top-level directory's CID plus the item's relative path, and each file or subdirectory has a human-readable `name`. Only the top-level directory itself has a `path` value that matches its `hash` and `name`, all of which are identical CIDs.",
      log: result
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const code = `/* global ipfs */
const run = async () => {
  let result = // your code here

  return result
}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  let result = await ipfs.get('QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy')

  return result
}
return run
`

const modules = { cids: require('cids') }

const options = {
  type: 'file-upload',
  overrideErrors: true,
  createTestTree: true
}

export default {
  validate,
  code,
  solution,
  modules,
  options
}
