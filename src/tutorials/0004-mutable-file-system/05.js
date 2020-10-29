import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  console.log('Here\'s what `files.ls` revealed in your directory:')
  console.log(result)

  let expected = await all(ipfs.files.ls('/'))
  let directoryContentsMatch = JSON.stringify(result) === JSON.stringify(expected)

  // Confirm the right files were added to IPFS (should be unless they tweaked the default code)
  let uploadedFiles = window.uploadedFiles || []
  let uploadedFilenames = uploadedFiles.map(file => file.name.toString()).sort()
  let ipfsFilenames = expected.map(file => file.name.toString()).sort()
  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = expected.every(file => file.type === 0)
  let rightFilesUploaded = itemsMatch && itemsAreFiles

  if (!result) {
    return { fail: 'Oops, you forgot to return a result. Did you accidentally delete `return directoryContents`?' }
  } else if (uploadedFiles.length === 0) {
    // shouldn't happen because you can't hit submit without uploading files
    return { fail: 'Oops! You forgot to upload files to work with :(' }
  } else if (expected.length === 0) {
    // if no files are written to IPFS because they change the default code
    return { fail: 'Uh oh. Looks like no files made it into IPFS. Did you accidentally edit the default `write` code?' }
  } else if (!itemsAreFiles) {
    // if they forget the file name and just use a directory as the path
    // shouldn't happen unless they mess with default code
    return { fail: 'Uh oh. It looks like you created a directory instead of a file. Did you forget to include a filename in your path?' }
  } else if (!rightFilesUploaded) {
    return { fail: 'Uh oh. Your files weren\'t added to IPFS correctly. Did you accidentally edit the default `write` code?' }
  } else if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  } else if (directoryContentsMatch) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: 'Take a look at the complete data returned by the `ls` method:',
      log: result.map(utils.format.ipfsObject)
    }
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  // this code adds your uploaded files to IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  const rootDirectoryContents = // your code goes here

  return rootDirectoryContents
}
return run
`

// '/' in the solution code below is optional
const solution = `/* global ipfs, all */

const run = async (files) => {
  // this code adds your uploaded files to IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  const rootDirectoryContents = await all(ipfs.files.ls('/'))

  // alternatively, we can use a for await of loop
  // const rootDirectoryContents = []
  // for await (const item of ipfs.files.ls('/')) {
  //   rootDirectoryContents.push(item)
  // }

  return rootDirectoryContents
}

return run
`

export default {
  validate,
  code,
  solution
}
