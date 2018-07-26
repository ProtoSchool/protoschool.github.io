<template>
  <div class="lesson-blog-02">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Adding tags to the blog posts">
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
  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()}
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()}
  })
  return [treePostCid, computerPostCid]
}

return run`

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
        expectedTags = ['hobby', 'nature', 'outdoor']
        break
      case 'computers':
        expectedTags = ['hardware', 'hobby']
        break
    }
    if (!shallowEqualArrays(node.tags.sort(), expectedTags.sort())) {
      return {fail: `The tags of the "${node.content}" blog post ${utils.stringify(node.tags)} did not match the the expected tags ${utils.stringify(expectedTags)}.`}
    }
  }
  const expectedCids = ['zdpuAyYnsUYhTSyqGEEsR6nnexB9xoqvHuKU5HPSuzv5G9hcc',
    'zdpuB1TVtawVw5qEJ5SqwMJzhrypaTcM6jyZagdyhP1rSezFQ']
  const resultCids = result.map((cid) => cid.toBaseEncodedString())
  if (shallowEqualArrays(resultCids.sort(), expectedCids.sort())) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CIDs ${utils.stringify(resultCids)} did not match the expected CIDs ${utils.stringify(expectedCids)}.`}
  }
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
