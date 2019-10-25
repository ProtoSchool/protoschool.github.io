<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true"
    :createTestTree="true" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './07.md'
import exercise from './07-exercise.md'

const code = `/* global ipfs */
const run = async () => {
  const fileContents = // write your code here

  // don't forget to return a value
}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  const fileBufferContents = await ipfs.cat("QmbDyYL9SaWD2pYvN6JmGwetcDgzr466Z3WjigDmndZ6ea/success.txt")

  const fileMessage = fileBufferContents.toString('utf-8')

  return fileMessage
}
return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result. We are looking for the message in the file :('
    }
  }

  if (result.error) {
    return { error: result.error }
  }

  if (typeof result !== 'string') {
    return {
      fail: 'You should convert the message to a string before returning it.'
    }
  }

  if (result !== 'You did it!') {
    return {
      fail: 'Oops, the string you returned does not match the contents of the file! Make sure you are returning what you get from the `cat` method converted to a string'
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
