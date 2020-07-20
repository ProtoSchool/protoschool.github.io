import utils from '../utils'

const validate = async (result, ipfs) => {
  const correctMessage = 'You did it!'

  if (!result) {
    return { fail: 'You forgot to return a result. Did you accidentally edit the return statement?' }
  } else if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
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

const code = `/* global ipfs, all, toBuffer */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await all(ipfs.files.ls('/'))
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(...filepathsToMove, '/some/stuff')
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')
  let someStuffDirectoryContents = await all(ipfs.files.ls('/some/stuff'))

  let secretMessage = // your code goes here

  return secretMessage
}

return run
`

const solution = `/* global ipfs, all, toBuffer */

const run = async (files) => {
  await Promise.all(files.map(f => ipfs.files.write('/' + f.name, f, { create: true })))
  await ipfs.files.mkdir('/some/stuff', { parents: true })
  let rootDirectoryContents = await all(ipfs.files.ls('/'))
  const filepathsToMove = rootDirectoryContents.filter(file => file.type === 0).map(file => '/' + file.name)
  await ipfs.files.mv(...filepathsToMove, '/some/stuff')
  await ipfs.files.cp('/ipfs/QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ', '/some/stuff/success.txt')
  let someStuffDirectoryContents = await all(ipfs.files.ls('/some/stuff'))

  let secretMessage = (await toBuffer(ipfs.files.read('/some/stuff/success.txt'))).toString('utf8')

  return secretMessage
}

return run
`

const options = {
  overrideErrors: true,
  createTestFile: true
}

export default {
  validate,
  code,
  solution,
  options
}
