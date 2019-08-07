<template>
  <Lesson
    :text="text"
    :validate="validate"
    :exercise="exercise"
    :solution="solution"
    lessonTitle="Another excercise lesson without concepts">
  </Lesson>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './06.md'
import exercise from './05-exercise.md'
import CID from 'cids'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  if (!CID.isCID(result)) {
    return { fail: 'Did not return a valid CID instance.' }
  }

  const hash = 'bafyreicaoyussrycqolu4k2iaxleu2uakjlq57tuxq3djxn4wnyfp4yk3y'
  if (result.toBaseEncodedString() === hash) {
    return { success: 'Everything works!' }
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({ test: 1 })
    const got = JSON.stringify(obj.value)

    return { fail: `Was expecting \`${expected}\` but got \`${got}\`.` }
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
  data: () => {
    return { text, validate, exercise, solution }
  }
}
</script>
