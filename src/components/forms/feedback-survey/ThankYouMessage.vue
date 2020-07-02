<template>
  <div class="thank-you-message">
    <div v-if="showProfileSurveyLink" class="text" v-html="translations.thankYouMessage.textWithoutPrompt">
    </div>
    <div v-else class="text" v-html="translations.thankYouMessage.textWithPrompt">
    </div>
    <div v-if="!showProfileSurveyLink"
      class="flex justify-end mt4"
    >
        <div v-on:click="onClickToProfileSurvey()">
          <ButtonLink
            text="Go to Survey"
            :link="translations.thankYouMessage.surveyLink"
            external
          />
        </div>
    </div>
  </div>
</template>
<script>
import translations from '../../../static/translations'
import ButtonLink from '../../buttons/ButtonLink.vue'
import settings from '../../../utils/settings'

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
  methods: {
    onClickToProfileSurvey: function () {
      settings.profileSurvey.markComplete()
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
