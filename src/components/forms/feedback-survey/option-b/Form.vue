<template>
  <transition
    name="state-view-transition"
  >
    <div
      v-if="!dismissed"
      data-state-view-active="true"
      data-state-view-transition-function="slide"
      class="form content-banner flex flex-column state-view"
    >
      <transition
        name="state-view-transition"
        mode="out-in"
      >
        <h2
          key="initial-title"
          class="state-view mt0 mb0"
          v-if="currentStep < maximumStep"
          :data-state-view-active="currentStep < maximumStep"
          data-state-view-transition-function="slide"
          data-state-view-transition-delay-leave="default"
        >
          {{translations.form.title}}
        </h2>
        <h2
          key="thank-you"
          class="state-view mt0 mb0"
          v-if="currentStep === maximumStep"
          :data-state-view-active="currentStep === maximumStep"
          data-state-view-transition-function="slide"
        >
          {{translations.thankYouMessage.title}}
        </h2>
      </transition>
      <transition
        name="state-view-transition"
        mode="out-in"
      >
        <div
          class="questions state-view mt3"
          v-if="currentStep < maximumStep"
          :data-state-view-active="currentStep < maximumStep"
          data-state-view-transition-function="slide"
          data-state-view-transition-delay-leave="default"
        >
          <Question
            class="mt4 question"
            v-for="(question, index) in questions"
            :key="question.text"
            :question="question"
            :onSelect="answerNumber => onSelect(question, answerNumber)"
            :answerSelected="answers[index]"
          />
        </div>
        <ThankYouMessage
          class="state-view"
          v-if="currentStep === maximumStep"
          :data-state-view-active="currentStep === maximumStep"
          key="thank-you"
          :showProfileSurveyLink="!isProfileSurveyComplete()"
        />
      </transition>
      <button
        class="close"
        title="Dismiss survey"
        v-on:click="onDismiss"
        aria-label="Dismiss survey"
      >
        <img src="../../../../static/images/close.svg" />
      </button>
    </div>
  </transition>
</template>
<script>
import translations from '../../../../static/translations'
import countly from '../../../../utils/countly'
import { getTutorialByUrl } from '../../../../utils/tutorials'
import settings from '../../../../utils/settings'
import Question from '../Question.vue'
import ThankYouMessage from '../ThankYouMessage.vue'

export default {
  name: 'Form',
  components: {
    Question,
    ThankYouMessage
  },
  props: {
    initialStep: {
      type: Number,
      default: 0
    },
    done: {
      type: Function,
      required: true
    },
    onAnswer: {
      type: Function,
      required: true
    }
  },
  data: self => ({
    translations: translations.feedbackSurvey,
    questions: translations.feedbackSurvey.form.questions,
    currentStep: self.initialStep,
    maximumStep: translations.feedbackSurvey.form.questions.length,
    dismissed: false
  }),
  computed: {
    tutorial: function () {
      return getTutorialByUrl(this.$route.params.tutorialUrl)
    },
    answers: function () {
      return settings.tutorialFeedbackSurvey.getProgress(this.tutorial.id).answers
    },
    trackingData: function () {
      const tutorialFeedbackSurveyOption = settings.abTesting.get(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY)

      return {
        path: this.$route.path,
        option: tutorialFeedbackSurveyOption
      }
    }
  },
  methods: {
    onSelect: function (question, selectedAnswer) {
      this.onAnswer({ ...question, number: this.currentStep + 1 }, selectedAnswer)
      this.currentStep += 1

      if (this.maximumStep === this.currentStep) {
        this.done()
      }
    },
    onDismiss: function () {
      countly.trackEvent(countly.events.TUTORIAL_FEEDBACK_SURVEY_DISMISSED, {
        ...this.trackingData,
        numberOfQuestionsAnswered: this.currentStep === -1 ? 0 : this.currentStep,
        surveyCompleted: this.currentStep === this.maximumStep
      })

      this.dismissed = true
    },
    isProfileSurveyComplete: function () {
      return settings.profileSurvey.isCompleted()
    }
  }
}
</script>
<style scoped>
.form {
  position: relative;
}

.steps-tracker {
  width: 15.625rem;
  max-width: 100%;
}

.question {
  transition: opacity var(--transition-default) var(--transition-duration-default);
}

.question[data-selected="true"] {
  pointer-events: none;
  opacity: 0.5;
}

button.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  transform: scale(0.95);

  padding: 0.5rem;
  background: none;
  border: none;
  line-height: 0;
  -webkit-tap-highlight-color: transparent; /* hide tap highlight on webkit browers */

  cursor: pointer;

  transition:
    transform var(--transition-default),
    opacity var(--transition-default);
}

button.close:hover,
button.close:focus,
button.close:active {
  opacity: 1;
  transform: scale(1);
}

button.close:active {
  transform: scale(0.95);
}

button.close {
  opacity: 0.2;
}
</style>
