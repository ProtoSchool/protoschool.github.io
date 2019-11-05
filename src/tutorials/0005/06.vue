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
import FileLesson from '../../components/FileLesson'
import text from './06.md'
import exercise from './06-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {
  const fileObjectsArray = files.map((file) => { return { path: file.name, content: file }})
  const addedFiles = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })
  const dirCID = addedFiles[addedFiles.length - 1].hash

  // only edit code below this point

  return // your code to list the contents of the top-level directory
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  const fileObjectsArray = files.map((file) => { return { path: file.name, content: file }})
  const addedFiles = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })
  const dirCID = addedFiles[addedFiles.length - 1].hash

  return await ipfs.ls(dirCID)
}
return run
`

const validate = async (result, ipfs) => {
  let uploadedFiles = window.uploadedFiles || false
  const fileObjectsArray = window.uploadedFiles.map((file) => { return { path: file.name, content: file } })
  const addedFiles = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })
  const dirCID = addedFiles[addedFiles.length - 1].hash

  const expectedResults = await ipfs.ls(dirCID)

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
        fail: "The `CID` provided to `ipfs.ls` is incorrect. Make sure you're using the `dirCID` variable we provided as an argument to `ipfs.ls`."
      }
    } else {
      return { error: result.error }
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The return value should be an array, just like the `ls` function returns. Make sure you are returning the correct value.'
    }
  }

  if (uploadedFiles.length !== result.length) {
    return {
      fail: "The number of uploaded files is different from the number of files in the top-level directory. Make sure you're using the correct `CID` and not changing the preset code block."
    }
  }

  let isStructureValid = result.every((elem) => {
    if (!elem.hash || typeof elem.hash !== 'string') return false
    if (!elem.path || typeof elem.path !== 'string') return false
    if (!elem.name || typeof elem.name !== 'string') return false
    if (!elem.depth || typeof elem.depth !== 'number') return false
    if (!elem.size || typeof elem.size !== 'number') return false
    if (!elem.type || typeof elem.type !== 'string') return false
    return true
  })

  if (!isStructureValid) {
    return {
      fail: "The returned value doesn't match the structure normally returned by `ls`. Are you sure you're returning the result of the `ls` function?"
    }
  }

  let rootIsFile = result.every((elem) => {
    if (elem.path === elem.name && elem.path === elem.hash) return true
    return false
  })

  if (rootIsFile) {
    return {
      fail: "You tried to use a file `CID` as an argument to the `ls` method. Please don't modify the boilerplate code. The wrapping directory should always be the last in the array resulting from the `add` method call."
    }
  }

  if (JSON.stringify(expectedResults) === JSON.stringify(result)) {
    return {
      success: 'Success!',
      logDesc: "Here are the results returned by the `ls` method for the top-level directory ( \"\" ). Notice that there are new fields here that we didn't see in the data returned by the `add` method. Also, take a look at how the `hash` and `path` values now differ. The `hash` for each file is the CID of the file itself, while the the `path` is the CID of the top-level directory followed by the filename.",
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
