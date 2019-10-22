<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :createTestTree="true" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './07.md'
import exercise from './07-exercise.md'

const code = `/* global ipfs */
const run = async () => {
  let result = // write your get code here

  // loop over the results to modify the content of the files in the result array here

  // don't forget to return the string value
}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  let filesAndDirectories = await ipfs.get('Qmeybqr2GaiUyGSRWX3dhS2Qz6VTVBXzBiYiFcKpYFJ7tH')

  let filesContents = []

  for( let item in filesAndDirectories ) {
    // If the item is a file, it has content
    if(item.content) {
      item.content = item.content.toString('utf-8')
    }

    filesContents.push(item)
  }

  // filesAndDirectories = filesAndDirectories.map((elem) => {
  //   if(elem.content) {
  //     elem.content = elem.content.toString('utf-8')
  //   }
  //   return elem
  // })

  return filesAndDirectories
}
return run
`

const testResult = '[{"path":"file3.txt","hash":"QmS4ejbuxt7JvN3oYyX85yVfsgRHMPrVzgxukXMvToK5td","size":9},{"path":"file2.txt","hash":"QmQLd9KEkw5eLKfr9VwfthiWbuqa9LXhRchWqD4kRPPWEf","size":9},{"path":"file1.txt","hash":"QmfDmsHTywy6L9Ne5RXsj5YumDedfBLMvCvmaxjBoe6w4d","size":9},{"path":"","hash":"Qmeybqr2GaiUyGSRWX3dhS2Qz6VTVBXzBiYiFcKpYFJ7tH","size":184}]'

const validate = async (result, ipfs) => {
  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    if (result.error.toString().includes("Cannot read property 'indexOf' of null") ||
        result.error.toString().includes('path.indexOf is not a function')) {
      return {
        fail: "The `CID` provided to `ipfs.get` is incorrect. Make sure you're using the `CID` we provided"
      }
    } else {
      return { error: result.error }
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The return value should be an array, just like the `get` function returns. Make sure you are returning the correct value.'
    }
  }

  let isStructureValid = result.every((elem) => {
    if (elem.hash === undefined || typeof elem.hash !== 'string') return false
    if (elem.path === undefined || typeof elem.path !== 'string') return false
    if (elem.name === undefined || typeof elem.name !== 'string') return false
    if (elem.depth === undefined || typeof elem.depth !== 'number') return false
    if (elem.size === undefined || typeof elem.size !== 'number') return false
    if (elem.type === undefined || typeof elem.type !== 'string') return false
    return true
  })

  if (!isStructureValid) {
    return {
      fail: 'The returned value does not match the structure of the typical output of the `get` function. Are you sure your are returning the result of the `get` function?'
    }
  }

  if (JSON.stringify(result) !== testResult) {
    return {
      fail: 'The data returned does not match what we expect. Did you forget to convert the `content` values from `Buffer` to string?'
    }
  }

  return {
    success: 'Success!',
    logDesc: 'Here is the result of calling the `get` method with the `CID` of the `dir` directory.',
    log: result
  }
}

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
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
