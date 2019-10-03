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
import text from './02.md'
import exercise from './02-exercise.md'

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
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only

  const uploadedFiles = window.uploadedFiles || false

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.length > uploadedFiles.length) {
    return {
      fail: 'The array you returned has more items than the number of files you uploaded, did you add something in the array twice.'
    }
  }

  if (result.length < uploadedFiles.length) {
    return {
      fail: 'The array you returned has less items than the number of files you uploaded, maybe you forgot to put one of the results in the array.'
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

  for (const resultData of result) {
    if (!resultData.hash) {
      return {
        fail: 'The value you returned is incorrect :( Are you sure you are returning the result of the ipfs.add operation?'
      }
    }

    const lsResult = await pTimeout(ipfs.ls(resultData.hash), 2000).catch(() => 'error')
    if (lsResult === 'error' || resultData.hash !== lsResult[0].hash) {
      return {
        fail: 'The value you returned is incorrect :( Are you sure you are returning an array of the results of the ipfs.add operations?'
      }
    }
  }

  return {
    success: 'Success! You did it!',
    logDesc: "Here's the result of adding the files to your IPFS node",
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
