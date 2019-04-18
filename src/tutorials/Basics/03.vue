<template>
  <Lesson
    :text="text"
    :code="code"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    lessonTitle="Read nested data using links">
  </Lesson>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
import exercise from './03-exercise.md'

let code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  let cid2 = await ipfs.dag.put({ bar: cid })
  /* your code goes here */
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  }

  // TODO: validate ipfs.dag.get call

  if (result === 1) {
    return { success: `Great job! You've completed this series of lessons!` }
  } else if (result.value === 1 && result.remainderPath === '') {
    return { fail: 'Just want the `value` of `test`, try again.' }
  } else {
    const got = JSON.stringify(result)

    return { fail: `Was expecting "1" but got "${got}".` }
  }
}

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
  },
  data: () => {
    return { code, text, validate, modules, exercise }
  }
}
</script>
