<template>
  <div class="lesson-01">
    <Lesson :text="text" :validate="validate"
            :exercise="exercise" :concepts="concepts"
            lessonTitle="Basic write">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'
import concepts from './01-concepts.md'
import exercise from './01-exercise.md'
const CID = require('cids')

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  let hash = 'zdpuApm55Qv2zRxb3KKjVUxhQSw2r4a7jeiDV7163yCQnfivy'
  if (result.toBaseEncodedString() === hash) {
    return {success: 'All works!'}
  } else {
    let obj = await ipfs.dag.get(result)
    let expected = JSON.stringify({test: 1})
    let got = JSON.stringify(obj.value)
    let fail = `Was expecting "${expected}" but got "${got}"`
    return {fail}
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
