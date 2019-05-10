<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Copy a file using a CID" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './09.md'
import exercise from './09-exercise.md'

const validate = async (result, ipfs) => {

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?'}
  } else if (result) {
    return {
      success: 'Your function returned a result!',
      logDesc: 'This is what your function returned:',
      log: JSON.stringify(result, null, 2)}
  } else {
    return { fail: 'Sad but useful message :(' }
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const code = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  // your code goes here

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})
  return someStuffDirectoryContents
}
return run
`

const solution = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})

  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(filepathsToMove, '/some/stuff')

  ipfs.files.cp('/ipfs/Qme1zmi8dxBiVM7K9y5J3oPxiWWBgzA7n9M6tkmkz8kSwV', '/some/stuff')

  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})
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
