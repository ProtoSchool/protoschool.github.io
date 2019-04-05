<template>
  <Lesson
    :text="text"
    :validate="validate"
    :exercise="exercise"
    :concepts="concepts"
    lessonTitle="Create a node and return a Content Identifier (CID)">
  </Lesson>
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

  const hash = 'zdpuApm55Qv2zRxb3KKjVUxhQSw2r4a7jeiDV7163yCQnfivy'
  if (result.toBaseEncodedString() === hash) {
    return { success: 'Everything works!' }
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({ test: 1 })
    const got = JSON.stringify(obj.value)

    return { fail: `Was expecting "${expected}" but got "${got}"` }
  }
}

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text, validate, exercise, concepts }
  }
}
</script>
