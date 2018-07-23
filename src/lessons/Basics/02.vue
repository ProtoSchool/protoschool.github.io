<template>
  <div class="lesson-02">
    <Lesson v-bind:text="text" v-bind:code="code"
            validate="validate"
            lessonTitle="Basics: Next Lesson">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'

let code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({test: 1})
  // your code goes here
}

return run

`

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      code, text, validate: () => {}
    }
  }
}
</script>
