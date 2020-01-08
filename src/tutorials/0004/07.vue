<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :overrideErrors="true" />
</template>

<script>
import FileLesson from '../../components/FileLesson.vue'
import text from './07.md'
import exercise from './07-exercise.md'

const validate = async (result, ipfs) => {
  return null
}

const code = `const run = async (files) => {
  // This code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  // Add your code to create a new directory here

  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  return rootDirectoryContents
}

return run
`

const solution = `const run = async (files) => {
  // This code adds your uploaded files to your root directory in IPFS
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))

  await ipfs.files.mkdir('/some/stuff', { parents: true })

  let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
  return rootDirectoryContents
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
