<template>
  <div class="lesson-02">
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Adding files to the Mutable File System (MFS)">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './04.md'
import exercise from './04-exercise.md'

const validate = async (result, ipfs) => {

  // The code in this exercise does not have a return value since write doesn't
  // give anything back, so `result` should always be undefined and is irrelevant
  // for validation. Validation will be done by matching filenames between the
  // uploadedFiles array and the files in IPFS and ensuring that the type of each
  // file in IPFS is 0 (file, not folder).

  let uploadedFiles = window.uploadedFiles || false

  let ipfsFiles = await ipfs.files.ls('/', {long: true})
  console.log('Here\'s what\'s now in your root directory in IPFS:')
  console.log(ipfsFiles)

  let uploadedFilenames = uploadedFiles.map( file => file.name.toString() ).sort()
  let ipfsFilenames = ipfsFiles.map( file => file.name.toString() ).sort()
  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = ipfsFiles.every(file => file.type === 0)

  if (uploadedFiles = false) {
    // shouldn't happen because you can't hit submit without uploading files
    return {'fail': 'Oops! You forgot to upload files to work with :('}
  } else if (ipfsFiles.length === 0) {
    // if somehow no files are written to IPFS
    return {'fail': 'Uh oh. Looks like no files made it into IPFS.'}
  } else if (!itemsAreFiles) {
    // if they forget the file name and just use a directory as the path
    // this never shows because there's a native error msg showing that's unclear
    return {'fail': 'Uh oh. It looks like you created a folder instead of a file. Did you forget to include a filename in your path?'}
  } else if (itemsMatch && itemsAreFiles) {
    return {'success': 'Success! Open your console to see what data is now in your root directory in IPFS.'}
  } else {
    return {'fail': 'Something we haven\'t anticipated is wrong. :('}
  }

  // also wanted to make a custom error for if they forget {create: true}
  // but it also has a native error msg showing that's unclear
}

//blah



const code = `const run = async (files) => {
  for (let file of files) {
    // your code to add one file to MFS goes here
  }
}
return run
`

const _solution = `const run = async (files) => {
  for (let file of files) {
    await ipfs.files.write('/' + file.name, file, {create: true})
  }
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
