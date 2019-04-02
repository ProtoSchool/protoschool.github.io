<template>
  <div class="lesson-02">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Adding a file using MFS">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './04.md'
import exercise from './04-exercise.md'

const validate = async (result, ipfs) => {

  const uploadedFiles = window.uploadedFiles || false
  console.log('uploadedFiles is: ', uploadedFiles)

  console.log('result is:')
  console.log(result)

  console.log('ipfs is: ')
  console.log(ipfs)

   console.log("ipfs.files.ls('/', {long: true}) is: ", ipfs.files.ls('/', {long: true}))
   console.log("await ipfs.files.ls('/', {long: true}) is: ", await ipfs.files.ls('/', {long: true}))
   console.log("attempting to loop through in ipfs.files.fs:")
   ipfs.files.ls('/', {long: true}, function (err, files) {
     files.forEach((file) => {
       console.log(file.name)
    })
  })

  if (!result) {
    return {'fail': 'You forgot to return a result. :('}
  } else if (result) {
      return {'success': 'You did something that might be right??'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

const code = `const run = async (files) => {
  let addedFiles = []
  for (let file of files) {
    addedFiles.push(/* your code here*/)
  }
  console.log(addedFiles)
  return addedFiles
}
return run
`

const _solution = `const run = async (files) => {
  let addedFiles = []
  for (let file of files) {
    addedFiles.push(await ipfs.files.write('/awesome', file, {create: true}))
  }
  return addedFiles
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
