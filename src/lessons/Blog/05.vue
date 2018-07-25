<template>
  <div class="lesson-blog-05">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Add an overview page of all blog posts">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './05.md'
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
  const dogsPostCid = await ipfs.dag.put({
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
      {"/": computerPostCid.toBaseEncodedString()},
      {"/": dogsPostCid.toBaseEncodedString()}
    ]
  })
  const hardwareTagCid = await ipfs.dag.put({
    tag: "hardware",
    posts: [
      {"/": treePostCid.toBaseEncodedString()}
    ]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [
      {"/": dogsPostCid.toBaseEncodedString()}
    ]
  })

  return [natureTagCid, outdoorTagCid, hobbyTagCid, hardwareTagCid, funnyTagCid]
}

return run`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  // TODO vmx 2018-07-25 proper validation:
  //  - check if CID is correct
  //  - try to traverse to the other posts and check their CIDs for correctness
  //  - check if returned node has a `prev` field
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
