<template>
  <div class="lesson-REPLACEME">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="REPLACEME">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import Lesson from '../components/Lesson'
import text from './REPLACEME.md'
import exercise from './REPLACEME-exercise.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'Happy Message!'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

const code = `const CID = require('cids')

const run = async () => {
  /* your code here */
}
return run
`

const modules = {cids: require('cids')}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      text, validate, code, modules
    }
  }
}
</script>
