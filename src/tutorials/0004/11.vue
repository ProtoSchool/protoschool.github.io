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
    :overrideErrors="true"
    :createTestFile="true" />
</template>

<script>
import FileLesson from '../../components/FileLesson'
import text from './11.md'
import exercise from './11-exercise.md'

const validate = async (result, ipfs) => {
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const rootDirectoryStatus = await ipfs.files.stat('/')
  const rootIsEmpty = rootDirectoryStatus.hash === 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'

  let rootContainsSome = rootDirectoryContents.length === 1 && rootDirectoryContents[0].name === 'some'
  let someContainsStuff = null
  let someIsEmpty = null
  let someDirectoryContents = null

  if (rootContainsSome) {
    someDirectoryContents = await ipfs.files.ls('/some', { long: true })
    someContainsStuff = someDirectoryContents.length === 1 && someDirectoryContents[0].name === 'stuff'
    someIsEmpty = someDirectoryContents.length === 0
  }

  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (result instanceof Error && result.message.includes('is a directory, use -r to remove directories')) {
    return {
      fail: 'Oops! You tried to remove a non-empty directory and it didn\'t work because you forgot to use `{ recursive: true }`.',
      overrideError: true
    }
  } else if (!rootDirectoryStatus.hash) {
    return { fail: 'Your root directory doesn\'t look right. Are you sure you ran the `files.rm` method on your `/some` directory with the option `{ recursive: true }`?' }
  } else if (result instanceof Error && result.message === 'Cannot delete root') {
    return {
      fail: 'Oops! Your root directory can\'t be removed. Remove `/some` instead.',
      overrideError: true
    }
  } else if (rootContainsSome && someIsEmpty) {
    // only removed /some/stuff with {recursive:true} or tried to remove the root itself
    return {
      fail: 'Oops! You removed `/some/stuff` but `/some` is still in your root directory.'
    }
  } else if (rootContainsSome && someContainsStuff) {
    return {
      fail: 'You still have a `/some/stuff` directory. Be sure to run the `files.rm` method on your `/some` directory with the option `{ recursive: true }`'
    }
  } else if (!(result instanceof Error) && !rootIsEmpty) {
    // only removed /some/stuff with {recursive:true} or tried to remove the root itself
    return {
      fail: 'Your root directory isn\'t empty. Are you sure you ran the `files.rm` method on your `/some` directory with the option `{ recursive: true }`?',
      logDesc: 'Here are the current contents of your root directory:',
      log: JSON.stringify(rootDirectoryContents, null, 2)
    }
  } else if (rootIsEmpty) {
    return {
      success: 'Success! You\'ve completed this series of lessons!',
      logDesc: "Your function returned an empty array (`[]`) as there is no content in your root directory. Its status (`stat`) is shown below. Note that we're back to exactly the same CID we started with!",
      log: JSON.stringify(rootDirectoryStatus, null, 2)
    }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })

  // Your code goes here

  let finalRootDirectoryContents = await ipfs.files.ls('/', { long: true })
  return finalRootDirectoryContents
}

return run
`

const solution = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })

  await ipfs.files.rm('/some', { recursive: true })

  let finalRootDirectoryContents = await ipfs.files.ls('/', { long: true })
  return finalRootDirectoryContents
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
