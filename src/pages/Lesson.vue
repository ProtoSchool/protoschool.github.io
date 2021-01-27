<template>
    <Lesson
        v-if="!!lesson && (!lesson.meta.type || lesson.meta.type === 'text' || lesson.meta.type === 'code')"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :challenge="challenge"
        :validate="logic.validate"
        :code="logic.code"
        :solution="logic.solution"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta.title"
    />
    <FileLesson
        v-else-if="!!lesson && lesson.meta.type === 'file-upload'"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :challenge="challenge"
        :validate="logic.validate"
        :code="logic.code"
        :solution="logic.solution"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta.title"
    />
    <MultipleChoiceLesson
        v-else-if="!!lesson && lesson.meta.type === 'multiple-choice'"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :question="logic.question"
        :choices="logic.choices"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta.title"
    />
</template>

<script>
import { debug } from '../utils/debug'
import head from '../utils/head'
import { getTutorialByUrl } from '../utils/tutorials'
import marked from '../utils/marked'
import Lesson from '../components/Lesson.vue'
import FileLesson from '../components/FileLesson.vue'
import MultipleChoiceLesson from '../components/MultipleChoiceLesson.vue'

export default {
  components: {
    Lesson,
    FileLesson,
    MultipleChoiceLesson
  },
  props: {
    tutorialUrl: String,
    lessonId: String
  },
  methods: {
    loadFile: function (file, { failOnNotFound = true } = {}) {
      let filename
      let fileData

      if (!this.tutorial) {
        return null
      }

      switch (file) {
        case 'concepts':
          filename = `${this.lessonId}-concepts.md`
          break
        case 'challenge':
          filename = `${this.lessonId}-challenge.md`
          break
        case 'js':
          filename = `${this.lessonId}.js`
          break
        case 'md':
        default:
          filename = `${this.lessonId}.md`
      }

      try {
        fileData = require(`../tutorials/${this.tutorial.formattedId}-${this.tutorial.url}/${filename}`)
      } catch (error) {
        const errorMessage = `File "${filename}" not found`

        if (failOnNotFound) {
          console.error(errorMessage)
          console.error(error)
        } else if (debug) {
          // Only log in debug mode since not all files are mandatory
          console.warn(errorMessage)
        }

        // If no markdown file for the lesson was found, then lesson does not exist
        // redirect to 404 page
        if (file === 'md') {
          this.$router.replace({ name: '404' })
        }

        if (failOnNotFound) {
          throw error
        }
      }

      return fileData
    }
  },
  computed: {
    tutorial: function () {
      const tutorial = getTutorialByUrl(this.tutorialUrl)

      // If no tutorial was found, redirect to 404 page
      if (!tutorial) {
        this.$router.replace({ name: '404' })

        return null
      }

      return tutorial
    },
    lesson: function () {
      return this.tutorial && marked(this.loadFile('md'))
    },
    lessonNeedsJsFile: function () {
      return this.lesson && !!this.lesson.meta.type && this.lesson.meta.type !== 'text'
    },
    lessonNeedsChallengeFile: function () {
      return this.lesson && !!this.lesson.meta.type && (
        this.lesson.meta.type === 'code' ||
        this.lesson.meta.type === 'file-upload'
      )
    },
    concepts: function () {
      const concepts = this.loadFile('concepts', { failOnNotFound: false })

      return concepts ? marked(concepts).html : ''
    },
    challenge: function () {
      const challenge = this.lessonNeedsChallengeFile && this.loadFile('challenge')

      return challenge ? marked(challenge).html : ''
    },
    logic: function () {
      let logic = {
        options: {
          overrideErrors: false,
          createTestFile: false,
          createTestTree: false
        }
      }

      if (!this.tutorial || !this.lesson || !this.lessonNeedsJsFile) {
        return logic
      }

      let fileLogic = this.loadFile('js')

      logic = {
        ...logic,
        ...fileLogic.default,
        options: {
          ...logic.options,
          ...fileLogic.default.options
        }
      }

      if (this.lesson.meta.type === 'code') {
        if (!logic.validate) {
          console.warn(`No "validate" function found. Please export a "validate" function from the JavaScript file.`)
        }

        if (!logic.code) {
          console.warn(`No "code" String found. Please export a "code" String from the JavaScript file.`)
        }

        if (!logic.solution) {
          console.warn(`No "solution" String found. Please export a "solution" String from the JavaScript file.`)
        }
      }

      return logic
    }
  },
  head () {
    return this.tutorial && this.lesson && head.dynamic.lessons({ context: this })
  }
}
</script>
