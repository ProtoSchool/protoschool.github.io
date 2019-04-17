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
    By default, if any external error occurs (such as errors flagged by the
    IPFS API or syntax errors caught by our embedded code editor), its output
    will be shown. If you want to catch specific errors and override them to 
    display a more user-friendly error message, add the attribute
    `:overrideErrors="true"` to the Lesson component at the start of this
    file like so:

    <Lesson
       :overrideErrors="true"
       ...
    />

    Within this `validate` function, add cases for the specific error messages
    you need to override, as in this example:

    } else if (result && result.error.message === 'No child name passed to addLink') {
      // Forgot the file name and just used a directory as the path
      return { fail: 'Uh oh. It looks like you created a folder instead of a file. Did you forget to include a filename in your path?' }
    }

    You'll also need to add the following lines below your custom validation to
    allow external error messages you haven't specifically overridden to be presented
    to the user to aid in troubleshooting:

    // Output the default error if we haven't caught any
    return { error: result.error }

    Note that most tutorial lessons will not require the overriding of external
    errors. If you have questions about whether to use this feature, please reach
    out to the project maintainers for guidance.
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
