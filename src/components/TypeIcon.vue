<template>
  <CodeIcon v-if="type.icon === 'code'" :alt="type.alt" v-tooltip.top-center="type.alt" />
  <TextIcon v-else-if="type.icon === 'text'" :alt="type.alt" v-tooltip.top-center="type.alt" />
  <MultipleChoiceIcon v-else-if="type.icon === 'multiple-choice'" :alt="type.alt" v-tooltip.top-center="type.alt" />
  <ResourcesIcon v-else-if="type.icon === 'resources'" :alt="type.alt" v-tooltip.top-center="type.alt" />
</template>

<script>
import { getTutorialType, getLessonType } from '../utils/tutorials'
import CodeIcon from '../static/images/icons/code.svg?inline'
import TextIcon from '../static/images/icons/text.svg?inline'
import MultipleChoiceIcon from '../static/images/icons/multiple-choice.svg?inline'
import ResourcesIcon from '../static/images/icons/resources.svg?inline'

export default {
  name: 'TypeIcon',
  components: {
    CodeIcon,
    TextIcon,
    MultipleChoiceIcon,
    ResourcesIcon
  },
  props: {
    tutorialId: {
      type: String,
      required: true
    },
    lessonId: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    type: function () {
      const isLesson = !!this.lessonId
      const type = this.lessonId
        ? getLessonType(this.tutorialId, this.lessonId)
        : getTutorialType(this.tutorialId)

      switch (type) {
        case 'code':
        case 'file-upload':
          return { icon: 'code', alt: 'JavaScript code challenge' + (!isLesson ? 's' : '') }
        case 'multiple-choice':
          return { icon: 'multiple-choice', alt: 'Multiple-choice quiz' + (!isLesson ? 'zes' : '') }
        case 'resources':
          return { icon: 'resources', alt: 'Resource links' }
        default:
          return { icon: 'text', alt: 'Text only' }
      }
    }
  }
}

</script>
