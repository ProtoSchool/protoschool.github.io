<template>
  <div class="thank-you-message">
    <div class="text" v-html="translations.thankYouMessage.text">
    </div>
    <div
      class="flex justify-end mt4"
    >
        <ButtonLink
          text="Go to Survey"
          :link="translations.thankYouMessage.surveyLink"
          external
        />
    </div>
  </div>
</template>
<script>
import translations from '../../../static/translations'
import ButtonLink from '../../buttons/ButtonLink.vue'

export default {
  name: 'ThankYouMessage',
  components: {
    ButtonLink
  },
  data: () => ({
    translations: translations.feedbackSurvey
  })
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
