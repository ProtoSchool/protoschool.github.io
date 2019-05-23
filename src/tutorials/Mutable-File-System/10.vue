<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :errorOverride="true"
    :createTestFile="true"
    lessonTitle="Read the contents of a file" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './10.md'
import exercise from './10-exercise.md'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (result && typeof result !== 'string') {
    return { fail: 'Oops. `secretMessage` should be a string. Did you forget to convert the buffer to a string?' }
  } else if (result && typeof result === 'string') {
    return {
      success: 'Success!',
      logDesc: "Here's the secret message you discovered in the file:",
      log: result
    }
  } else if (result.error) {
    return { error: result.error }
  }
}

const code = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')
  ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })

  let secretMessage = // your code goes here

  return secretMessage
}

return run
`

const solution = `/* global ipfs */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')
  ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', { long: true })

  let secretMessage = (await ipfs.files.read('/some/stuff/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ')).toString('utf8')

  return secretMessage
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
