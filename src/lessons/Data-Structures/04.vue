<template>
  <div class="lesson-04">
  <Lesson v-bind:text="text" v-bind:code="code"
          :validate="validate"
          lessonTitle="Cryptographic hashing and Content Identifiers (CIDs)">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './04.md'

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
