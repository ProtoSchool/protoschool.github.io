<template>
  <Lesson
    :text="text"
    lessonTitle="Resources" />
</template>

<script>
import Lesson from '../components/Lesson'

const obj = {}

// https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components
const requireResource = require.context(
  // The relative path of the folder
  './',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match filenames
  /resources\.md$/
)

requireResource.keys().forEach(fileName => {
  const fileContent = requireResource(fileName)
  obj[fileName] = fileContent
})

export default {
  components: {
    Lesson
  },
  props: {
		folderName: String
  },
  computed: {
    text: function () {
      return obj[`./${this.folderName}/resources.md`]
    }
  }
}
</script>
