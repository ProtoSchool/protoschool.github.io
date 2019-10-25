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
  const fileObjectsArray = files.map((file, idx) => { return { path: file.name, content: file }})
  const addedFiles = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })
  const rootCID = addedFiles.find((file) => file.path==="").hash

  // only edit code below this point

  return // your code to list the contents of the root directory
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  const fileObjectsArray = files.map((file, idx) => { return { path: file.name, content: file }})
  const addedFiles = await ipfs.add(fileObjectsArray, { wrapWithDirectory: true })
  const rootCID = addedFiles.find((file) => file.path==="").hash

  return await ipfs.ls(rootCID)
}
return run
`

const validate = async (result, ipfs) => {
  let uploadedFiles = window.uploadedFiles || false

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    if (result.error.toString().includes("Cannot read property 'indexOf' of null") ||
        result.error.toString().includes('path.indexOf is not a function')) {
      return {
        fail: "The `CID` provided to `ipfs.ls` is incorrect. Make sure you're using the `rootCID` variable we provided."
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
      fail: "The number of uploaded files is different from the number of files in the root directory. Make sure you're using the correct `CID` and not changing the preset code block."
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

  return {
    success: 'Success!',
    logDesc: "Here are the results returned by the `ls` method for the root directory ( \"\" ). Notice that there are new fields here that we didn't see in the data returned by the `add` method.",
    log: result
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
