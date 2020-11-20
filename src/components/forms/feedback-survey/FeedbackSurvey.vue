<template>
  <div v-if="isTutorialPassed && (!surveyCompleted || !isProfileSurveyComplete())">
    <FormOptionA
      v-if="option === 'optionA'"
      :initialStep="initialStep"
      :done="done"
      :onAnswer="onAnswer"
    />
    <FormOptionB
      v-if="option === 'optionB'"
      :initialStep="initialStep"
      :done="done"
      :onAnswer="onAnswer"
    />
  </div>
</template>

<script>
import countly from '../../../utils/countly'
import { getTutorialByUrl, getTutorialType, isTutorialPassed } from '../../../utils/tutorials'
import settings from '../../../utils/settings'
import abTesting from '../../../utils/ab-testing'
import FormOptionA from './Form.vue'
import FormOptionB from './option-b/Form.vue'

export default {
  name: 'FeedbackSurvey',
  components: {
    FormOptionA,
    FormOptionB
  },
  computed: {
    option: function () {
      return abTesting.testComponent.apply(this, countly.events.AB_TESTING_TUTORIAL_FEEDBACK_SURVEY)
    },
    tutorial: function () {
      return getTutorialByUrl(this.$route.params.tutorialUrl)
    },
    progress: function () {
      return settings.tutorialFeedbackSurvey.getProgress(this.tutorial.id)
    },
    initialStep: function () {
      return this.progress.lastAnsweredQuestionNumber === -1 ? 0 : this.progress.lastAnsweredQuestionNumber
    },
    isTutorialPassed: function () {
      return isTutorialPassed(this.tutorial)
    },
    surveyCompleted: function () {
      return this.progress.completed
    },
    tutorialType: function () {
      return getTutorialType(this.tutorial.formattedId)
    },
    trackingData: function () {
      const tutorialFeedbackSurveyOption = settings.abTesting.get(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY)

      return {
        path: this.$route.path,
        option: tutorialFeedbackSurveyOption + '-2',
        tutorial: this.tutorial.shortTitle,
        tutorialType: this.tutorialType,
        project: this.tutorial.project
      }
    }
  },
  methods: {
    done: function () {
      countly.trackEvent(countly.events.TUTORIAL_FEEDBACK_SURVEY_COMPLETED, this.trackingData)
    },
    onAnswer: function (question, answer) {
      countly.trackEvent(countly.events.TUTORIAL_FEEDBACK_SURVEY_ANSWER, {
        ...this.trackingData,
        question: question.trackingId,
        answer
      })

      settings.tutorialFeedbackSurvey.saveProgress(this.tutorial.id, question.number, answer)
    },
    isProfileSurveyComplete: function () {
      return settings.profileSurvey.isCompleted()
    }
  }
}
</script>
<style scoped>
</style>
