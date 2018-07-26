<template>
  <div class="lesson-blog-04">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Add new blog post">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './04.md'
import utils from './utils.js'
const shallowEqualArrays = require('shallow-equal/arrays')
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})
  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["nature", "outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()},
    tags: ["hardware", "hobby"]
  })

  const natureTagCid = await ipfs.dag.put({
    tag: "nature",
    posts: [
      {"/": treePostCid.toBaseEncodedString()}
    ]
  })
  const outdoorTagCid = await ipfs.dag.put({
    tag: "outdoor",
    posts: [
      {"/": treePostCid.toBaseEncodedString()}
    ]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [
      {"/": treePostCid.toBaseEncodedString()},
      {"/": computerPostCid.toBaseEncodedString()}
    ]
  })
  const hardwareTagCid = await ipfs.dag.put({
    tag: "hardware",
    posts: [
      {"/": computerPostCid.toBaseEncodedString()}
    ]
  })

  return [natureTagCid, outdoorTagCid, hobbyTagCid, hardwareTagCid]
}

return run`

const validate = async (result, ipfs) => {
  console.log('result:', result)
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  const node = (await ipfs.dag.get(result)).value
  if (node.content === undefined) {
    return {fail: 'Blog post needs to have a `content` field.'}
  }
  if (node.content !== 'dogs') {
    return {fail: 'The `content` of the new blog post must be "dogs".'}
  }
  if (node.author === undefined) {
    return {fail: 'Blog post needs to have an `author` field.'}
  }
  if (node.author['/'] === undefined) {
    return {fail: 'The value of `author` needs to be a link (`{"/": "some-cid"}`).'}
  }
  const samCid = 'zdpuAzUoWGnKe4p13YbexQrb5AMhnDWDCqJt2XyqVPU6DxS4m'
  const nodeAuthor = new CID(node.author['/']).toBaseEncodedString()
  if (nodeAuthor !== samCid) {
    return {fail: 'The author of the new blog post needs to be Sam.'}
  }
  if (node.tags === undefined) {
    return {fail: 'Blog post needs to have a `tags` field.'}
  }
  if (!Array.isArray(node.tags)) {
    return {fail: 'The value of the `tags` field must be an array of strings.'}
  }
  const isStrings = node.tags.every((tag) => typeof tag === 'string')
  if (!isStrings) {
    return {fail: `Tags need to be strings.`}
  }
  let expectedTags = ['funny', 'hobby']
  if (!shallowEqualArrays(node.tags.sort(), expectedTags.sort())) {
    return {fail: `The tags of the "${node.content}" blog post ${utils.stringify(node.tags)} did not match the the expected tags ${utils.stringify(expectedTags)}.`}
  }
  const expectedCid = 'zdpuAuaznfNPWfgSSrcGxkm3yqyssY6mz8i5T2gxqpEpNExG6'
  const resultCid = result.toBaseEncodedString()
  if (resultCid === expectedCid) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CID ${resultCid} did not match the expected CID ${expectedCid}.`}
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
