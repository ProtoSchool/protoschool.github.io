<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :code="code"
    :validate="validate"
    :exercise="exercise"
    :solution="solution" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
import exercise from './03-exercise.md'
import utils from './utils.js'
import shallowEqualArrays from 'shallow-equal/arrays'
import CID from 'cids'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }
  const validatedArray = utils.validateArrayOfCids(result, 2)
  if (validatedArray.fail) {
    return validatedArray
  }
  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    if (node.tag === undefined) {
      return { fail: 'Tag nodes need to have a `tag` field.' }
    }
    if (typeof node.tag !== 'string') {
      return { fail: '`tag` field needs to be a string.' }
    }
    if (node.posts === undefined) {
      return { fail: 'Tag nodes need to have a `posts` field.' }
    }
    if (!Array.isArray(node.posts)) {
      return { fail: 'The value of the `posts` field must be an array of links.' }
    }
    const isLinks = node.posts.every((post) => CID.isCID(post))
    if (!isLinks) {
      return { fail: 'The values of the `posts` array must be links.' }
    }

    const treePostCid = 'bafyreic5ndfk2yj4vr7pdhk4n435hxr522faalcse2ls4ukzddr7d5qxhi'
    const computerPostCid = 'bafyreicmrzqpsebu5or7zjeffvnc3g76khmyzdo3q64i7ylvekxgcyqszq'
    let expectedPosts
    switch (node.tag) {
      case 'hobby':
        expectedPosts = [treePostCid, computerPostCid]
        break
      case 'outdoor':
        expectedPosts = [treePostCid]
        break
      default:
        return { fail: `Wrong tag (${node.tag}). Did you mean \`hobby\` or \`outdoor\`?` }
    }
    const nodePosts = node.posts.map(post => post.toString())
    if (!shallowEqualArrays(nodePosts.sort(), expectedPosts.sort())) {
      return { fail: `The posts of the tag \`${node.tag}\` ${utils.stringify(nodePosts)} did not match the the expected posts ${utils.stringify(expectedPosts)}.` }
    }
  }

  // Don't check the CIDs as then the order of the links within the tags would
  // matter. But that order really doesn't matter.
  return { success: 'Everything works!' }
}

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({ author: "Nat" })
  const samCid = await ipfs.dag.put({ author: "Sam" })
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

  // Add your code here
}

return run
`

const solution = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({ author: "Nat" })
  const samCid = await ipfs.dag.put({ author: "Sam" })
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

  const outdoorTagCid = await ipfs.dag.put({
    tag: "outdoor",
    posts: [treePostCid]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [treePostCid, computerPostCid]
  })

  return [outdoorTagCid, hobbyTagCid]
}

return run
`

export default {
  components: {
    Lesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      exercise,
      code,
      solution,
      validate
    }
  }
}
</script>
