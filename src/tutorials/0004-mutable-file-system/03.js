import { logFiles } from '../../utils/files'

const validate = async (result, ipfs) => {
  if (!result || typeof result.length === 'undefined') {
    return { fail: 'Looks like you forgot to return a result. Did you forget to remove the `//` before `return files`?' }
  } else if (typeof result.length === 'number') {
    const fileCount = result.length > 1 ? `${result.length} files` : '1 file'
    return {
      success: `You successfully uploaded ${fileCount}!`,
      logDesc: "Check out the data below to see the data now accessible in the `files` array. Note that these files are only in the browser right now. In the next lesson we'll see how to add them to IPFS.",
      log: logFiles(result)
    }
  }
}

const code = `const run = async (files) => {
  /* remove the '//' on the line below to complete this challenge */
  // return files
}
return run
`

const solution = `const run = async (files) => {
  return files
}

return run
`

export default {
  validate,
  code,
  solution
}
