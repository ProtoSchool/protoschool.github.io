<template>
  <Lesson
    :text="text"
    lessonTitle="Content addressing with cryptographic hashes" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text }
  }
}
</script>
