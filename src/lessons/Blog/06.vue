<template>
  <div class="lesson-blog-06">
    <Lesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :exercise="exercise"
            lessonTitle="List posts chronologically with a chain of links">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './06.md'
import exercise from './06-exercise.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})

  // Modify the blog posts below

  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: samCid,
    tags: ["outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: natCid,
    tags: ["hobby"]
  })
  const dogPostCid = await ipfs.dag.put({
    content: "dogs",
    author: samCid,
    tags: ["funny", "hobby"]
  })

  const outdoorTagCid = await ipfs.dag.put({
    tag: "outdoor",
    posts: [ treePostCid ]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [ treePostCid, computerPostCid, dogPostCid ]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [ dogPostCid ]
  })

  return dogPostCid
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
    author: samCid,
    tags: ["outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: natCid,
    tags: ["hobby"],
    prev: treePostCid
  })
  const dogPostCid = await ipfs.dag.put({
    content: "dogs",
    author: samCid,
    tags: ["funny", "hobby"],
    prev: computerPostCid
  })

  const outdoorTagCid = await ipfs.dag.put({
    tag: "outdoor",
    posts: [ treePostCid ]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [ treePostCid, computerPostCid, dogPostCid ]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [ dogPostCid ]
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
  if (!CID.isCID(node.prev)) {
    return {fail: 'The value of `prev` of the "dogs" blog post needs to be a link.'}
  }

  const dogPostCid = 'zdpuAxe3g8XBLrqbp3NrjaiBLTrXjJ3SJymePGutsRRMrhAKS'
  const computerPostCid = 'zdpuAwwT4kGJxT7mgVZRgvmV3ke8qGNZGLuCgLhJsdBSQGM44'
  const treePostCid = 'zdpuAri55PR9iW239ahcbnfkFU2TVyD5iLmqEFmwY634KZAJV'
  const treePostCidPrevNull = 'zdpuAoNUinwYTMoTR8Wq7945MKSSpAUNGW1d1wkTHhRcchG3D'
  const computerPostCidWhenTreePostCidPrevNull = 'zdpuAsFHXZkpXcjuERjACPp1pAs9J7b4cdYtn9Dv9xBcAGhWV'
  const dogPostCidWhenTreePostCidPrevNull = 'zdpuAkUysBpAE2yvWdLCBbUqXusYVe5kgFSS7YriyeLfA5F5d'
  const nodePrev = node.prev

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
  if (!CID.isCID(computerNode.prev)) {
    return {fail: 'The value of `prev` of the "computers" blog post needs to be a link.'}
  }
  const computerNodePrev = computerNode.prev

  const treeNode = (await ipfs.dag.get(computerNodePrev)).value
  if (treeNode.content === undefined) {
    return {fail: `The "computers" blog post should link to the "trees" blog post.`}
  }
  if (treeNode.content !== 'trees') {
    return {fail: `The "computers" blog post should link to the "trees" blog post, but it links to ${treeNode.content}.`}
  }
  if (('prev' in treeNode) && (treeNode.prev !== null)) {
    return {fail: 'The "trees" blog post shouldn\'t link to other blog posts.'}
  }

  const computerNodePrevCid = computerNodePrev.toBaseEncodedString()
  if (![treePostCid, treePostCidPrevNull].includes(computerNodePrevCid)) {
    return {fail: `The "computers" blog post should link to the "trees" blog post, but it links to ${computerNodePrevCid}.`}
  }

  const nodePrevCid = nodePrev.toBaseEncodedString()
  if (![computerPostCid, computerPostCidWhenTreePostCidPrevNull].includes(nodePrevCid)) {
    return {fail: `The "dogs" blog post should link to the "computers" blog post, but it links to ${nodePrevCid}.`}
  }

  const nodeCid = result.toBaseEncodedString()
  if (nodeCid === dogPostCid || dogPostCidWhenTreePostCidPrevNull) {
    return {success: 'Everything works!'}
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
      validate,
      exercise
    }
  }
}
</script>
