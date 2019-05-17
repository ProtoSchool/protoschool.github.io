<template>
  <Lesson
    :isResources="true"
    :text="text"
    lessonTitle="Resources" />
</template>

<script>
import Lesson from '../components/Lesson'
import tutorialsList from '../static/tutorials.json'

const constructText = ({ initialDesc, bullets, finalDesc}) => `
${initialDesc}

${bullets.map(e => `
- [${e.title}](${e.link})
`)}

${finalDesc}
`

export default {
  components: {
    Lesson
  },
  props: {
    tutorialId: String
  },
  computed: {
    text: function () {
      const resources = tutorialsList[this.tutorialId].resources
      return constructText(resources)
    }
  }
}
</script>
