<template>
  <Lesson
    :text="text"
    lessonTitle="REPLACEME">
  </Lesson>
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
