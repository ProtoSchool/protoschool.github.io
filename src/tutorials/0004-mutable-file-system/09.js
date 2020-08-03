import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  if (!result) {
    return {
      fail: 'You forgot to return a result. Did you accidentally edit the return statement?'
    }
  }

  let someStuffFiles

  try {
    someStuffFiles = await all(ipfs.files.ls('/some/stuff'))
  } catch (error) {
    if (error.code === utils.ipfs.errorCodes.ERR_NOT_FOUND) {
      return {
        fail: "The directory `/some/stuff` doesn't exist. Try resetting the code and starting again.",
        overrideError: true
      }
    }

    throw error
  }

  const someStuffFilenames = someStuffFiles.map(file => file.name.toString()).sort()
  const uploadedFilenames = (window.uploadedFiles || []).map(file => file.name.toString()).sort()

  const noNewFile = JSON.stringify(uploadedFilenames) === JSON.stringify(someStuffFilenames)

  // establish filenames if they give the copied file the name `success.txt`
  const correctFilenames = [...uploadedFilenames]
  correctFilenames.push('success.txt')
  correctFilenames.sort()

  // establish filenames if they fail to give the copied file a name
  const incorrectFilenames = [...uploadedFilenames]
  incorrectFilenames.push('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')
  incorrectFilenames.sort()

  // check for a file with CID QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ
  const someStuffCIDs = someStuffFiles.map(file => file.cid.toString())
  const someFileHasRightCID = someStuffCIDs.includes('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')

  const returnedCorrectFilenames = JSON.stringify(correctFilenames) === JSON.stringify(someStuffFilenames)
  const returnedCIDAsFilename = JSON.stringify(incorrectFilenames) === JSON.stringify(someStuffFilenames)

  const logOutput = someStuffFiles.map(utils.format.ipfsObject)

  if (noNewFile) {
    return {
      fail: 'No new files have been copied into `/some/stuff`',
      logDesc: "Did you get the desination path wrong in your `files.cp` command? Here's what's in your `/some/stuff` directory now:",
      log: logOutput
    }
  } else if (someFileHasRightCID && returnedCIDAsFilename) {
    return {
      fail: 'You forgot to specify a filename.',
      logDesc: 'Check out the contents of your `/some/stuff` directory. You successfully copied the file but forgot to give it a name, so IPFS set its name equal to its CID. Try adding a filename to your destination path.',
      log: logOutput
    }
  } else if (!returnedCorrectFilenames) {
    return {
      fail: 'Did you pick the right destination path `(/some/stuff)`',
      logDesc: "Here's what's in your `/some/stuff` directory:",
      log: logOutput
    }
  } else if (returnedCorrectFilenames && !someFileHasRightCID) {
    return {
      fail: 'That new file has the wrong CID.',
      logDesc: "Check out the contents of your `/some/stuff` directory. You created a file called `success.txt` but it doesn't have the CID we're looking for.",
      log: logOutput
    }
  } else if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  } else if (returnedCorrectFilenames && someFileHasRightCID) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: 'This is the data that is now in your `/some/stuff` directory in IPFS:',
      log: result.map(utils.format.ipfsObject)
    }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await all(ipfs.files.ls('/'))
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(...filepathsToMove, '/some/stuff')

  // Your code goes here

  let someStuffDirectoryContents = await all(ipfs.files.ls('/some/stuff'))
  return someStuffDirectoryContents
}

return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await all(ipfs.files.ls('/'))
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(...filepathsToMove, '/some/stuff')

  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')

  let someStuffDirectoryContents = await all(ipfs.files.ls('/some/stuff'))
  return someStuffDirectoryContents
}

return run
`

const options = {
  overrideErrors: true,
  createTestFile: true
}

export default {
  validate,
  code,
  solution,
  options
}
