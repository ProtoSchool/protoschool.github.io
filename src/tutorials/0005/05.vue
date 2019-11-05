<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution" />
</template>

<script>
import pTimeout from 'p-timeout'
import FileLesson from '../../components/FileLesson'
import text from './05.md'
import exercise from './05-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {

  let fileObjectsArray = // build your array of {content, path} objects here

  return // add the files to IPFS here, returning the result

}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {

  // You can do this exercise using the Array.map method:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

  let fileObjectsArray = files.map((file) => {
    return {
      path: file.name,
      content: file
    }
  })

  // Alternatively, you could use a forEach
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  //
  // let fileObjectsArray = []
  //
  // files.forEach((file) => {
  //   let fileObject = {
  //     path: file.name,
  //     content: file
  //   }
  //
  //   fileObjectsArray.push(fileObject)
  // })

  const results = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })

  return results

}
return run
`

const validate = async (result, ipfs) => {
  let uploadedFiles = window.uploadedFiles || false
  let fileObjectsArray = window.uploadedFiles.map((file) => {
    return {
      path: file.name,
      content: file
    }
  })
  const expectedResults = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    return { error: result.error }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The returned value should be an arrray.'
    }
  }

  if (uploadedFiles.length === result.length) {
    return {
      fail: "We can't find a directory in your results. Did you remember to set the `wrapWithDirectory` option to true?"
    }
  }

  if (uploadedFiles.length !== result.length - 1) {
    return {
      fail: "The resulting array seems to be wrong. You should have one element per file, plus another for the top-level directory. Maybe you created an extra subdirectory with one of the files' path name?"
    }
  }

  const resultingFiles = await pTimeout(ipfs.ls(result[result.length - 1].hash), 2000).catch(() => 'error')
  if (resultingFiles === 'error') {
    return {
      fail: 'Could not get CID of top-level directory'
    }
  } else {
    if (resultingFiles.length === 1) {
      return {
        fail: 'The last entry in your results correspond to a directory. Did you forget to use `wrapWithDirectory`.'
      }
    }
    if (resultingFiles.length !== uploadedFiles.length) {
      return {
        fail: "The number of uploaded files doesn't match the number of files on your IPFS node. Did you add every file you uploaded to IPFS? Did you make sure each file had a unique name when defining its path? Did you create any more directories than you needed to?"
      }
    }
  }

  if (JSON.stringify(result) === JSON.stringify(expectedResults)) {
    return {
      success: 'Success!',
      logDesc: "Here are the results returned by the `add` method.  Note that you have one object for each file, plus one for each directory created by the `{ wrapWithDirectory: true }` option (in this case, just the top-level directory with path `''`)." +
                "\n\n Because you used the `{ wrapWithDirectory: true }` option, the `path` of each file is now the filename you provided, rather than matching the file's `hash`.  You'll be able to use these human-readable paths to in combination with the directory's CID to access the file's content in a future lesson." +
                "\n\n We only have access to the added files' and directories' CIDs when the `add` method returns them. When you use this method in the future, you may want to save them for later use.",
      log: result
    }
  } else {
    return { fail: "Something we haven't anticipated is wrong. :(" }
  }
}

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: () => {
    return {
      text,
      exercise,
      code,
      solution,
      validate,
      modules
    }
  }
}
</script>
