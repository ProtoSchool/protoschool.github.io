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

  let stringifiedResult = JSON.stringify(result, null, 2)

  /***** CHECK FOR DOING LS ON SOMETHING OTHER THAN ROOT ******/

  let ipfsFilesInRoot = await ipfs.files.ls('/', { long: true })
  let listedRoot = stringifiedResult === JSON.stringify(ipfsFilesInRoot, null, 2)
  console.log('listedRoot: ', listedRoot)

  let ipfsFilesInSome = await ipfs.files.ls('/some', { long: true })
  let listedSome = stringifiedResult === JSON.stringify(ipfsFilesInSome, null, 2)
  console.log('listedSome: ', listedSome)

  let ipfsFilesInSomeStuff = await ipfs.files.ls('/some/stuff', { long: true })
  let listedSomeStuff = stringifiedResult === JSON.stringify(ipfsFilesInSomeStuff, null, 2)
  console.log('listedSomeStuff: ', listedSomeStuff)


  /***** OFFER STRING VALUES FOR LOGGING IN UI  ******/

  let logRoot = JSON.stringify(ipfsFilesInRoot, null, 2)
  let logResult = JSON.stringify(result, null, 2)

  /***** CHECK FOR CORRECT /SOME/STUFF DIRECTORY ******/

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

  /****** CHECK FOR CORRECT FILENAMES *****/

  // expected filenames
  if (Array.isArray(result)) {
    let resultSorted = result.map( file => file.name.toString() ).sort()
    let uploadedFiles = window.uploadedFiles || false
    let expectedSorted = null
    let contentsMatch = null
    if (uploadedFiles) {
      let expected = uploadedFiles.map( file => file.name.toString() )
      expected.push('some')
      expectedSorted = expected.sort()
      contentsMatch = JSON.stringify(resultSorted) === JSON.stringify(expectedSorted)
    } else {
      console.log('no files uploaded')
    }

    let resultSomeItemIsFile = result.some(file => file.type === 0)
    console.log('resultSomeItemIsFile: ', resultSomeItemIsFile)
    let rootSomeItemIsFile = ipfsFilesInRoot.some(file => file.type === 0)
    console.log('rootSomeItemIsFile: ', rootSomeItemIsFile)


  } else {
    console.log("result isn't an array" )
  }


  /****** DISPLAY FAILURE/SUCCESS MESSAGES *****/

  if (!result) {
    return {fail: 'Oops, you forgot to return a result. Did you accidentally delete `return directoryContents`?'}
  } else if (!listedRoot){
    // user edited the ls line to show something other than root directory, which will also cause most later checks to fail
    let returnedDirectoryMsg = ""
    if (listedSome) {
      returnedDirectoryMsg = " in your `/some` directory"
    } else if (listedSomeStuff) {
      returnedDirectoryMsg = " in your `/some/stuff` directory"
    } else {
      console.log("some other directory")
      returnedDirectoryMsg = ""
    }
    return {
      fail: 'Looks like you edited the `ls` code to list something other than the root directory. Please try again, editing only the section of code indicated.',
      logDesc: 'Here\'s what your `ls` command shows' + returnedDirectoryMsg + ':',
      log: logResult
   }
  } else if (result && result.error && result.error.message === 'file does not exist') {
    // user forgot to use {parents: true} option so path isn't found
    return { fail: 'The path to the directory you\'re trying to create can\'t be found. Did you forget to use the {parents: true} option?' }
  } else if (uploadedFiles = false) {
    // shouldn't happen because you can't hit submit without uploading files
    return {fail: 'Oops! You forgot to upload files to work with :('}
  } else if (!rootSomeItemIsFile) {
    // no files written to IPFS because user changed default code to remove write command
    return {
      fail: 'Uh oh. Looks like no files made it into IPFS. Did you accidentally edit the default `write` code?',
      logDesc: "Here's what's in your root directory:",
      log: logRoot
    }
  } else if (result[0].hash.length === 0) {
    // user edited the ls command to remove {long: true}
    return {
      fail: 'Oops! Looks like you edited the `ls` command and forgot to use the {long: true} option. Check out the results below, then try again without touching that part of the code.',
      logDesc: "Here's what happened when you forgot to use {long: true}:",
      log: logRoot
      }
  } else if (contains(stuffSomeHash, 'stuff')) {
    // created /stuff/some instead of /some/stuff
    return { fail: 'Uh oh. Looks like you created /stuff/some instead of /some/stuff.' }
  } else if (contains(emptyDirectoryHash, 'stuff')) {
    // created /stuff instead of /some/stuff.
    return { fail: 'Uh oh. Looks like you created /stuff instead of /some/stuff.' }
  } else if (contains(emptyDirectoryHash, 'some')) {
    // created /some instead of /some/stuff
    return { fail: 'Uh oh. Looks like you created /some instead of /some/stuff.' }
  } else if (!contains(someStuffHash, 'some')) {
    // didn't create empty some/stuff
    return { fail: 'Uh oh. Looks like your directory doesn\'t contain an empty /some/stuff/ directory' }
  } else if (contains(someStuffHash, 'some') && !contentsMatch){
    // created empty /some/stuff but other files are wrong (messed up write method)
    return {
      fail: 'Hmmm. You created a `/some/stuff` directory but something else is wrong. Did you accidentally edit the default `write` code so your other files weren\'t all added?',
      logDesc: "Here's what was returned by `ls` in your root directory.",
      log: logRoot
      }
  } else if (contains(someStuffHash, 'some') && contentsMatch){
    // filenames match and created empty some/stuff
    return {
      success: 'Success! Check out your directory contents below.',
      logDesc: "Here's what was returned by `ls` in your root directory. Notice how directories have a type of 1 while files have a type of 0.",
      log: logRoot
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
