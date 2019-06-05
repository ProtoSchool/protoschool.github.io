<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Add a file to MFS" />
</template>

<script>
import FileLesson from '../../components/File-Lesson.vue'
import text from './04.md'
import exercise from './04-exercise.md'

const validate = async (result, ipfs) => {
  // Validation will be done by matching filenames between the
  // uploadedFiles array and the files in IPFS and ensuring that the type of each
  // file in IPFS is 0 (file, not directory).
  // If IPFS errors out, we try to output a clearer version to the user. If that's
  // not possible, the error from IPFS will be the output.

  let uploadedFiles = window.uploadedFiles || false

  let ipfsFiles = await ipfs.files.ls('/', { long: true })
  let log = JSON.stringify(ipfsFiles, null, 2)

  let uploadedFilenames = uploadedFiles.map(file => file.name.toString()).sort()
  let ipfsFilenames = ipfsFiles.map(file => file.name.toString()).sort()
  let itemsMatch = JSON.stringify(ipfsFilenames) === JSON.stringify(uploadedFilenames)
  let itemsAreFiles = ipfsFiles.every(file => file.type === 0)

  if (itemsMatch && itemsAreFiles) {
    return {
      success: 'Success! You did it!',
      logDesc: 'This is the data that is now in your root directory in IPFS:',
      log: log
    }
  } else if (uploadedFiles = false) {
    // Shouldn't happen because you can't hit submit without uploading files
    return { fail: 'Oops! You forgot to upload files to work with :(' }
  } else if (result && result.error.message === 'No child name passed to addLink') {
    // Forgot the file name and just used a directory as the path
    return { fail: 'Uh oh. It looks like you created a directory instead of a file. Did you forget to include a filename in your path?' }
  } else if (result && result.error.message === 'file does not exist') {
    // Forgot the `{ create: true }` option
    return { fail: "The file doesn't exist yet, so you need to create it. Did you forget an option?" }
  }

  // Output the default error if we haven't caught any
  return { error: result.error }
}

const code = `const run = async (files) => {
  for (let file of files) {
    // Your code to add one file to MFS goes here
  }
}

return run
`

const solution = `const run = async (files) => {
  for (let file of files) {
    await ipfs.files.write('/' + file.name, file, { create: true })
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
    return { text, validate, code, modules, exercise, solution  }
  }
}
</script>
