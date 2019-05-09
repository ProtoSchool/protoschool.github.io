<template>
  <FileLesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :errorOverride="true"
    lessonTitle="Read the contents of a file" />
</template>

<script>
import FileLesson from '../../components/File-Lesson'
import text from './10.md'
import exercise from './10-exercise.md'

const validate = async (result, ipfs) => {
  console.log(err)
  console.log('result is:', result)
  console.log(typeof result)
  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?'}
  } else if (result === '[object Promise]') {
    // this one isn't working
    return { fail: 'Something went wrong. Did you try to turn your buffer into a string but forget to wrap your async function in parentheses first?'}
  } else if (result.error && result.error.message === 'Unexpected token return'){
    return { fail: 'Hmm. That doesn\'t look right. Did you forget to set the value of secretMessage?'}
  } else if (result && typeof result !== 'string') {
    return { fail: 'Oops. `secretMessage` should be a string. Did you forget to convert the buffer to a string?' }
  } else if (result && typeof result === 'string' && result !== '[object Promise]') {
    return {
      success: 'You did it!',
      logDesc: 'Here\'s the secret message you discovered in `success.txt`:',
      log: result
    }
  } else if (result.error) {
    return { error: result.error }
  } else {
    return { fail: 'Sad but useful message :(' }
  }

}


const code = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})
  rootDirectoryContents.forEach(item => {
    if (item.type === 0) { ipfs.files.mv('/' + item.name, '/some/stuff') }
  })
  ipfs.files.cp('/ipfs/Qme1zmi8dxBiVM7K9y5J3oPxiWWBgzA7n9M6tkmkz8kSwV', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})

  let secretMessage = // your code goes here

  return secretMessage
}
return run
`

const solution = `/* global ipfs */
  const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, {create: true})))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await ipfs.files.ls('/', {long: true})
  rootDirectoryContents.forEach(item => {
    if (item.type === 0) { ipfs.files.mv('/' + item.name, '/some/stuff') }
  })
  ipfs.files.cp('/ipfs/Qme1zmi8dxBiVM7K9y5J3oPxiWWBgzA7n9M6tkmkz8kSwV', '/some/stuff')
  let someStuffDirectoryContents = await ipfs.files.ls('/some/stuff', {long: true})

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
  data: () => {
    return { text, validate, code, modules, exercise, solution }
  }
}
</script>
