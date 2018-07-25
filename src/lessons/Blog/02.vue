<template>
  <div class="lesson-blog-02">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Adding tags to the blog posts">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'
const CID = require('cids')
const shallowEqualArrays = require('shallow-equal/arrays')

const code = `/* globals ipfs */

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

return run`

const validateArrayOfCids = (result, size) => {
  if (!Array.isArray(result) || result.length !== size) {
    return {fail: `You need to return an array of ${size} CIDs`}
  }
  const isCids = result.every(CID.isCID)
  if (!isCids) {
    return {fail: `Array elements of the return value need to be CIDs`}
  }
  return {success: ''}
}

const validate = async (result, ipfs) => {
  const expectedCids = ['zdpuAyYnsUYhTSyqGEEsR6nnexB9xoqvHuKU5HPSuzv5G9hcc',
    'zdpuB1TVtawVw5qEJ5SqwMJzhrypaTcM6jyZagdyhP1rSezFQ'].sort()
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  const validatedArray = validateArrayOfCids(result, 2)
  if (validatedArray.fail) {
    return validatedArray
  }
  for (const cid of result) {
    const obj = await ipfs.dag.get(cid)
    const node = obj.value
    console.log('vmx: node:', node)
    console.log('vmx: node.tags:', node.tags === undefined)
    if (node.tags === undefined) {
      return {fail: 'Blog posts need to have a `tags` field'}
    }
    if (!Array.isArray(node.tags)) {
      return {fail: 'The value of the `tags` field must be an Array of strings'}
    }
    const isStrings = node.tags.every((tag) => typeof tag === 'string')
    if (!isStrings) {
      return {fail: `Tags need to be strings`}
    }
    // TODO vmx 2018-07-25: Check if the blog posts have the right tags
  }
  result.sort()
  const resultCids = result.map((cid) => cid.toBaseEncodedString())
  if (shallowEqualArrays(resultCids, expectedCids)) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CIDs ${resultCids} did not match the expected CIDs ${expectedCids}`}
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
