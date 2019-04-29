<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :overrideErrors="true"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Check the status of a directory" />
</template>

<script>
import Lesson from '../../components/Lesson.vue'
import text from './03.md'
import exercise from './03-exercise.md'

const validate = async (result, ipfs) => {

  const correctStat = await ipfs.files.stat('/')

  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (!!result) {
    return {
      success: 'Success! You did it!',
      logDesc: "Here's the result of your `stat`:",
      log: result
    }
  // Output the default error if we haven't caught any
  return { error: result.error }
}

const code = `/* global ipfs */
  const run = async () => {
    //your code goes here
}
return run
`

const solution = `/* global ipfs */
  const run = async () => {
    return await ipfs.files.stat('/')
}
return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text, validate, code, modules, exercise, solution }
  }
}
</script>
