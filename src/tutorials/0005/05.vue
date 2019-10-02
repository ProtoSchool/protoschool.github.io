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
import text from './05.md'
import exercise from './05-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {
  const filesWithPath = files.map((elem, idx) => { return { content: elem, path: \`/dir/\${elem.name}\` }})
  const addedFiles = await ipfs.add(filesWithPath, {wrapWithDirectory: true})
  const pathCID = addedFiles.find((elem) => elem.path==="dir").hash
  // Only edit code bellow this point

  let result = // write your code here

  return result
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  const filesWithPath = files.map((elem, idx) => { return { content: elem, path: \`/dir/\${elem.name}\` }})
  const addedFiles = await ipfs.add(filesWithPath, {wrapWithDirectory: true})
  const pathCID = addedFiles.find((elem) => elem.path==="dir").hash
  // Only edit code bellow this point

  let result = await ipfs.ls()

  return result
}
return run
`

const validate = async (result, ipfs) => {
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only

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
        fail: "The `CID` provided to `ipfs.ls` is incorrect. Make sure you're using the `pathCID` variable we provided"
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
      fail: 'The number of uploaded files is different from the number of files on the `dir` directory. Make sure you are using the correct `CID` and not changing the preset code block.'
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
      fail: 'The returned value does not match the structure of the typical output of the `ls` function. Are you sure your are returning the result of the `ls` function?'
    }
  }

  return {
    success: 'Success!',
    logDesc: 'Here are the contents of the `dir` directory.',
    log: result
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
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
