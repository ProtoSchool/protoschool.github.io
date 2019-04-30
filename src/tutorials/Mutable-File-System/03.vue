<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Working with files in ProtoSchool">
  </FileLesson>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './03.md'
import exercise from './03-exercise.md'

const validate = async (result, ipfs) => {
  if (!result || typeof result.length === 'undefined') {
    return { fail: `Looks like you forgot to return a result. Did you forget to remove the "//" before "return files"?` }
  } else if (typeof result.length === 'number') {
    const fileCount = result.length > 1 ? `${result.length} files` : '1 file'
    const filesArray = []
    const files = result
    for (var i = 0; i < files.length; i++){
      var file = {
          'lastModified': files[i].lastModified,
          'lastModifiedDate': files[i].lastModifiedDate,
          'name': files[i].name,
          'size': files[i].size,
          'type': files[i].type,
          'webkitRelativePath':  files[i].webkitRelativePath
      }
      filesArray.push(file)
    }
    const log = JSON.stringify(filesArray, null, 2)
    return {
      success: `You successfully uploaded ${fileCount}!`,
      logDesc: `Check out the data below to see the data now accessible in the "files" array.`,
      log: log
    }
  } else {
    return { fail: 'Something is wrong. Reset the code and see the instructions.' }
  }
}

const code = `const run = async (files) => {
  console.log(files)
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
    return { text, validate, code, modules, exercise, solution  }
  }
}
</script>
