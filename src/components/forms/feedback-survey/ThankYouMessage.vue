<template>
  <div class="thank-you-message">
    <div v-if="isProfileSurveyComplete()" class="text" v-html="translations.thankYouMessage.textWithoutPrompt">
    </div>
    <div v-else class="text" v-html="translations.thankYouMessage.textWithPrompt">
    </div>
    <div v-if="!isProfileSurveyComplete()"
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
    isProfileSurveyComplete: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    translations: translations.feedbackSurvey
  }),
  methods: {
    onClickToProfileSurvey: function () {
      console.log('in onClickToProfileSurvey')
      // return settings.profileSurvey.markComplete()
      localStorage.setItem('settings/profile-survey/complete', 'true')
      // this is working to set local storage but we currently have no mechanism
      // to make the ThankYouMessage go away afterward
      // if the page reloads itself it's there with the message w/o the prompt
      // and then if I refresh myself it's gone
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
