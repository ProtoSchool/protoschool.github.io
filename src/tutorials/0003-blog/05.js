import shallowEqualArrays from 'shallow-equal/arrays'
import CID from 'cids'

import utils from './utils.js'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  const validatedArray = utils.validateArrayOfCids(result, 3)
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

    let expectedPosts
    const treePostCid = 'bafyreic5ndfk2yj4vr7pdhk4n435hxr522faalcse2ls4ukzddr7d5qxhi'
    const computerPostCid = 'bafyreicmrzqpsebu5or7zjeffvnc3g76khmyzdo3q64i7ylvekxgcyqszq'
    const dogPostCid = 'bafyreieifpyb4ayum62wvgnibargbgu6cedy72vk7sjla2hp4aupk7b5t4'
    switch (node.tag) {
      case 'funny':
        expectedPosts = [dogPostCid]
        break
      case 'hobby':
        expectedPosts = [treePostCid, computerPostCid, dogPostCid]
        break
      case 'outdoor':
        expectedPosts = [treePostCid]
        break
      default:
        return { fail: `Wrong tag (${node.tag}). Did you mean one of funny, hobby, outdoor?` }
    }
    const nodePosts = node.posts.map(post => post.toString())
    if (!shallowEqualArrays(nodePosts.sort(), expectedPosts.sort())) {
      return { fail: `The posts of the tag \`${node.tag}\` ${utils.stringify(nodePosts)} did not match the the expected posts ${utils.stringify(expectedPosts)}.` }
    }
  }

  // Don't check the CIDs as then the order of the links would matter.
  // But that order really doesn't matter.
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
    posts: [treePostCid, computerPostCid]
  })

  // Add your new code here and modify the tags above
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

  return [outdoorTagCid, hobbyTagCid, funnyTagCid]
}

return run
`

export default {
  validate,
  code,
  solution
}
