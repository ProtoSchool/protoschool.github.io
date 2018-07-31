<template>
  <div class="lesson-blog-01">
    <Lesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :exercise="exercise"
            lessonTitle="Basic linking">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'
import exercise from './01-exercise.md'
import utils from './utils.js'
const shallowEqualArrays = require('shallow-equal/arrays')
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})

  // Modify the blog posts below

  const treePostCid = await ipfs.dag.put({content: "trees"})
  const computerPostCid = await ipfs.dag.put({content: "computers"})

  return [treePostCid, computerPostCid]
}

return run
`

// eslint-disable-next-line no-unused-vars
const _solution = `
/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})
  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()}
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()}
  })

  return [treePostCid, computerPostCid]
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  const validatedArray = utils.validateArrayOfCids(result, 2)
  if (validatedArray.fail) {
    return validatedArray
  }
  const natCid = 'zdpuAyB57Xn8fuPvM8Gam5ycJTz6bgzLqtQBihyFuh5T7a6SK'
  const samCid = 'zdpuAzUoWGnKe4p13YbexQrb5AMhnDWDCqJt2XyqVPU6DxS4m'
  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    if (node.author === undefined) {
      return {fail: 'Blog posts need to have an `author` field.'}
    }
    if (node.author['/'] === undefined) {
      return {fail: 'The value of `author` needs to be a link (`{"/": "some-cid"}`).'}
    }
    const nodeAuthor = new CID(node.author['/']).toBaseEncodedString()
    if (![natCid, samCid].includes(nodeAuthor)) {
      return {fail: 'You need to link to the CID of an author (Nat or Sam).'}
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
    if (nodeAuthor !== expectedAuthor) {
      return {fail: `The author of the "${node.content}" blog post (${nodeAuthor}) did not match the the expected author (${expectedAuthor}).`}
    }
  }
  const expectedCids = ['zdpuAkSPEnmgR1rqKkzpFN5qfJshCQKqMaVtUSpQJAMLdw3KF',
    'zdpuAxzw762rP3CXZpAsKagPFR2AyqmZU2sN8U1GuVCeoYUEo']
  const resultCids = result.map((cid) => cid.toBaseEncodedString())
  if (shallowEqualArrays(resultCids.sort(), expectedCids.sort())) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CIDs ${utils.stringify(resultCids)} did not match the expected CIDs ${utils.stringify(expectedCids)}.`}
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
