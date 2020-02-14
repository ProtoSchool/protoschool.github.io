import shallowEqualArrays from 'shallow-equal/arrays'
import CID from 'cids'

import utils from './utils.js'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }
  const validatedArray = utils.validateArrayOfCids(result, 2)
  if (validatedArray.fail) {
    return validatedArray
  }
  const natCid = 'bafyreif5pgrqzisqx2uqffd4dfbao7lf5vcgkvernetj7nitapesoyouha'
  const samCid = 'bafyreigq4aqwo7fisdgkwxao6r6jdcw6pjvqkgeaadwsc2mgzvybuoa4sy'
  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    if (node.author === undefined) {
      return { fail: 'Blog posts need to have an `author` field.' }
    }
    if (!CID.isCID(node.author)) {
      return { fail: 'The value of `author` needs to be a link (`{"/": "some-cid"}`).' }
    }
    const nodeAuthor = node.author
    if (![natCid, samCid].includes(nodeAuthor.toString())) {
      return { fail: 'You need to link to the CID of an author (Nat or Sam).' }
    }
    let expectedAuthor
    switch (node.content) {
      case 'trees':
        expectedAuthor = samCid
        break
      case 'computers':
        expectedAuthor = natCid
        break
    }
    if (nodeAuthor.toString() !== expectedAuthor) {
      return { fail: `The author of the \`${node.content}\` blog post (${nodeAuthor}) did not match the the expected author (${expectedAuthor}).` }
    }
  }
  const expectedCids = ['bafyreiaahxu4lot4ffzaxnz626kxipxt3lm43lsszcc4q6vydqrwnu7kpi', 'bafyreif24ddeqipektksc2jqhulgefwvhwhpylpkmjsdysxygllyeydwqq']
  const resultCids = result.map((cid) => cid.toString())
  if (shallowEqualArrays(resultCids.sort(), expectedCids.sort())) {
    return { success: 'Everything works!' }
  } else {
    return { fail: `The returned CIDs \`${utils.stringify(resultCids)}\` did not match the expected CIDs \`${utils.stringify(expectedCids)}\`.` }
  }
}

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({ author: "Nat" })
  const samCid = await ipfs.dag.put({ author: "Sam" })

  // Modify the blog posts below
  const treePostCid = await ipfs.dag.put({ content: "trees" })
  const computerPostCid = await ipfs.dag.put({ content: "computers" })

  return [treePostCid, computerPostCid]
}

return run
`

const solution = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({ author: "Nat" })
  const samCid = await ipfs.dag.put({ author: "Sam" })

  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: samCid
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: natCid
  })

  return [treePostCid, computerPostCid]
}

return run
`

export default {
  validate,
  code,
  solution
}
