import { logFiles } from '../../utils/files'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'Looks like you forgot to return a result. Did you forget to remove the `//` before `return files`?' }
  } else if (typeof result.length === 'number') {
    const fileCount = result.length > 1 ? `${result.length} files` : '1 file'
    return {
      success: `You successfully uploaded ${fileCount}!`,
      logDesc: "Check out the data below to see the data now accessible in the `files` array. Note that these files are only in the browser right now. In the next lesson we'll see how to add them to IPFS.",
      log: logFiles(result)
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
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

const modules = { cids: require('cids') }

const options = {
  type: 'file-upload'
}

export default {
  validate,
  code,
  solution,
  modules,
  options
}
