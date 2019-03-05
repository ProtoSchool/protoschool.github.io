<template>
  <div class="lesson-02">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Working with files in IPFS">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './01.md'
import exercise from './01-exercise.md'

const validate = async (result, ipfs) => {
console.log('code is ', code)
console.log('this is:  ', this)

  if (!code.includes('return files.length')) {
    return {'fail': 'Looks like you forgot to return `files.length`. Please try again.'}
  } else if (result === undefined) {
    return {'fail': 'Looks like you forgot to upload a file. Please try again.'}
  } else if (!code.includes('console.log(files)')) {
    return {'fail': 'Looks like you forgot to add that console log. Please try again.'}
  } else if (result === 1) {
    return {'success': 'You successfully uploaded a file! Be sure to check out your console in the inspector to see the data we have about the uploaded file.'}
  } else if (result > 1) {
    return {'success': 'You successfully uploaded ${result} files! Be sure to check out your console in the inspector.'}
  } else if (result === 0) {
    return {'fail': 'Looks like you forgot to upload a file (result is 0). Please try again.'}
  } else {
    return {'fail': 'Something else is wrong.'}
  }
}

const code = `const run = async (files) => {
  /* your code here */
  return files.length
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
