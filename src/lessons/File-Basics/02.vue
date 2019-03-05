<template>
  <div class="lesson-02">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Adding a file to IPFS">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './02.md'
import exercise from './02-exercise.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'You successfully uploaded a file! Be sure to check out your console in the inspector.'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

const code = `const run = async (files) => {
  /* your code here */
  let uploaded = []
  for (let file of files) {
    uploaded.push(await ipfs.files.add(file))
  }
  return uploaded
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
