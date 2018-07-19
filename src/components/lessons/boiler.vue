<template>
  <div class="lesson-REPLACEME">
    <Lesson v-bind:text="text" v-bind:code="code">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../Lesson'
import text from './REPLACEME.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'Happy Message!'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

// const code = `const run = async () => {}
// return run
// `

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      text, validate//, code
    }
  }
}
</script>
