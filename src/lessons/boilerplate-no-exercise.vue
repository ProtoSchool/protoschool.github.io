<template>
  <div class="lesson-REPLACEME">
    <Lesson v-bind:text="text"
            lessonTitle="REPLACEME">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './REPLACEME.md'

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
