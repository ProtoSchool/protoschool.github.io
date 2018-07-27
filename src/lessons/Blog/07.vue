<template>
  <div class="lesson-blog-07">
    <Lesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            lessonTitle="Hop through nodes">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './07.md'
import utils from './utils.js'
const shallowEqualArrays = require('shallow-equal/arrays')
const CID = require('cids')

const code = `/* globals ipfs */
const CID = require('cids')

const traversePosts = async (cid) => {
  // Your code goes here
}

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

  return traversePosts
}

return run`

// eslint-disable-next-line no-unused-vars
const _solution = `
/* globals ipfs */

const CID = require('cids')

const traversePosts = async (cid) => {
  const result = []
  while (cid) {
    result.push(cid)
    const current = await ipfs.dag.get(cid)
    const prev = current.value.prev
    if (prev) {
      cid = new CID(prev['/'])
    } else {
      return result
    }
  }
}

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

  return traversePosts
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (typeof result !== 'function') {
    return {fail: 'Return value needs to be a function.'}
  }

  const dogPostCid = 'zdpuAxe3g8XBLrqbp3NrjaiBLTrXjJ3SJymePGutsRRMrhAKS'
  const computerPostCid = 'zdpuAwwT4kGJxT7mgVZRgvmV3ke8qGNZGLuCgLhJsdBSQGM44'
  const treePostCid = 'zdpuAri55PR9iW239ahcbnfkFU2TVyD5iLmqEFmwY634KZAJV'
  try {
    const returnValue = await result(new CID(dogPostCid))
    if (returnValue === undefined) {
      return {fail: `Your function needs to return 3 CIDs.`}
    }
    if (returnValue.length !== 3) {
      return {fail: `Your function needs to return 3 CIDs.`}
    }
    const isCids = returnValue.every(CID.isCID)
    if (!isCids) {
      return {fail: `Your function needs to return CIDs`}
    }
    const expectedCids = [treePostCid, computerPostCid, dogPostCid]
    const returnedCids = returnValue.map((item) => new CID(item).toBaseEncodedString())
    if (!shallowEqualArrays(returnedCids.sort(), expectedCids.sort())) {
      return {fail: `The CIDs returned by the function ${utils.stringify(returnedCids)} did not match the the expected CIDs ${utils.stringify(expectedCids)}.`}
    }
  } catch (err) {
    return {fail: `Your function threw an error: ${err}.`}
  }
  return {success: 'All works!'}
}

let modules = {cids: require('cids')}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      code,
      text,
      validate,
      modules
    }
  }
}
</script>
