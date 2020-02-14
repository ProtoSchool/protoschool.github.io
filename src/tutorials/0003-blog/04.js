import shallowEqualArrays from 'shallow-equal/arrays'
import CID from 'cids'

import utils from './utils.js'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }
  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }
  const node = (await ipfs.dag.get(result)).value
  if (node.content === undefined) {
    return { fail: 'Blog post needs to have a `content` field.' }
  }
  if (node.content !== 'dogs') {
    return { fail: 'The `content` of the new blog post must be `dogs`.' }
  }
  if (node.author === undefined) {
    return { fail: 'Blog post needs to have an `author` field.' }
  }
  if (!CID.isCID(node.author)) {
    return { fail: 'The value of `author` needs to be a link.' }
  }
  const samCid = 'bafyreigq4aqwo7fisdgkwxao6r6jdcw6pjvqkgeaadwsc2mgzvybuoa4sy'
  const nodeAuthor = node.author.toString()
  if (nodeAuthor !== samCid) {
    return { fail: 'The author of the new blog post needs to be `Sam`.' }
  }
  if (node.tags === undefined) {
    return { fail: 'Blog post needs to have a `tags` field.' }
  }
  if (!Array.isArray(node.tags)) {
    return { fail: 'The value of the `tags` field must be an array of strings.' }
  }
  const isStrings = node.tags.every((tag) => typeof tag === 'string')
  if (!isStrings) {
    return { fail: 'Tags need to be strings.' }
  }
  let expectedTags = ['funny', 'hobby']
  if (!shallowEqualArrays(node.tags.sort(), expectedTags.sort())) {
    return { fail: `The tags of the \`${node.content}\` blog post ${utils.stringify(node.tags)} did not match the the expected tags ${utils.stringify(expectedTags)}.` }
  }

  // Don't check the CID as then the order of the links within the tags would
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

  const outdoorTagCid = await ipfs.dag.put({
    tag: "outdoor",
    posts: [treePostCid]
  })
  const hobbyTagCid = await ipfs.dag.put({
    tag: "hobby",
    posts: [treePostCid, computerPostCid]
  })
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
    posts: [treePostCid, computerPostCid]
  })

  return dogPostCid
}

return run
`

export default {
  validate,
  code,
  solution
}
