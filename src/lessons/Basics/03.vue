<template>
  <div class="lesson-03">
    <Lesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
            :exercise="exercise"
            lessonTitle="Read nested data using links">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
import exercise from './03-exercise.md'

let code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({test: 1})
  let cid2 = await ipfs.dag.put(
    {bar: {'/': cid.toBaseEncodedString()}}
  )
  /* your code goes here */
}

return run
`
const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  // TODO: validate ipfs.dag.get call

  if (result === 1) {
    return {success: 'Great job, got 1.'}
  }

  if (result.value === 1 && result.remainderPath === '') {
    return {success: `Great job! You've completed this series of lessons!`}
  } else {
    let expected = JSON.stringify({value: 1, remainderPath: ''})
    let got = JSON.stringify(result)
    let fail = `Was expecting "${expected}" but got "${got}".`
    return {fail}
  }
}

let modules = {cids: require('cids')}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      code, text, validate, modules, exercise
    }
  }
}
</script>
