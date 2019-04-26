<template>
  <Lesson
    :text="text"
    lessonTitle="Data structures" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text }
  }
}
</script>
