import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  let listedSome = null
  let listedSomeStuff = null

  /** CHECK FOR DOING LS ON SOMETHING OTHER THAN ROOT **/

  let stringifiedResult = JSON.stringify(result, null, 2)
  let ipfsFilesInRoot = await all(ipfs.files.ls('/'))
  let listedRoot = stringifiedResult === JSON.stringify(ipfsFilesInRoot, null, 2)
  let rootSomeItemIsFile = ipfsFilesInRoot.some(file => file.type === 0)

  const includesSome = ipfsFilesInRoot.some(file => file.name === 'some' && file.type === 1)
  if (includesSome) {
    const ipfsFilesInSome = await all(ipfs.files.ls('/some'))
    listedSome = stringifiedResult === JSON.stringify(ipfsFilesInSome, null, 2)

    const includesStuff = ipfsFilesInSome.some(file => file.name === 'stuff' && file.type === 1)
    if (includesStuff) {
      const ipfsFilesInSomeStuff = await all(ipfs.files.ls('/some/stuff'))
      listedSomeStuff = stringifiedResult === JSON.stringify(ipfsFilesInSomeStuff, null, 2)
    }
  }

  /** CHECK FOR CORRECT /SOME/STUFF DIRECTORY **/

  // Correct directory CID
  const someStuffCID = 'QmVneuc3suf78aVdvFY3BW9HoiEfNxD7WB5zu1f9fbun3D' // /some/stuff/
  // Common incorrect directory CIDs
  const emptyDirectoryCID = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn' // empty /some/ OR /stuff/ directory
  const stuffSomeCID = 'QmXHDGVf4VnHws1tNyEcyVKjHrtv927xceAG9RmBWMw8cf' // /stuff/some/

  // Check whether array contains certain directory CID & certain directory name
  function contains (cid, name) {
    if (Array.isArray(result)) {
      return result.some(file => (file.cid && file.cid.toString() === cid) && (file.name === name))
    }
  }

  /** CHECK FOR CORRECT FILENAMES **/

  let uploadedFiles = window.uploadedFiles || []
  let resultSorted = null
  let expectedSorted = null
  let contentsMatch = null

  if (Array.isArray(result)) {
    resultSorted = result.map(file => file.name.toString()).sort()
    if (uploadedFiles.length) {
      let expected = uploadedFiles.map(file => file.name.toString())
      expected.push('some')
      expectedSorted = expected.sort()
      contentsMatch = JSON.stringify(resultSorted) === JSON.stringify(expectedSorted)
    }
  }

  /** DISPLAY FAILURE/SUCCESS MESSAGES **/

  if (!result) {
    return {
      fail: 'Oops, you forgot to return a result. Did you accidentally delete `return directoryContents`?'
    }
  } else if (result instanceof Error && result.code === utils.ipfs.errorCodes.ERR_NOT_FOUND) {
    // user forgot to use {parents: true} option so path isn't found
    return {
      fail: 'The path to the directory you\'re trying to create can\'t be found. Did you forget to use the `{ parents: true }` option?',
      overrideError: true
    }
  } else if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  } else if (!listedRoot) {
    // user edited the ls line to show something other than root directory, which will also cause most later checks to fail
    let returnedDirectoryMsg = ''
    if (listedSome) {
      returnedDirectoryMsg = ' in your `/some` directory'
    } else if (listedSomeStuff) {
      returnedDirectoryMsg = ' in your `/some/stuff` directory'
    } else {
      returnedDirectoryMsg = ''
    }
    return {
      fail: 'Looks like you edited the `ls` code to list something other than the root directory. Please try again, editing only the section of code indicated.',
      logDesc: 'Here\'s what your `ls` command shows' + returnedDirectoryMsg + ':',
      log: result.map(utils.format.ipfsObject)
    }
  } else if (uploadedFiles.length === 0) {
    // shouldn't happen because you can't hit submit without uploading files
    return {fail: 'Oops! You forgot to upload files to work with :('}
  } else if (!rootSomeItemIsFile) {
    // no files written to IPFS because user changed default code to remove write command
    return {
      fail: 'Uh oh. Looks like no files made it into IPFS. Did you accidentally edit the default `write` code?',
      logDesc: "Here's what's in your root directory:",
      log: ipfsFilesInRoot.map(utils.format.ipfsObject)
    }
  } else if (contains(stuffSomeCID, 'stuff')) {
    // created /stuff/some instead of /some/stuff
    return { fail: 'Uh oh. Looks like you created /stuff/some instead of `/some/stuff`.' }
  } else if (contains(emptyDirectoryCID, 'stuff')) {
    // created /stuff instead of /some/stuff.
    return { fail: 'Uh oh. Looks like you created /stuff instead of `/some/stuff`.' }
  } else if (contains(emptyDirectoryCID, 'some')) {
    // created /some instead of /some/stuff
    return { fail: 'Uh oh. Looks like you created /some instead of `/some/stuff`.' }
  } else if (!contains(someStuffCID, 'some')) {
    // didn't create empty some/stuff
    return { fail: 'Uh oh. Looks like your directory doesn\'t contain an empty `/some/stuff/` directory.' }
  } else if (contains(someStuffCID, 'some') && !contentsMatch) {
    // created empty /some/stuff but other files are wrong (messed up write method)
    return {
      fail: 'Hmmm. You created a `/some/stuff` directory but something else is wrong. Did you accidentally edit the default `write` code so your other files weren\'t all added?',
      logDesc: "Here's what was returned by `ls` in your root directory.",
      log: ipfsFilesInRoot.map(utils.format.ipfsObject)
    }
  } else if (contains(someStuffCID, 'some') && contentsMatch) {
    // filenames match and created empty some/stuff
    return {
      success: 'Success! Check out your directory contents below.',
      logDesc: "Here's what was returned by `ls` in your root directory. Notice how directories have a type of `1` while files have a type of `0`.",
      log: ipfsFilesInRoot.map(utils.format.ipfsObject)
    }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  // This code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  // Add your code to create a new directory here

  let rootDirectoryContents = await all(ipfs.files.ls('/'))
  return rootDirectoryContents
}

return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  // This code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  await ipfs.files.mkdir('/some/stuff', { parents: true })

  let rootDirectoryContents = await all(ipfs.files.ls('/'))
  return rootDirectoryContents
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
