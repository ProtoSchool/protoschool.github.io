<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
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
  const bufferedContents = // access the content of the file as a buffer

  // we've taken care of converting the buffer to a string in the return statement below

  return bufferedContents.toString()

}
return run
`

const solution = `/* global ipfs */
const run = async () => {

  // You can access the file in two different ways with the CIDs we gave you

  // Using the CID of the top-level directory and file path relative to it:
  const bufferedContents = await ipfs.cat("/ipfs/QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/fun/success.txt")

  // Using the dir subdirectory CID and file path relative to it:
  // const bufferedContents = await ipfs.cat("/ipfs/QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r/success.txt")

  return bufferedContents.toString('utf-8')
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
    if (result.error.toString().includes('file does not exist')) {
      return {
        fail: "Oops, we could not find a file with that IPFS path. Are you sure you're using the correct path with the correct CID? Remember, if you use the wrapping directory's CID, you need to append `/fun/success.txt` to the path name. Otherwise, if you're using the `fun` subdirectory's CID', you need to append `/success.txt`."
      }
    }
    if (result.error.toString().includes('this dag node is a directory')) {
      return {
        fail: 'The `cat` method only works on files, but you tried to use it on a directory. Did you forget to include the relative file path?'
      }
    }
    if (result.error.toString().includes('multihash unknown function code')) {
      return {
        fail: 'The CID you used in the IPFS path for the `cat` method is not valid. Make sure you are using one of the CIDs we provided.'
      }
    } else {
      return { error: result.error }
    }
  }

  if (Object.prototype.toString.call(result) === '[object Uint8Array]') {
    let isEqual = (new TextEncoder()).encode('You did it!').every((elem, idx) => {
      return elem === result[idx]
    })
    if (isEqual) {
      return {
        fail: "Oops, don't forget to return a string! We included `.toString()` for you in the starter code. Did you remove it?"
      }
    }
  }

  if (result === 'You did it!') {
    return {
      success: 'Success!',
      logDesc: 'Here is the message you read from `success.txt` using `cat`:',
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
