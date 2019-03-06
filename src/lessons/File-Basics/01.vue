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
  console.log('user submitted code')
  console.log('result is: ', result)
  console.log('typeof result is: ', typeof result)
  if (!result || typeof result === 'undefined') {
    console.log('undefined fail message should appear')
    return {'fail': "Looks like you forgot to return a result. Remember to remove the '//' on Line 5."}
  } else if (typeof result === 'number') {
    console.log('number success message should appear')
    let fileCount = "1 file"
    if (result > 1) {
      fileCount = `${result} files`
    }
    return {'success': `You successfully uploaded ${fileCount}! ` + 'Check out your console in the inspector to see the `files` array your browser now has access to.'}
  } else {
    return {'fail': 'Something else is wrong.'}
  }
}

const code = `const run = async (files) => {
  console.log(files)
  console.log(files.length)
  /* remove the '//' on the line below to complete this challenge */
  // return files.length
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
