<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :createTestFile="true" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './04.md'
import exercise from './04-exercise.md'

const code = `/* global ipfs */
const run = async () => {
  const fileContents = // place your code here

  // don't forget to return the string value
}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  const fileContents = await ipfs.cat('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')
  const message = fileContents.toString('utf8')

  return message
}
return run
`

const validate = async (result, ipfs) => {

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result === 'You did it!') {
    return {
      success: 'Success!',
      logDesc: "Here's the secret message hidden in that file (🤫): ",
      log: result
    }
  }

  // TODO : Add `else if` and `else` clauses with more validation options
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
