<template>
  <div>
    <FileLesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            :solution="solution"
            :overrideErrors="true"
            lessonTitle="Create a directory">
    </FileLesson>
  </div>
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './07.md'
import exercise from './07-exercise.md'

const validate = async (result, ipfs) => {

  let ipfsFiles = await ipfs.files.ls('/', { long: true })
  let log = JSON.stringify(ipfsFiles, null, 2)


  console.log("result: ", result)

  console.log("result.error: ", result.error)
  if (result.error) {
    console.log("result.error.message: ", result.error.message)
  }

  // let returnedArray = await ipfs.files.ls('/', {long: true})
// let directoryContentsMatch = JSON.stringify(result) === JSON.stringify(expected)

  /***** CHECK FOR CORRECT DIRECTORY ******/

  // correct directory hash
  const someStuffHash = 'QmVneuc3suf78aVdvFY3BW9HoiEfNxD7WB5zu1f9fbun3D' // /some/stuff/

  // common incorrect directory hashes
  const emptyDirectoryHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn' // empty /some/ OR /stuff/ directory
  const stuffSomeHash = 'QmXHDGVf4VnHws1tNyEcyVKjHrtv927xceAG9RmBWMw8cf' // /stuff/some/

  // check whether array contains certain directory hash & certain directory name
  function contains(certainHash, certainName) {
    if (!result.error) {
      return result.some(file => (file.hash === certainHash) && (file.name === certainName))
    }
  }

  console.log('CORRECT contains(someStuffHash, "some"): ', contains(someStuffHash, 'some'))
  console.log('WRONG contains(emptyDirectoryHash, "some"): ', contains(emptyDirectoryHash, 'some'))
  console.log('WRONG contains(emptyDirectoryHash, "stuff"): ', contains(emptyDirectoryHash, 'stuff'))
  console.log('WRONG contains(stuffSomeHash, "stuff"): ', contains(stuffSomeHash, 'stuff'))


  /****** CHECK FOR CORRECT FILENAMES *****/

  // expected filenames
  let uploadedFiles = window.uploadedFiles || false
  if (uploadedFiles) {
    console.log('uploaded files: ', uploadedFiles)
    let expected = uploadedFiles.map( file => file.name.toString() )
    console.log('expected: ', expected)
    console.log(Array.isArray(expected))
    expected.push('some')
    console.log(expected)
    let expectedSorted = expected.sort()
    console.log(expectedSorted)
  } else {
    console.log('no files uploaded')
  }

  //let ipfsFilenames = expected.map( file => { file.name.toString() ).sort()
//  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
//  let itemsAreFiles = expected.every(file => file.type === 0)
//  let rightFilesUploaded = itemsMatch && itemsAreFiles

  if (!result) {
    return {fail: 'Oops, you forgot to return a result. Did you accidentally delete `return directoryContents`?'}
  } else if (result && result.error && result.error.message === 'file does not exist') {
    // user forgot to use {parents: true} option so path isn't found
    return { fail: 'The path to the directory you\'re trying to create can\'t be found. Did you forget to use the \{ parents: true \} option?'}
  } else if (uploadedFiles = false) {
    // shouldn't happen because you can't hit submit without uploading files
    return {fail: 'Oops! You forgot to upload files to work with :('}
  //} else if (expected.length === 0) {
    // if no files are written to IPFS because they change the default code
//    return {fail: 'Uh oh. Looks like no files made it into IPFS. Did you accidentally edit the default `write` code?'}
  } else if (result[0].hash.length === 0) {
    return {fail: 'Oops! Looks like you forgot to use the {long: true} option! Open your console to see what happened.'}
  } else if (contains(emptyDirectoryHash, 'some')) {
    return { fail: 'Uh oh. Looks like you created /some instead of /some/stuff.' }
  } else if (contains(stuffSomeHash, 'stuff')) {
    return { fail: 'Uh oh. Looks like you created /stuff/some instead of /some/stuff.' }
  } else if (contains(emptyDirectoryHash, 'stuff')) {
    return { fail: 'Uh oh. Looks like you created /stuff instead of /some/stuff.' }

  } else if (!contains(someStuffHash, 'some')) {
    return { fail: 'Uh oh. Looks like your directory doesn\'t contain an empty /some/stuff/ directory' }
  } else if (contains(someStuffHash, 'some')){
    return {
      success: 'Success! Check out your directory contents below.',
      logDesc: "Here's what was returned by `ls` in your root directory. Notice how directories have a type of 1 while files have a type of 0.",
      log: log
      }
  } else {
    return {fail: 'Something we haven\'t anticipated is wrong. :('}
  }
}

const code = `const run = async (files) => {
  // this code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  // add your code to create a new directory here
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})
  return rootDirectoryContents
}
return run
`
// '/' in the solution code below is optional

const solution = `const run = async (files) => {
  // this code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})
  return rootDirectoryContents
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
