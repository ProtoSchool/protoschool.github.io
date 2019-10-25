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
  const bufferedContents = // access the content of the file

  const textContents = // convert the Buffer to a string

  return textContents // return the text contained in the file

}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  const bufferedContents = await ipfs.cat("QmbDyYL9SaWD2pYvN6JmGwetcDgzr466Z3WjigDmndZ6ea/success.txt")

  const textContents = bufferedContents.toString('utf-8')

  return textContents
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
      fail: "Oops! Don't forget to convert the file's contents to a string."
    }
  }

  if (result !== 'You did it!') {
    return {
      fail: "Uh oh. The string you returned doesn't match the contents of the file! Did you use as your path the directory's CID followed by the filename? Are you returning the results of the `cat` method converted to a string."
    }
  }

  return {
    success: 'Success!',
    logDesc: 'Here is the message you read from `success.txt` using `cat`:',
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
