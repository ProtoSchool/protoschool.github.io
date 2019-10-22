<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution" />
</template>

<script>
import pTimeout from 'p-timeout'
import FileLesson from '../../components/FileLesson'
import text from './05.md'
import exercise from './05-exercise.md'

const code = `/* global ipfs */
const run = async (files) => {
  let filesWithPath = // build the array of {content, path} objects here

  let result = // write code to add files here

  // don't forget to return the result
}
return run
`

const solution = `/* global ipfs */
const run = async (files) => {
  let filesWithPath = []

  for(let file of files) {
    let fileObject = {
      content: file,
      path: \`\${file.name}\`
    }

    filesWithPath.push(fileObject)
  }
  
  // You can also create this array using the map array method
  // let filesWithPath = files.map((file, idx) => {
  //   return {
  //     content: file,
  //     path: \`\${file.name}\`
  //   }
  // })

  let result = await ipfs.add(filesWithPath, {wrapWithDirectory: true})

  return result
}
return run
`

const validate = async (result, ipfs) => {
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only

  let uploadedFiles = window.uploadedFiles || false

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    return { error: result.error }
  }

  if (uploadedFiles.length === result.length) {
    return {
      fail: "We can't find a directory. Did you set the `wrapWithDirection` option to true?"
    }
  }

  if (uploadedFiles.length !== result.length - 1) {
    return {
      fail: 'The resulting array seems to be wrong. You should have one element per file, plus another for the root directory'
    }
  }

  const resultingFiles = await pTimeout(ipfs.ls(result[result.length - 1].hash), 2000).catch(() => 'error')
  if (resultingFiles === 'error') {
    return {
      fail: 'Could not get CID of `dir` directory'
    }
  } else {
    if (resultingFiles.length !== uploadedFiles.length) {
      return {
        fail: 'Number of uploaded files does not match the number of files on your ifps node. Did you skip any of the files you uploaded? Did you make sure each file had a unique name when defining the path?'
      }
    }
  }

  return {
    success: 'Success!',
    logDesc: "Here's what the result of the `add` method. Note that you get 2 extra elements besides the files you uploaded. These match the directories the `add` method created due to the `wrapWithDirectory` option." +
              "\n\n Notice also that the `path` attribute of the files matches their name. We will be able to use them in combination with the directory's `CID` to get the file's content in a future lesson.",
    log: result
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const modules = { cids: require('cids') }

export default {
  components: {
    FileLesson
  },
  data: () => {
    return {
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
