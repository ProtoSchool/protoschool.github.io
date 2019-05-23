<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true"
    :createTestFile="true"
    lessonTitle="Remove a file or directory" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './11.md'
import exercise from './11-exercise.md'

const validate = async (result, ipfs) => {
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const rootDirectoryStatus = await ipfs.files.stat('/')
  const correctHash = rootDirectoryStatus.hash === 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'

  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (result.error && result.error.message === '/some is a directory, use -r to remove directories') {
    return { fail: 'Oops! You tried to remove `/some` but it didn\'t work because you forgot to use `{ recursive: true }`.' }
  } else if (!rootDirectoryStatus.hash) {
    return { fail: 'Your root directory doesn\'t look right. Are you sure you ran the `files.rm` method on your `/some` directory with the option `{ recursive: true }`?' }
  } else if (!correctHash) {
    // only removed /some/stuff with {recursive:true} or tried to remove the root itself
    return {
      fail: 'Your root directory isn\'t empty. Are you sure you ran the `files.rm` method on your `/some` directory with the option `{ recursive: true }`?',
      logDesc: 'Here are the current contents of your root directory:',
      log: JSON.stringify(rootDirectoryContents, null, 2)
    }
  } else if (correctHash) {
    return {
      success: 'Success! You\'ve completed this series of lessons!',
      logDesc: "Your function returned an empty array (`[]`) as there is no content in your root directory. Its status (`stat`) is shown below. Note that we're back to exactly the same CID we started with!",
      log: JSON.stringify(rootDirectoryStatus, null, 2)
    }
  }

  // Output the default error if we haven't caught any
  return { error: result.error }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  let secretMessage = (await ipfs.files.read('/some/stuff/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')).toString('utf8')

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
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  let secretMessage = (await ipfs.files.read('/some/stuff/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')).toString('utf8')

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
  data: () => {
    return { text, validate, code, modules, exercise, solution }
  }
}
</script>
