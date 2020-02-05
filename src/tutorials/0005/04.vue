<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
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
  const message = fileContents.toString()

  return message
}
return run
`

const validate = async (result, ipfs) => {
  const correctMessage = 'You did it!'

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }
  if (result.error) {
    return { error: result.error }
  }
  if (typeof result !== 'string') {
    return {
      fail: 'Oh no... your result should be a string.'
    }
  }
  if (result === correctMessage) {
    return {
      success: 'Success!',
      logDesc: "Here's the secret message hidden in that file (🤫): ",
      log: result
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
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
