<template>
  <div class="lesson-02">
  <Lesson v-bind:text="text" v-bind:code="code"
          :validate="validate"
          lessonTitle="Location addressing and the centralized web">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'

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
