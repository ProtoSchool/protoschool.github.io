<template>
  <Lesson
    :text="text"
    lessonTitle="Merkle trees and Directed Acyclic Graphs (DAG)" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './05.md'

export default {
  components: {
    Lesson
  },
  data: () => {
    return { text }
  }
}
</script>
