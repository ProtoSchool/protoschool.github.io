<template>
  <Lesson
    :text="text"
    lessonTitle="Working with a local IPFS node">
  </Lesson>
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
