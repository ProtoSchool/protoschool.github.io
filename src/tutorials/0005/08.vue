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
import text from './08.md'
import exercise from './08-exercise.md'

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
  let result = await ipfs.get('QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk')

  return result
}
return run
`

const testResult = '[{"hash":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk","path":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk","name":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk","depth":1,"size":0,"type":"dir"},{"hash":"QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r","path":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk/dir","name":"dir","depth":2,"size":0,"type":"dir"},{"hash":"QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ","path":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk/dir/success.txt","name":"success.txt","depth":3,"size":11,"type":"file","content":{"type":"Buffer","data":[89,111,117,32,100,105,100,32,105,116,33]}},{"hash":"QmfDmsHTywy6L9Ne5RXsj5YumDedfBLMvCvmaxjBoe6w4d","path":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk/file1.txt","name":"file1.txt","depth":2,"size":1,"type":"file","content":{"type":"Buffer","data":[97]}},{"hash":"QmQLd9KEkw5eLKfr9VwfthiWbuqa9LXhRchWqD4kRPPWEf","path":"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk/file2.txt","name":"file2.txt","depth":2,"size":1,"type":"file","content":{"type":"Buffer","data":[98]}}]'

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
