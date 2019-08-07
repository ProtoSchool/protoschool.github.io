<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Antoher file upload lesson">
  </FileLesson>
</template>

<script>
import FileLesson from '../../components/FileLesson.vue'
import text from './08.md'
import exercise from './08-exercise.md'
import { logFiles } from '../../utils/files'

const validate = async (result, ipfs) => {
  if (!result || typeof result.length === 'undefined') {
    return { fail: 'Looks like you forgot to return a result. Did you forget to remove the `//` before `return files`?' }
  } else if (typeof result.length === 'number') {
    const fileCount = result.length > 1 ? `${result.length} files` : '1 file'
    return {
      success: `You successfully uploaded ${fileCount}!`,
      logDesc: "Check out the data below to see the data now accessible in the `files` array. Note that these files are only in the browser right now. In the next lesson we'll see how to add them to IPFS.",
      log: logFiles(result)
    }
  } else {
    return { fail: 'Something is wrong. Reset the code and see the instructions.' }
  }
}

const code = `const run = async (files) => {
  /* remove the '//' on the line below to complete this challenge */
  // return files
}
return run
`

const solution = `const run = async (files) => {
  return files
}

return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: () => {
    return { text, validate, code, modules, exercise, solution }
  }
}
</script>
