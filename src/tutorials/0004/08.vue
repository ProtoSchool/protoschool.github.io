<template>
  <FileLesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true" />
</template>

<script>
import FileLesson from '../../components/FileLesson'
import text from './08.md'
import exercise from './08-exercise.md'

const validate = async (result, ipfs) => {
  // check that right directories are there with no loose files in root
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })

  let rootIsEmpty = rootDirectoryContents.length === 0
  let rootContainsOnlySome = rootDirectoryContents.length === 1 && rootDirectoryContents[0].name === 'some'
  let someContainsOnlyStuff = null

  if (rootContainsOnlySome) {
    let someDirectoryContents = await ipfs.files.ls('/some', { long: true })
    someContainsOnlyStuff = someDirectoryContents.length === 1 && someDirectoryContents[0].name === 'stuff'
  }

  // identify files that should have been moved
  let uploadedFiles = window.uploadedFiles || false
  let uploadedFilenames = uploadedFiles.map(file => file.name.toString()).sort()

  // check whether user returned the contents of /some/stuff
  let someStuffFiles = null
  let logSomeStuff = null
  let returnedSomeStuffContents = null
  let someStuffFilenames = null
  let itemsMatch = null
  let itemsAreFiles = null

  if (!rootIsEmpty && rootContainsOnlySome && someContainsOnlyStuff) {
    someStuffFiles = await ipfs.files.ls('/some/stuff', { long: true })
    someStuffFilenames = someStuffFiles.map(file => file.name.toString()).sort()
    logSomeStuff = JSON.stringify(someStuffFiles, null, 2)
    returnedSomeStuffContents = JSON.stringify(result) === JSON.stringify(someStuffFiles)

    // check whether contents of /some/stuff are the right files
    itemsMatch = JSON.stringify(someStuffFilenames) === JSON.stringify(uploadedFilenames)
    itemsAreFiles = someStuffFiles.every(file => file.type === 0)
  }

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (uploadedFiles === false) {
    // Shouldn't happen because you can't hit submit without uploading files
    return { fail: 'Oops! You forgot to upload files to work with :(' }
  } else if (result instanceof Error && result.message === 'Unexpected token const') {
    return {
      fail: 'Oops! Looks like you forgot to assign a value to `filesToMove` or `filepathsToMove`',
      overrideError: true
    }
  } else if (result instanceof Error && result.message === 'await is only valid in async function') {
    return {
      fail: "Oops! `await` is only valid in an async function. Perhaps you ran `file.mv` multiple times and didn't wrap it in a single async function? See our suggestion for passing in an array so you can make a single call to `files.mv`.",
      overrideError: true
    }
  } else if (result instanceof Error && result.message === 'ipfs.mv is not a function') {
    return {
      fail: 'Oops! Did you type `ipfs.mv` instead of `ipfs.files.mv`?',
      overrideError: true
    }
  } else if (rootIsEmpty) {
    return { fail: 'Your root directory is empty. Did you accidentally move the `some/stuff` directory? Remember to test whether each item is a file (`type === 0`) before moving it.' }
  } else if (result instanceof Error && result.message === 'paths must start with a leading /') {
    return {
      fail: 'Paths must start with a leading `/`. Did you use just the file name when attempting to move each file?',
      overrideError: true
    }
  } else if (!returnedSomeStuffContents) {
    return { fail: 'It looks like you returned something other than the contents of the `/some/stuff` directory. Did you accidentally edit the return statement?' }
  } else if (!rootContainsOnlySome) {
    return {
      fail: 'Your root directory should now contain only your `/some` directory, but something else is there.',
      logDesc: "Here's what's in your root directory:",
      log: rootDirectoryContents
    }
  } else if (!someContainsOnlyStuff) {
    return {
      fail: 'Your `/some` directory should now contain only your `/stuff` directory, but something else is there.',
      logDesc: "Here's what's in your `/some` directory:",
      log: JSON.stringify((await ipfs.files.ls('/some', { long: true })), null, 2)
    }
  } else if (!itemsAreFiles) {
    return { fail: 'Uh oh. It looks like your `/some/stuff` directory contains a directory. It should only include files.' }
  } else if (!itemsMatch) {
    return { fail: "Uh oh. It looks the contents of your `/some/stuff` directory don't match your uploaded files." }
  } else if (itemsMatch && itemsAreFiles) {
    return {
      success: 'Success! You did it!',
      logDesc: 'This is the data that is now in your `/some/stuff` directory in IPFS:',
      log: logSomeStuff
    }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })

  const filesToMove = // create an array of files to be moved (no directories)

  const filepathsToMove = // create an array of the paths of those files

  // move all the files in filepathsToMove into /some/stuff

  const someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return someStuffDirectoryContents
}

return run
`

const solution = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })

  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  //  // alternatively, wrapping multiple mv calls into a single async function with await:
  //  const filesToMove = rootDirectoryContents.filter(item => item.type === 0)
  //  await Promise.all(filesToMove.map(file => {
  //    return ipfs.files.mv('/' + file.name, '/some/stuff')
  // }))

  const someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return someStuffDirectoryContents
}

return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      exercise,
      code,
      solution,
      validate,
      modules
    }
  }
}
</script>
