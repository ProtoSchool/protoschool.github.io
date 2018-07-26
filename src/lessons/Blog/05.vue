<template>
  <div class="lesson-blog-05">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Update the tags">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './05.md'
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
  const dogPostCid = await ipfs.dag.put({
    content: "dogs",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["funny", "hobby"]
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
  return dogPostCid
}

return run`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  const validatedArray = utils.validateArrayOfCids(result, 5)
  if (validatedArray.fail) {
    return validatedArray
  }

  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    if (node.tag === undefined) {
      return {fail: 'Tag nodes need to have a `tag` field.'}
    }
    if (typeof node.tag !== 'string') {
      return {fail: '`tag` field needs to be a string.'}
    }
    if (node.posts === undefined) {
      return {fail: 'Tag nodes need to have a `posts` field.'}
    }
    if (!Array.isArray(node.posts)) {
      return {fail: 'The value of the `posts` field must be an array of links.'}
    }
    const isLinks = node.posts.every((post) => '/' in post)
    if (!isLinks) {
      return {fail: 'The values of the `posts` array must be links.'}
    }

    let expectedPosts
    const treePostCid = 'zdpuAyYnsUYhTSyqGEEsR6nnexB9xoqvHuKU5HPSuzv5G9hcc'
    const computerPostCid = 'zdpuB1TVtawVw5qEJ5SqwMJzhrypaTcM6jyZagdyhP1rSezFQ'
    const dogPostCid = 'zdpuAuaznfNPWfgSSrcGxkm3yqyssY6mz8i5T2gxqpEpNExG6'
    switch (node.tag) {
      case 'funny':
        expectedPosts = [dogPostCid]
        break
      case 'hardware':
        expectedPosts = [computerPostCid]
        break
      case 'hobby':
        expectedPosts = [treePostCid, computerPostCid, dogPostCid]
        break
      case 'nature':
        expectedPosts = [treePostCid]
        break
      case 'outdoor':
        expectedPosts = [treePostCid]
        break
      default:
        return {fail: `Wrong tag (${node.tag}). Did you mean one of funny, hardware, hobby, nature, outdoor?`}
    }
    const nodePosts = node.posts.map((post) => new CID(post['/']).toBaseEncodedString())
    if (!shallowEqualArrays(nodePosts.sort(), expectedPosts.sort())) {
      return {fail: `The posts of the tag "${node.tag}" ${utils.stringify(nodePosts)} did not match the the expected posts ${utils.stringify(expectedPosts)}.`}
    }
  }
  const expectedCids = ['zdpuAndBLHA6NSH8F7ytyE2WUR1UuN7fh6KJNszGbJcwpfS9i',
    'zdpuB1ryg9uwnR3jhx2CFrd42RVe3tTWpc8tqH5N6iNjZcjzh',
    'zdpuAzXdJ1892H72Xx6bUDrnhJcXXzwrAw1s5fuqvmqfUDko4',
    'zdpuAmAdYAYn5Gxy5VpwCw9qLJp9XW453aoRYRQ4SieofSWTr',
    'zdpuAypHe4866WWUB5LLtTGX4qD8ZLegx9beyv5CCPHRVpR6d']
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
