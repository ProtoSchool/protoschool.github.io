<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    lessonTitle="REPLACEME" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import Lesson from '../../components/Lesson'
import text from './REPLACEME.md'
import exercise from './REPLACEME-exercise.md'

const validate = async (result, ipfs) => {
  if (result) {
    return { success: 'Happy Message!' }
  } else {
    return { fail: 'Sad but useful message :(' }
  }

  /*
    By default, if any external error occurs its output will be shown.
    If you want to catch those erros and override them to show something
    else to the users, add the following attribute in the FileLesson component:

    <FileLesson :overrideErrors="true" ... />

    Here in the `validate` function, add the folowing lines below the validation
    if you enabled the overriding of errors:

    // Output the default error if we haven't catched any
    return { error: result.error }
  */
}

const code = `const run = async (files) => {
  /* your code here */
}
return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text, validate, code, modules, exercise }
  }
}
</script>
