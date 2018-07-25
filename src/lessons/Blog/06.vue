<template>
  <div class="lesson-blog-06">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Generate the overview page">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './06.md'
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
    tags: ["hardware", "hobby"],
    prev: {"/": treePostCid.toBaseEncodedString()}
  })
  const dogsPostCid = await ipfs.dag.put({
    content: "dogs",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["funny", "hobby"],
    prev: {"/": computers.toBaseEncodedString()}
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

  return dogsPostCid
}

return run`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  // TODO vmx 2018-07-25 proper validation:
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
