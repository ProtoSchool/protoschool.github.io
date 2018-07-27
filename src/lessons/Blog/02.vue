<template>
  <div class="lesson-blog-02">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="CIDs change">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'
import utils from './utils.js'
const shallowEqualArrays = require('shallow-equal/arrays')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})

  // Modify the blog posts below

  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()}
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()}
  })

  console.log('post about trees:', treePostCid.toBaseEncodedString())
  console.log('post about computers:', computerPostCid.toBaseEncodedString())

  return [treePostCid, computerPostCid]
}

return run`

// eslint-disable-next-line no-unused-vars
const _solution = `
/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})
  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()},
    tags: ["hobby"]
  })

  return [treePostCid, computerPostCid]
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  const validatedArray = utils.validateArrayOfCids(result, 2)
  if (validatedArray.fail) {
    return validatedArray
  }
  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    if (node.tags === undefined) {
      return {fail: 'Blog posts need to have a `tags` field.'}
    }
    if (!Array.isArray(node.tags)) {
      return {fail: 'The value of the `tags` field must be an array of strings.'}
    }
    const isStrings = node.tags.every((tag) => typeof tag === 'string')
    if (!isStrings) {
      return {fail: `Tags need to be strings.`}
    }
    let expectedTags
    switch (node.content) {
      case 'trees':
        expectedTags = ['hobby', 'outdoor']
        break
      case 'computers':
        expectedTags = ['hobby']
        break
    }
    if (!shallowEqualArrays(node.tags.sort(), expectedTags.sort())) {
      return {fail: `The tags of the "${node.content}" blog post ${utils.stringify(node.tags)} did not match the the expected tags ${utils.stringify(expectedTags)}.`}
    }
  }
  // Don't check the CIDs as then the order of the tags would matter.
  // But that order really doesn't matter.
  return {success: 'All works!'}
}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      code,
      text,
      validate
    }
  }
}
</script>
