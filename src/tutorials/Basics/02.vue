<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :concepts="concepts"
    :solution="solution"
    lessonTitle="Create a new node that's linked to an old one">
  </Lesson>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'
import concepts from './02-concepts.md'
import exercise from './02-exercise.md'
import CID from 'cids'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }

  const hash = 'bafyreibmdfd7c5db4kls4ty57zljfhqv36gi43l6txl44pi423wwmeskwy'
  if (result.toBaseEncodedString() === hash) {
    return { success: 'Everything works!' }
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({ bar: new CID(hash) })
    const got = JSON.stringify(obj.value)

    return { fail: `Was expecting \`${expected}\` but got \`${got}\`.` }
  }
}

const code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  // your code goes here
}

return run
`

const solution = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  let cid2 = await ipfs.dag.put({ bar: cid })
  return cid2
}

return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
  },
  data: () => {
    return { code, text, validate, modules, exercise, concepts, solution }
  }
}
</script>
