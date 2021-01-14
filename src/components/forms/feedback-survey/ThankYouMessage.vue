<template>
  <div class="thank-you-message">
    <div v-if="!showProfileSurveyLink" class="text" v-html="translations.thankYouMessage.textWithoutPrompt">
    </div>
    <div v-else class="text" v-html="translations.thankYouMessage.textWithPrompt">
    </div>
    <div v-if="showProfileSurveyLink"
      class="flex justify-end mt4"
    >
      <ButtonLink
        text="Take the Survey"
        :link="translations.thankYouMessage.surveyLink"
        external
        :onClick="onClickToProfileSurvey"
      />
    </div>
  </div>
</template>
<script>
import countly from '../../../utils/countly'
import translations from '../../../static/translations'
import settings from '../../../utils/settings'
import { getTutorialByUrl } from '../../../utils/tutorials'
import ButtonLink from '../../buttons/ButtonLink.vue'

export default {
  name: 'ThankYouMessage',
  components: {
    ButtonLink
  },
  props: {
    showProfileSurveyLink: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    translations: translations.feedbackSurvey
  }),
  computed: {
    tutorial: function () {
      return getTutorialByUrl(this.$route.params.tutorialUrl)
    },
    trackingData: function () {
      return {
        tutorial: this.tutorial.shortTitle,
        path: this.$route.path
      }
    }
  },
  methods: {
    onClickToProfileSurvey: function () {
      settings.profileSurvey.markComplete()

      countly.trackEvent(countly.events.PROFILE_SURVEY_CLICK, this.trackingData)
    }
  }
}
</script>
<style scoped>
h2 {
  margin-top: 0;
}

.text {
  white-space: pre-line;
}
</style>
