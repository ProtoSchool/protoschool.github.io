<template>
  <FileLesson
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
import FileLesson from '../../components/FileLesson'
import text from './03.md'
import exercise from './03-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {
  const uploadedFiles = []
  for(const file of files) {
    uploadedFiles.push(await ipfs.add(file))
  }

  let message = // place your code here

  return message
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  const uploadedFiles = []
  for(const file of files) {
    uploadedFiles.push(await ipfs.add(file))
  }
  
  let message = await ipfs.cat('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')
  message = message.toString('utf8')

  return message
}
return run
`

const validate = async (result, ipfs) => {
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result === 'You did it!') {
    return {
      success: 'Success!',
      logDesc: "Here's the message hidden in that secret file 🤫",
      log: result
    }
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
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
