<template>
  <div class="thank-you-message">
    <div class="text" v-html="translations.thankYouMessage.text">
    </div>
    <!-- TODO: show button when survey is available -->
    <div
      v-if="false"
      class="flex justify-end mt4"
    >
        <Button
          link="Tutorials"
          text="Go to Survey"
        />
    </div>
  </div>
</template>
<script>
import translations from '../../../static/translations'
import Button from '../../buttons/Button.vue'

export default {
  name: 'ThankYouMessage',
  components: {
    Button
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
