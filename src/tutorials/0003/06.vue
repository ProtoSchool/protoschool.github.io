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
import text from './06.md'
import exercise from './06-exercise.md'
import CID from 'cids'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }
  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }
  const node = (await ipfs.dag.get(result)).value
  if (node.content === undefined || node.content !== 'dogs') {
    return { fail: `The returned value should be the CID of the "dogs" blog post.` }
  }
  if (node.prev === undefined) {
    return { fail: 'The "dogs" blog post needs to have a `prev` field.' }
  }
  if (!CID.isCID(node.prev)) {
    return { fail: 'The value of `prev` of the "dogs" blog post needs to be a link.' }
  }

  const dogPostCid = 'bafyreifvq4aykfnxjgqqmjelphadwhzvc4mt6h3mwytj54oa3qakuis3ie'
  const computerPostCid = 'bafyreiflecr42lhn6bpy7friobhurxagp6ml34s5uzazqmwxxpqnouhfne'
  const treePostCid = 'bafyreic5ndfk2yj4vr7pdhk4n435hxr522faalcse2ls4ukzddr7d5qxhi'
  const treePostCidPrevNull = 'bafyreibl2dm2gt7mcgkmlviujca35332oq35tieyhcqaxtmuconjeg4d5q'
  const computerPostCidWhenTreePostCidPrevNull = 'bafyreidfm7qcllrk2n7nbxdoapc52e3hb37sgtcg3fhhx5agto6bk67rcy'
  const dogPostCidWhenTreePostCidPrevNull = 'bafyreiaa5a5haprk3wxxhw36y6p6mk5pnzsitykr77jjpq2tebqw4idggq'
  const nodePrev = node.prev

  const computerNode = (await ipfs.dag.get(nodePrev)).value
  if (computerNode.content === undefined) {
    return { fail: 'The `dogs` blog post should link to the `computers` blog post.' }
  }
  if (computerNode.content !== 'computers') {
    return { fail: `The \`dogs\` blog post should link to the \`computers\` blog post, but it links to ${computerNode.content}.` }
  }
  if (computerNode.prev === undefined) {
    return { fail: 'The `computers` blog post needs to have a `prev` field.' }
  }
  if (!CID.isCID(computerNode.prev)) {
    return { fail: 'The value of `prev` of the `computers` blog post needs to be a link.' }
  }
  const computerNodePrev = computerNode.prev

  const treeNode = (await ipfs.dag.get(computerNodePrev)).value
  if (treeNode.content === undefined) {
    return { fail: 'The `computers` blog post should link to the `trees` blog post.' }
  }
  if (treeNode.content !== 'trees') {
    return { fail: `The \`computers\` blog post should link to the \`trees\` blog post, but it links to ${treeNode.content}.` }
  }
  if (('prev' in treeNode) && (treeNode.prev !== null)) {
    return { fail: 'The `trees` blog post shouldn\'t link to other blog posts.' }
  }

  const computerNodePrevCid = computerNodePrev.toString()
  if (![treePostCid, treePostCidPrevNull].includes(computerNodePrevCid)) {
    return { fail: `The \`computers\` blog post should link to the \`trees\` blog post, but it links to ${computerNodePrevCid}.` }
  }

  const nodePrevCid = nodePrev.toString()
  if (![computerPostCid, computerPostCidWhenTreePostCidPrevNull].includes(nodePrevCid)) {
    return { fail: `The "dogs" blog post should link to the "computers" blog post, but it links to ${nodePrevCid}.` }
  }

  const nodeCid = result.toString()
  if (nodeCid === dogPostCid || dogPostCidWhenTreePostCidPrevNull) {
    return { success: 'Everything works!' }
  } else {
    return { fail: `The returned CID ${nodeCid} did not match the expected CID ${dogPostCid}.` }
  }
}

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({ author: "Nat" })
  const samCid = await ipfs.dag.put({ author: "Sam" })

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
    posts: [treePostCid]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [treePostCid, computerPostCid, dogPostCid]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [dogPostCid]
  })

  return dogPostCid
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
    posts: [treePostCid]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [treePostCid, computerPostCid, dogPostCid]
  })
  const funnyTagCid = await ipfs.dag.put({
    tag: "funny",
    posts: [dogPostCid]
  })

  return dogPostCid
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
