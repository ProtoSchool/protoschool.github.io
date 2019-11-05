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
  const bufferedContents = // access the content of the file as a buffer

  // we've taken care of converting the buffer to a string in the return statement below
  
  return bufferedContents.toString()

}
return run
`

const solution = `/* global ipfs */
const run = async () => {

  // You can access the file in two different ways with the CIDs we gave you

  // Using the root CID and file path relative to root
  const bufferedContents = await ipfs.cat("/ipfs/QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy/fun/success.txt")

  // Using the subdirectory CID and file path relative to the dir subdirectory
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
        fail: "Oops, we could not find a file with that IPFS path. Are you sure you are using the correct path with the correct `CID`? Remember, if you use the wraping directory's `CID`, you need to append `/fun/success.txt` to the path name. Otherwise, if you're using the `fun` subdirectory `CID`, you need to append `/success.txt` to the path name."
      }
    }
    if (result.error.toString().includes('multihash unknown function code')) {
      return {
        fail: 'The `CID` you used in the IPFS path for the `cat` method is not valid. Make sure you are using one of the `CID`s we provided.'
      }
    } else {
      return { error: result.error }
    }
  }

  if (typeof result !== 'string') {
    // this condition is too broad as it catches more than just returned the correct buffered contents of the file
    return {
      fail: "Oops, don't forget that the value you're returning should be a string!"
    }
  }

  if (result === 'You did it!') {
    return {
      success: 'Success!',
      logDesc: 'Here is the message you read from `success.txt` using `cat`:',
      log: result
    }
  } else {
    return { fail: "Something we haven't anticipated is wrong. :(" }
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
