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
    :errorOverride="true"
    :createTestFile="true" />
</template>

<script>
import FileLesson from '../../components/FileLesson'
import text from './10.md'
import exercise from './10-exercise.md'

const validate = async (result, ipfs) => {
  const correctMessage = 'You did it!'

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (result.error) {
    return { error: result.error }
  } else if (result && typeof result !== 'string') {
    return { fail: 'Oops. `secretMessage` should be a string. Did you forget to convert the buffer to a string?' }
  } else if (result !== correctMessage) {
    return {
      fail: "Uh oh! That's not the message we hid for you.",
      logDesc: "Here's the current value of `secretMessage`:",
      log: result
    }
  } else if (result === correctMessage) {
    return {
      success: 'Success!',
      logDesc: "Here's the secret message you discovered in the file:",
      log: result
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

  let secretMessage = // your code goes here

  return secretMessage
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

  let secretMessage = (await ipfs.files.read('/some/stuff/success.txt')).toString('utf8')

  return secretMessage
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
