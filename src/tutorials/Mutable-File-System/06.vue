<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="See how CIDs change as data changes" />
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './06.md'
import exercise from './06-exercise.md'

const validate = async (result, ipfs) => {

  const emptyDirectoryHash = "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn"

  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (!!result & !result.hash) {
    return { fail: 'That result doesn\'t look right. Are you sure you ran the stat method on your root directory?' }
  } else if (!!result && result.hash === emptyDirectoryHash) {
    return { fail: 'Oops! It looks like your directory is empty. Did you delete some of the previous code?' }
    } else if (!!result && result.hash !== emptyDirectoryHash) {
          return {
            success: 'Success! You did it!',
            logDesc: "Here's the status of your updated root directory (/). Notice how this data compares to what you saw when the directory was empty.",
            log: result
          }
        }
  // Output the default error if we haven't caught any
  return { error: result.error }
}

const code = `/* global ipfs */
  const run = async (files) => {
    // this code adds your uploaded files to IPFS
    await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
    let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
    let directoryStatus = // your code goes here
    return directoryStatus
  }
  return run
  `

const solution = `/* global ipfs */
  const run = async (files) => {
    // this code adds your uploaded files to IPFS
    await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
    let rootDirectoryContents = await ipfs.files.ls('/', { long: true })
    let directoryStatus = await ipfs.files.stat('/')
    return directoryStatus
  }
  return run
  `

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: () => {
    return { text, validate, code, modules, exercise, solution  }
  }
}
</script>
