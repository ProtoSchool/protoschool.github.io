<template>
  <FileLesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution" />
</template>

<script>
import FileLesson from '../../components/FileLesson'
import text from './REPLACEME.md'
import exercise from './REPLACEME-exercise.md'

const validate = async (result, ipfs) => {
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only
  let uploadedFiles = window.uploadedFiles

  if (!uploadedFiles) {
    return { fail: 'You need to upload some files first' }
  }
  if (result) {
    return { success: 'Happy Message!' }
  } else {
    return { fail: 'Sad but useful message :(' }
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const code = `/* global ipfs */
  const run = async (files) => {
  // Your code here
}
return run
`

const solution = `/* global ipfs */
  const run = async (files) => {
  // Your solution here
}
return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      validate,
      code,
      modules,
      exercise,
      solution
    }
  }
}
</script>
