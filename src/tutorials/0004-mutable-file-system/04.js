import all from 'it-all'

import utils from '../utils'

const validate = async (result, ipfs) => {
  // Validation will be done by matching filenames between the
  // uploadedFiles array and the files in IPFS and ensuring that the type of each
  // file in IPFS is 0 (file, not directory).
  // If IPFS errors out, we try to output a clearer version to the user. If that's
  // not possible, the error from IPFS will be the output.

  if (result instanceof Error) {
    if (result.code === utils.ipfs.errorCodes.EINVALIDCHILDNAME) {
      // Forgot the file name and just used a directory as the path
      return {
        fail: 'Uh oh. It looks like you created a directory instead of a file. Did you forget to include a filename in your path?',
        overrideError: true
      }
    } else if (result.code === utils.ipfs.errorCodes.ERR_NO_EXIST) {
      // Forgot the `{ create: true }` option
      return {
        fail: "The file doesn't exist yet, so you need to create it. Did you forget an option?",
        overrideError: true
      }
    }

    return {
      error: result
    }
  }

  let uploadedFiles = window.uploadedFiles || []

  let ipfsFiles = await all(ipfs.files.ls('/'))

  let uploadedFilenames = uploadedFiles.map(file => file.name.toString()).sort()
  let ipfsFilenames = ipfsFiles.map(file => file.name.toString()).sort()
  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = ipfsFiles.every(file => file.type === 0)

  if (itemsMatch && itemsAreFiles) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: 'This is the data that is now in your root directory in IPFS:',
      log: ipfsFiles.map(utils.format.ipfsObject)
    }
  }

  if (uploadedFiles.length === 0) {
    // Shouldn't happen because you can't hit submit without uploading files
    return { fail: 'Oops! You forgot to upload files to work with :(' }
  }

  if (!ipfsFiles.length) {
    return { fail: 'Uh oh. There was nothing in your MFS node. Did you add the uploaded files to it?' }
  }

  if (!itemsAreFiles) {
    return { fail: "Looks like you didn't upload any files. Did you upload a directory instead?" }
  }

  if (!itemsMatch) {
    return { fail: 'Your uploaded files have the wrong names. Did you specify the correct path?' }
  }
}

const code = `const run = async (files) => {
  for (let file of files) {
    // Your code to add one file to MFS goes here
  }
}

return run
`

const solution = `const run = async (files) => {
  for (let file of files) {
    await ipfs.files.write('/' + file.name, file, { create: true })
  }
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
