<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true"
    lessonTitle="Copy a file using a CID" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './09.md'
import exercise from './09-exercise.md'

const validate = async (result, ipfs) => {
  const someStuffContents = await ipfs.files.ls('/some/stuff', { long: true })

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (result.error && result.error.message === 'Please supply at least one source') {
    return { fail: 'Did you forgot to destructure the `filepathsToMove` array?' }
  } else if (!result.error && someStuffContents.length === 0) {
    return { fail: 'Double check if you copied the files to the `/some/stuff` directory...' }
  } else if (result.error) {
    return { error: result.error }
  } else if (result) {
    return {
      success: 'Success, you did it!',
      logDesc: 'Check the contents of your `root` and `/some/stuff` directories:',
      log: JSON.stringify(result, null, 2)
    }
  } else {
    return { fail: "Something doesn't look right. Please hit `Reset Code` and try again, editing only the portion of code indicated." }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)

  // Your code goes here

  const someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return {
    rootDirectoryContents: rootDirectoryContents,
    someStuffDirectoryContents: someStuffDirectoryContents
  }
}

return run
`

const solution = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)

  await ipfs.files.cp(...filepathsToMove, '/some/stuff')

  const someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
  return {
    rootDirectoryContents: rootDirectoryContents,
    someStuffDirectoryContents: someStuffDirectoryContents
  }
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
