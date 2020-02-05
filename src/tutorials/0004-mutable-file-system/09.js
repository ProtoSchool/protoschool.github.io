const validate = async (result, ipfs) => {
  if (!result) {
    return {
      fail: 'You forgot to return a result. Did you accidentally edit the return statement?'
    }
  }

  let someStuffFiles

  try {
    someStuffFiles = await await ipfs.files.ls('/some/stuff', { long: true })
  } catch (err) {
    if (err.code === 'ERR_NOT_FOUND') {
      return {
        fail: 'The directory `/some/stuff` did not exist - try resetting the code and starting again'
      }
    }

    throw err
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

  // check for a file with hash QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ
  const someStuffHashes = someStuffFiles.map(file => file.hash.toString())
  const someFileHasRightHash = someStuffHashes.includes('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')

  const returnedCorrectFilenames = JSON.stringify(correctFilenames) === JSON.stringify(someStuffFilenames)
  const returnedHashAsFilename = JSON.stringify(incorrectFilenames) === JSON.stringify(someStuffFilenames)

  if (noNewFile) {
    return {
      fail: 'No new files have been copied into `/some/stuff`',
      logDesc: "Did you get the desination path wrong in your `files.cp` command? Here's what's in your `/some/stuff` directory now:",
      log: someStuffFiles
    }
  } else if (someFileHasRightHash && returnedHashAsFilename) {
    return {
      fail: 'You forgot to specify a filename.',
      logDesc: 'Check out the contents of your `/some/stuff` directory. You successfully copied the file but forgot to give it a name, so IPFS set its name equal to its hash. Try adding a filename to your destination path.',
      log: someStuffFiles
    }
  } else if (!returnedCorrectFilenames) {
    return {
      fail: 'Did you pick the right destination path `(/some/stuff)`',
      logDesc: "Here's what's in your `/some/stuff` directory:",
      log: someStuffFiles
    }
  } else if (returnedCorrectFilenames && !someFileHasRightHash) {
    return {
      fail: 'That new file has the wrong hash.',
      logDesc: "Check out the contents of your `/some/stuff` directory. You created a file called `success.txt` but it doesn't have the hash we're looking for.",
      log: someStuffFiles
    }
  } else if (returnedCorrectFilenames && someFileHasRightHash) {
    return {
      success: 'Success! You did it!',
      logDesc: 'This is the data that is now in your `/some/stuff` directory in IPFS:',
      log: result
    }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  // Your code goes here

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return someStuffDirectoryContents
}

return run
`

const solution = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return someStuffDirectoryContents
}

return run
`

const modules = { cids: require('cids') }

const options = {
  type: 'file-upload',
  overrideErrors: true,
  createTestFile: true
}

export default {
  validate,
  code,
  solution,
  modules,
  options
}
