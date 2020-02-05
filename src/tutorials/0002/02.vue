<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :concepts="concepts"
    :solution="solution" />
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

  const correctHash = 'bafyreibmdfd7c5db4kls4ty57zljfhqv36gi43l6txl44pi423wwmeskwy'
  if (result.toString() === correctHash) {
    return { success: 'Everything works!' }
  } else {
    return { fail: `Your function returned a CID, but it doesn't have the right contents. Be sure to \`put\` an object with \`bar\` as the named link and \`cid\` as its value.` }
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
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      exercise,
      code,
      concepts,
      solution,
      validate,
      modules
    }
  }
}
</script>
