<template>
  <div class="lesson-01">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Title of first file lesson">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './01.md'
import exercise from './01-exercise.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'You successfully uploaded a file! Be sure to check out your console in the inspector.'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

const code = `const run = async (files) => {
  /* your code here */
  return files
}
return run
`

const modules = {cids: require('cids')}

export default {
  components: {
    FileLesson
  },
  data: () => {
    return {
      text, validate, code, modules, exercise
    }
  }
}
</script>
