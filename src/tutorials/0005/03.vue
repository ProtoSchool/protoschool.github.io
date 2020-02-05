<template>
  <FileLesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"/>
</template>

<script>
import FileLesson from '../../components/FileLesson'
import text from './03.md'
import exercise from './03-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {
  const result = // Place your code to add a file or files here

  return result
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  const result = await ipfs.add(files)

  return result
}
return run
`

const validate = async (result, ipfs) => {
  const uploadedFiles = window.uploadedFiles || false

  const expectedResult = await ipfs.add(window.uploadedFiles)

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
      fail: 'The returned value should be an array.'
    }
  }

  if (result.length > uploadedFiles.length) {
    return {
      fail: 'The array you returned has more items than the number of files you uploaded. Be sure to add each file to IPFS just once, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  if (result.length < uploadedFiles.length) {
    return {
      fail: 'The array you returned has fewer items than the number of files you uploaded. Be sure to add each file to IPFS, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  const fileText = result.length > 1 ? `these files` : 'this file'
  const valueText = result.length > 1 ? `values` : 'value'
  const thatText = result.length > 1 ? `them` : 'it'

  if (JSON.stringify(expectedResult) === JSON.stringify(result)) {
    return {
      success: 'Success! You did it!',
      logDesc: 'Your `add` command returned the array of objects below. Notice in particular the `hash` ' + valueText + ", since we'll need " + thatText + ' to access ' + fileText + ' again later. The `path` matches the `hash` for ' + fileText + ", but we'll see in future lessons that that's not always true.",
      log: result
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
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
