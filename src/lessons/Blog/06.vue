<template>
  <div class="lesson-blog-06">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Add an overview page of all blog posts">
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
    tags: ["outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()},
    tags: ["hobby"]
  })
  const dogPostCid = await ipfs.dag.put({
    content: "dogs",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["funny", "hobby"]
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
      {"/": dogPostCid.toBaseEncodedString()}
    ]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [
      {"/": dogPostCid.toBaseEncodedString()}
    ]
  })

  return [outdoorTagCid, hobbyTagCid, funnyTagCid]
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
    tags: ["hobby"],
    prev: {"/": treePostCid.toBaseEncodedString()}
  })
  const dogPostCid = await ipfs.dag.put({
    content: "dogs",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["funny", "hobby"],
    prev: {"/": computerPostCid.toBaseEncodedString()}
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
      {"/": dogPostCid.toBaseEncodedString()}
    ]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [
      {"/": dogPostCid.toBaseEncodedString()}
    ]
  })

  return dogPostCid
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  const node = (await ipfs.dag.get(result)).value
  if (node.content === undefined || node.content !== 'dogs') {
    return {fail: `The returned value should be the CID of the "dogs" blog post.`}
  }
  if (node.prev === undefined) {
    return {fail: 'The "dogs" blog post needs to have a `prev` field.'}
  }
  if (node.prev['/'] === undefined) {
    return {fail: 'The value of `prev` of the "dogs" blog post needs to be a link (`{"/": "some-cid"}`).'}
  }

  const dogPostCid = 'zdpuAxe3g8XBLrqbp3NrjaiBLTrXjJ3SJymePGutsRRMrhAKS'
  const computerPostCid = 'zdpuAwwT4kGJxT7mgVZRgvmV3ke8qGNZGLuCgLhJsdBSQGM44'
  const treePostCid = 'zdpuAri55PR9iW239ahcbnfkFU2TVyD5iLmqEFmwY634KZAJV'
  const nodePrev = new CID(node.prev['/'])

  const computerNode = (await ipfs.dag.get(nodePrev)).value
  if (computerNode.content === undefined) {
    return {fail: `The "dogs" blog post should link to the "computers" blog post.`}
  }
  if (computerNode.content !== 'computers') {
    return {fail: `The "dogs" blog post should link to the "computers" blog post, but it links to ${computerNode.content}.`}
  }
  if (computerNode.prev === undefined) {
    return {fail: 'The "computers" blog post needs to have a `prev` field.'}
  }
  if (computerNode.prev['/'] === undefined) {
    return {fail: 'The value of `prev` of the "computers" blog post needs to be a link (`{"/": "some-cid"}`).'}
  }
  const computerNodePrev = new CID(computerNode.prev['/'])

  const treeNode = (await ipfs.dag.get(computerNodePrev)).value
  if (treeNode.content === undefined) {
    return {fail: `The "compputers" blog post should link to the "trees" blog post.`}
  }
  if (treeNode.content !== 'trees') {
    return {fail: `The "compputers" blog post should link to the "trees" blog post, but it links to ${treeNode.content}.`}
  }
  if ('prev' in treeNode) {
    return {fail: 'The "trees" blog post shouldn\'t link to other blog posts.'}
  }

  const computerNodePrevCid = computerNodePrev.toBaseEncodedString()
  if (computerNodePrevCid !== treePostCid) {
    return {fail: `The "computers" blog post should link to the "trees" blog post, but it links to ${computerNodePrevCid}.`}
  }
  const nodePrevCid = nodePrev.toBaseEncodedString()
  if (nodePrevCid !== computerPostCid) {
    return {fail: `The "dogs" blog post should link to the "computers" blog post, but it links to ${nodePrevCid}.`}
  }
  const nodeCid = result.toBaseEncodedString()
  if (nodeCid === dogPostCid) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CID ${nodeCid} did not match the expected CID ${dogPostCid}.`}
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
