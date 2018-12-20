<template>
  <div class="lesson-03">
  <Lesson v-bind:text="text" v-bind:code="code"
          :validate="validate"
          lessonTitle="Content addressing with cryptographic hashes">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      text
    }
  }
}
</script>
