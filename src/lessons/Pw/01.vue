<template>
  <div class="lesson-pw-01">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Create a simple DAG node.">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  // Your code goes here
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  const hash = 'zdpuAvk4Um53YugGaXLJWLjmMnNGyX4JpvtzDS6PK98Sy9XfQ'
  if (result.toBaseEncodedString() === hash) {
    return {success: 'All works!'}
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({hello: 'world!'})
    const got = JSON.stringify(obj.value)
    const fail = `Was expecting "${expected}" but got "${got}"`
    return {fail}
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
