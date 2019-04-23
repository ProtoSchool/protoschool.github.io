<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    lessonTitle="Working with files in ProtoSchool">
  </FileLesson>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './02.md'
import exercise from './02-exercise.md'

const validate = async (result, ipfs) => {
  if (!result || typeof result === 'undefined') {
    return { fail: "Looks like you forgot to return a result. Remember to remove the '//' on Line 5." }
  } else if (typeof result === 'number') {
    const fileCount = result > 1 ? `${result} files` : '1 file'
    return { success: `You successfully uploaded ${fileCount}! Check out your console in the inspector. The last entry there is the \`files\` array your browser now has access to. Click the triangle to expand its contents and see what fields are included.` }
  } else {
    return { fail: 'Something is wrong. Reset the code and see the instructions.' }
  }
}

const code = `const run = async (files) => {
  console.log(files)
  /* remove the '//' on the line below to complete this challenge */
  // return files.length
}
return run
`

const solution = `const run = async (files) => {
  console.log(files)
  return files.length
}
return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: () => {
    return { text, validate, code, modules, exercise }
  }
}
</script>
