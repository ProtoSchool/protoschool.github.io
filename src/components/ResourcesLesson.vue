<template>
  <Lesson
    :isResources="true"
    :tutorialId="tutorialId"
    :resources="resources"
    />
</template>

<script>
import Lesson from '../components/Lesson'
import tutorialsList from '../static/tutorials.json'

export default {
  components: {
    Lesson
  },
  props: {
    tutorialId: String
  },
  computed: {
    resources: function () {
      return tutorialsList[this.tutorialId].resources
    }
  }
}
</script>
