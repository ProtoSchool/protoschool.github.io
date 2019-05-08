<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true"
    lessonTitle="Move a file" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './08.md'
import exercise from './08-exercise.md'

const validate = async (result, ipfs) => {

  // check that right directories are there with no loose files in root
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  console.log('rootDirectoryContents', rootDirectoryContents)
  let rootContainsOnlySome = rootDirectoryContents.length === 1 && rootDirectoryContents[0].name === 'some'
  let someContainsOnlyStuff = null
  if (rootContainsOnlySome) {
    console.log('rootContainsOnlySome', rootContainsOnlySome)
    let someDirectoryContents = await ipfs.files.ls('/some', { long: true })
    console.log('someDirectoryContents', someDirectoryContents)
    someContainsOnlyStuff = someDirectoryContents.length === 1 && someDirectoryContents[0].name === 'stuff'
    console.log('someContainsOnlyStuff', someContainsOnlyStuff)
  }

  console.log('result: ', result)
  let logResult = JSON.stringify(result, null, 2)

  // check whether user returned the contents of /some/stuff
  let someStuffFiles = await ipfs.files.ls('/some/stuff', { long: true })
  console.log('someStuffFiles: ', someStuffFiles)
  let logSomeStuff = JSON.stringify(someStuffFiles, null, 2)

  let returnedSomeStuffContents = JSON.stringify(result) === JSON.stringify(someStuffFiles)
  console.log('returnedSomeStuffContents ', someStuffFiles)

  // check whether contents of /some/stuff are the right files
  let uploadedFiles = window.uploadedFiles || false
  let uploadedFilenames = uploadedFiles.map(file => file.name.toString()).sort()
  let someStuffFilenames = someStuffFiles.map(file => file.name.toString()).sort()
  let itemsMatch = JSON.stringify(someStuffFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = someStuffFiles.every(file => file.type === 0)

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?'}
  } else if (uploadedFiles = false) {
    // Shouldn't happen because you can't hit submit without uploading files
    return { fail: 'Oops! You forgot to upload files to work with :(' }
  } else if (result.error && result.error.message === 'paths must start with a leading /'){
    return { fail: 'Paths must start with a leading `/`. Did you use just the file name when attempting to move each file?'}
  } else if (!returnedSomeStuffContents) {
    return { fail: 'It looks like you returned something other than the contents of the `/some/stuff` directory. Did you accidentally edit the return statement?' }
  } else if (!rootContainsOnlySome) {
    return {
      fail: 'Your root directory should now contain only your `/some` directory, but something else is there.',
      logDesc: 'Here\'s what\'s in your root directory:',
      log: rootDirectoryContents
    }
  } else if (!someContainsOnlyStuff) {
    return {
      fail: 'Your `/some` directory should now contain only your `/stuff` directory, but something else is there.',
      logDesc: 'Here\'s what\'s in your `/some` directory:',
      log: JSON.stringify((await ipfs.files.ls('/some', { long: true })), null, 2)
    }
  } else if (!itemsAreFiles) {
    return { fail: 'Uh oh. It looks like your /some/stuff directory contains a directory. It should only include files.'}
  } else if (!itemsMatch) {
    return { fail: 'Uh oh. It looks the contents of your /some/stuff directory don\'t match your uploaded files.'}
  } else if (itemsMatch && itemsAreFiles) {
    return {
      success: 'Success! You did it!',
      logDesc: "This is the data that is now in your `/some/stuff` directory in IPFS:",
      log: logSomeStuff
    }
  } else if (result.error) {
    return { error: result.error }
  }
  else {
    return { fail: 'Sad but useful message :(' }
  }



  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const code = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})

  // your code goes here

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})
  return someStuffDirectoryContents
}
return run
`


const solution = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})

  rootDirectoryContents.forEach(item => {
    if (item.type === 0) {
      ipfs.files.mv('/' + item.name, '/some/stuff')
    }
  })

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})
  return someStuffDirectoryContents
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
