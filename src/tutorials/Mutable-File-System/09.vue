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
    lessonTitle="Copy a file using a CID" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './09.md'
import exercise from './09-exercise.md'

const validate = async (result, ipfs) => {
  const someStuffFiles = await ipfs.files.ls('/some/stuff', { long: true })
  const someStuffFilenames = someStuffFiles.map(file => file.name.toString()).sort()
  const uploadedFilenames = uploadedFiles.map(file => file.name.toString())
  uploadedFilenames.push('QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')
  uploadedFilenames.sort()

  const returnedExpected = JSON.stringify(uploadedFilenames) === JSON.stringify(someStuffFilenames)

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (result.error) {
    return { error: result.error }
  } else if (!returnedExpected) {
    return {
      fail: 'Did you copy the file from IPFS to the `/some/stuff` directory?',
      logDesc: "Here's what's in your `/some/stuff` directory:",
      log: someStuffFiles
    }
  } else if (returnedExpected) {
    return {
      success: 'Success! You did it!',
      logDesc: "This is the data that is now in your `/some/stuff` directory in IPFS:",
      log: result
    }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  const rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  // Your code goes here

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
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

  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff')

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })
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
