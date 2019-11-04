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
  let result = // your code here

  return result
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

const testResult = '[{"hash":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy","path":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy","name":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy","depth":1,"size":0,"type":"dir"},{"hash":"QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r","path":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/fun","name":"fun","depth":2,"size":0,"type":"dir"},{"hash":"QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ","path":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/fun/success.txt","name":"success.txt","depth":3,"size":11,"type":"file","content":{"type":"Buffer","data":[89,111,117,32,100,105,100,32,105,116,33]}},{"hash":"QmQDHitBegfht9eKo7ZJ7S3haq1QVAysjUZg8tmYdPJmSx","path":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/shrug.txt","name":"shrug.txt","depth":2,"size":13,"type":"file","content":{"type":"Buffer","data":[194,175,92,95,40,227,131,132,41,95,47,194,175]}},{"hash":"Qmbfrc4cF2X4KXbHuqD593SLnR2xj6hULYTnrj65wKWaKm","path":"QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/smile.txt","name":"smile.txt","depth":2,"size":2,"type":"file","content":{"type":"Buffer","data":[58,41]}}]'

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
      fail: 'The return value should be an array identical to the one returned by the `get` function.'
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
      fail: 'The returned value does not match the structure of the typical output of the `get` function. Did you accidentally use a method other than `get`?'
    }
  }

  if (JSON.stringify(result) !== testResult) {
    // is this one still valid?? look like it's from when you were having them convert file contexts
    return {
      fail: 'The data returned does not match what we expect. Did you forget to convert the `content` values from `Buffer` to string?'
    }
  }

  return {
    success: "Congratulations! You've completed this series of lessons!",
    logDesc: 'Below is the result of calling the `get` method on the root directory. (Normally the results would be much more dense because of the buffered file contents included, but we intentionally created tiny text files to limit this effect.)' +
              "\n\n Notice that because we created these files using `{ wrapWithDirectory: true }`, each item's `path` is defined here by the root directory's CID plus the item's relative path, and each file or subdirectory has a human-readable `name`. Only the root directory itself has a `path` value that matches its `hash` and `name`, all of which are identical CIDs.",
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
