<template>
  <div>
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            :solution="solution"
            lessonTitle="Create a directory">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './05.md'
import exercise from './05-exercise.md'

const validate = async (result, ipfs) => {

  console.log('Here\'s what `files.ls` revealed in your directory:')
  console.log(result)

  let expected = await ipfs.files.ls('/', {long: true})
  let directoryContentsMatch = JSON.stringify(result) === JSON.stringify(expected)

  // confirm right files were added to IPFS (should be unless they tweaked defalt code)
  let uploadedFiles = window.uploadedFiles || false
  let uploadedFilenames = uploadedFiles.map( file => file.name.toString() ).sort()
  let ipfsFilenames = expected.map( file => file.name.toString() ).sort()
  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = expected.every(file => file.type === 0)
  let rightFilesUploaded = itemsMatch && itemsAreFiles

  if (!result) {
    return {'fail': 'Oops, you forgot to return a result. Did you accidentally delete `return directoryContents`?'}
  } else if (uploadedFiles = false) {
    // shouldn't happen because you can't hit submit without uploading files
    return {'fail': 'Oops! You forgot to upload files to work with :('}
  } else if (expected.length === 0) {
    // if no files are written to IPFS because they change the default code
    return {'fail': 'Uh oh. Looks like no files made it into IPFS. Did you accidentally edit the default `write` code?'}
  } else if (!itemsAreFiles) {
    // if they forget the file name and just use a directory as the path
    // shouldn't happen unless they mess with default code
    return {'fail': 'Uh oh. It looks like you created a folder instead of a file. Did you forget to include a filename in your path?'}
  } else if (!rightFilesUploaded) {
    return {'fail': 'Uh oh. Your files weren\'t added to IPFS correctly. Did you accidentally edit the default `write` code?'}
  } else if (result[0].hash.length === 0) {
    return {'fail': 'Oops! Looks like you forgot to use the {long: true} option! Open your console to see what happened.'}
  } else if (directoryContentsMatch) {
    return {'success': 'Success! Open your console to see the data returned by the `ls` method.'}
  } else {
    return {'fail': 'Something we haven\'t anticipated is wrong. :('}
  }
}

const code = `const run = async (files) => {
  // this code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  // add your code to create a new directory here
  let rootContents = await ipfs.files.ls('/', {long: true})
  return rootContents
}
return run
`
// '/' in the solution code below is optional

const solution = `const run = async (files) => {
  // this code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootContents = await ipfs.files.ls('/', {long: true})
  return rootContents
}
return run
`

const modules = {cids: require('cids')}

export default {
  components: {
    FileLesson
  },
  data: () => {
    return { text, validate, code, modules, exercise, solution }
  }
}
</script>
