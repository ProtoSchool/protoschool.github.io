<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    lessonTitle="REPLACEME" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './REPLACEME.md'
import exercise from './REPLACEME-exercise.md'

const validate = async (result, ipfs) => {
  if (result === 'foo') {
    return { success: 'Happy Message!' }
  } else if (result === 'bar') {
    return {
      success: 'Another Happy Message!',
      // If you want to add an additional step for the user to check some data,
      // add following keys (it can be either on `succes` or `fail`):
      logDesc: 'Random description.', // [optional] A description below the step title.
      log: 'Random data.' // The data you want the user to see.
    }
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

const code = `const CID = require('cids')

const run = async () => {
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
    return { text, validate, code, modules }
  }
}
</script>
