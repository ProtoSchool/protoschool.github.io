<template>
  <div class="lesson-01">
    <Lesson v-bind:text="text">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'

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
