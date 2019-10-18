<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :overrideErrors="true"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :createTestTree="true" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './07.md'
import exercise from './07-exercise.md'

const code = `/* global ipfs */
const run = async () => {
  let result = // write your get code here

  // loop over the results to modify the content of the files in the result array here

  // don't forget to return the string value
}
return run
`

const solution = `/* global ipfs */
const run = async () => {
  let filesAndDirectories = await ipfs.get('QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa')

  let filesContents = []

  for( let item in filesAndDirectories ) {
    // If the item is a file, it has content
    if(item.content) {
      item.content = item.content.toString('utf-8')
    }

    filesContent.push(item)
  }

  // filesAndDirectories = filesAndDirectories.map((elem) => {
  //   if(elem.content) {
  //     elem.content = elem.content.toString('utf-8')
  //   }
  //   return elem
  // })

  return filesAndDirectories
}
return run
`

const testResult = '[{"hash":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa","name":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa","depth":1,"size":0,"type":"dir"},{"hash":"QmeMSPkjXkD2VzMzQXex7TQNkaoCfxmh6uKtZQxyqhXQRD","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/bar","name":"bar","depth":2,"size":0,"type":"dir"},{"hash":"QmT92qKASn2wUL2fxspZkDaB9kCfzc8Bx1qvKq5u2ai1BW","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/bar/file4.txt","name":"file4.txt","depth":3,"size":41,"type":"file","content":"This is file4.txt, which is in /root/bar!"},{"hash":"QmZEdiqdX7RNzqaQGNVr9MvQBSUXuB58cqVzV1NwYmdide","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/foo","name":"foo","depth":2,"size":0,"type":"dir"},{"hash":"QmdrbiHCxBJ87H92V3cj7dhVoSY2HuYt6d13pvPmEF3KzN","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/foo/file1.txt","name":"file1.txt","depth":3,"size":31,"type":"file","content":"This is file1.txt in /root/foo!"},{"hash":"QmWCr8P75nAutWJ2RhKWxq9KNHuArrfh6bShCVGyEjk715","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/foo/file2.txt","name":"file2.txt","depth":3,"size":31,"type":"file","content":"This is file2.txt in /root/foo!"},{"hash":"QmYA4wXzcYyEvbjhKWvZx89wDtgKo51F4hfhEDqkTH4eK1","path":"QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa/foo/file3.txt","name":"file3.txt","depth":3,"size":31,"type":"file","content":"This is file3.txt in /root/foo!"}]'

const validate = async (result, ipfs) => {

  if (!result) {
    return {
      fail: 'Oops! You forgot to return a result :('
    }
  }

  if (result.error) {
    if (result.error.toString().includes("Cannot read property 'indexOf' of null") ||
        result.error.toString().includes('path.indexOf is not a function')) {
      return {
        fail: "The `CID` provided to `ipfs.get` is incorrect. Make sure you're using the `CID` we provided"
      }
    } else {
      return { error: result.error }
    }
  }

  if (!Array.isArray(result)) {
    return {
      fail: 'The return value should be an array, just like the `get` function returns. Make sure you are returning the correct value.'
    }
  }

  let isStructureValid = result.every((elem) => {
    if (elem.hash === undefined || typeof elem.hash !== 'string') return false
    if (elem.path === undefined || typeof elem.path !== 'string') return false
    if (elem.name === undefined || typeof elem.name !== 'string') return false
    if (elem.depth === undefined || typeof elem.depth !== 'number') return false
    if (elem.size === undefined || typeof elem.size !== 'number') return false
    if (elem.type === undefined || typeof elem.type !== 'string') return false
    return true
  })

  if (!isStructureValid) {
    return {
      fail: 'The returned value does not match the structure of the typical output of the `get` function. Are you sure your are returning the result of the `get` function?'
    }
  }

  if (JSON.stringify(result) !== testResult) {
    return {
      fail: 'The data returned does not match what we expect. Did you forget to convert the `content` values from `Buffer` to string?'
    }
  }

  return {
    success: 'Success!',
    logDesc: 'Here is the result of calling the `get` method with the `CID` of the `dir` directory.',
    log: result
  }

}

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
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
