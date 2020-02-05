<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :validate="validate"
    :exercise="exercise"
    :concepts="concepts"
    :solution="solution"
    :code="code" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'
import concepts from './01-concepts.md'
import exercise from './01-exercise.md'
import CID from 'cids'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }

  const hash = 'bafyreicaoyussrycqolu4k2iaxleu2uakjlq57tuxq3djxn4wnyfp4yk3y'
  if (result.toString() === hash) {
    return { success: 'Everything works!' }
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({ test: 1 })
    const got = JSON.stringify(obj.value)

    return { fail: `Your function returned a CID, but it doesn't have the right contents. It looks like you stored the data \`${got}\` instead of \`${expected}\`.` }
  }
}

const solution = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  return cid
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
      concepts,
      exercise,
      solution,
      validate
    }
  }
}
</script>
