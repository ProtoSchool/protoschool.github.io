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
      fail: 'The array you returned has more items than the number of files you uploaded, did you add something in the array twice.'
    }
  }

  if (result.length < uploadedFiles.length) {
    return {
      fail: 'The array you returned has less items than the number of files you uploaded, maybe you forgot to put one of the results in the array.'
    }
  }

  for (const resultData of result) {
    if (!resultData.hash) {
      return {
        fail: 'The value you returned is incorrect :( Are you sure you are returning the result of the ipfs.add operation?'
      }
    }

    try {
      const lsResult = await pTimeout(ipfs.ls(resultData.hash), 2000)
      if (resultData.hash !== lsResult[0].hash) {
        return {
          fail: 'The value you returned is incorrect :( Are you sure you are returning an array of the results of the ipfs.add operations?'
        }
      }
    } catch (err) {
      return {
        fail: 'The value you returned is incorrect :( One of the `CIDs` in the array you returned does not match any file in your IPFS node'
      }
    }
  }

  const fileText = result.length > 1 ? `these files` : 'this file'
  const valueText = result.length > 1 ? `values` : 'value'
  const thatText = result.length > 1 ? `them` : 'it'

  return {
    success: 'Success! You did it!',
    logDesc: 'Your `add` command returned the array of objects below. Notice in particular the `hash` ' + valueText + ", since we'll need " + thatText + ' to access ' + fileText + ' again later. The `path` matches the `hash` for ' + fileText + ", but we'll see in future lessons that that's not always true.",
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
