<template>
  <Lesson
    :isResources="true"
    :tutorialId="tutorial && tutorial.tutorialId"
    :resources="resources"
    />
</template>

<script>
import router from '../router'
import Lesson from '../components/Lesson'
import { getTutorialByUrl } from '../utils/tutorials'

export default {
  components: {
    Lesson
  },
  props: {
    tutorialUrl: String
  },
  computed: {
    tutorial: function () {
      return getTutorialByUrl(this.tutorialUrl)
    },
    resources: function () {
      // If no tutorial was found, redirect to 404 page
      if (!this.tutorial) {
        router.replace({ name: '404' })

        return
      }

      return this.tutorial.resources
    }
  }
}
</script>
