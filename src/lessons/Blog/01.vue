<template>
  <div class="lesson-blog-01">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Basic linking">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'
const CID = require('cids')
const shallowEqualArrays = require('shallow-equal/arrays')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})
  const treePostCid = await ipfs.dag.put({content: "trees"})
  const computerPostCid = await ipfs.dag.put({content: "computers"})

  // Your code goes here
}

return run
`

const validateArrayOfCids = (result, size) => {
  if (!Array.isArray(result) || result.length !== size) {
    return {fail: `You need to return an array of ${size} CIDs`}
  }
  const isCids = result.every(CID.isCID)
  if (!isCids) {
    return {fail: `Array elements need to be CIDs`}
  }
  return {success: ''}
}

const findLinks = (data) => {
  const links = []
  for (const [key, value] of Object.entries(data)) {
    if (key === '/') {
      links.push(value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        links.push(...findLinks(item))
      }
    } else if (typeof value === 'object') {
      links.push(...findLinks(value))
    }
  }
  return links
}

const validate = async (result, ipfs) => {
  const natCid = 'zdpuAyB57Xn8fuPvM8Gam5ycJTz6bgzLqtQBihyFuh5T7a6SK'
  const samCid = ' zdpuAzUoWGnKe4p13YbexQrb5AMhnDWDCqJt2XyqVPU6DxS4m'
  const expectedCids = ['zdpuAkSPEnmgR1rqKkzpFN5qfJshCQKqMaVtUSpQJAMLdw3KF',
    'zdpuAxzw762rP3CXZpAsKagPFR2AyqmZU2sN8U1GuVCeoYUEo'].sort()

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
    if (node.author === undefined) {
      return {fail: 'Blog posts need to have an `author` field'}
    }
    const links = findLinks(node)
    if (links.length === 0) {
      return {fail: 'A blog post is missing the link to the author'}
    }
    if (node.author['/'] === undefined) {
      return {fail: 'The value of `author` needs to be a link (`{"/": "some-cid"}`)'}
    } else if (![natCid, samCid].includes(node.author['/'])) {
      return {fail: 'You need to link to the CID of an author (Nat or Sam)'}
    }
  }
  result.sort()
  const resultCids = result.map((cid) => cid.toBaseEncodedString())
  if (shallowEqualArrays(resultCids, expectedCids)) {
    return {success: 'All works!'}
  } else {
    return {fail: `The returned CIDs ${resultCids} did not match the expected CIDs ${expectedCids}. Did you perhaps links to the wrong author?`}
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
