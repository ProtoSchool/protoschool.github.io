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

const code = `const run = async () => {
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
