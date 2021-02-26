<template>
  <BaseModal
    :show="true"
    :onClose="onStay"
    :title="translations.title"
    data-cy="mobile-warning-modal"
  >
    <p class="f4 measure lh-copy">{{translations.body._1}}</p>
    <p class="f4 measure lh-copy">{{translations.body._2}}</p>
    <p class="f4 measure lh-copy">{{translations.body._3}}</p>
    <p class="f4 measure lh-copy">{{translations.body._4}}</p>

    <div class="buttons mt4">
      <ButtonLink
        class="mr3"
        :onClick="this.resume ? onStay : onResume"
        :text="translations.actions.codeFree"
        to="/tutorials?code=false"
        :data-cy="mobile-warning-modal-code-free"
      />
    </div>
  </BaseModal>
</template>

<script>
// import { getTutorialType } from '../../utils/tutorials'
// import { debugLog } from '../../utils/debug'
// import countly from '../../utils/countly'
import translations from '../../static/translations'
import ButtonLink from '../buttons/ButtonLink'
import BaseModal from './BaseModal'

// const debugGroup = '[modals/MobileWarningModal]'

export default {
  name: 'MobileWarningModal',
  components: {
    ButtonLink,
    BaseModal
  },
  props: {
    tutorial: Object,
    lesson: Object
  },
  computed: {
    translations: function () {
      return translations.modals.mobileWarning
    }
    // trackingData: function () {
    //   return {
    //     tutorial: this.tutorial.shortTitle,
    //     path: this.$route.path,
    //     lessonType: this.lesson.type,
    //     tutorialType: getTutorialType(this.tutorial.formattedId)
    //   }
    // }
  }
  // methods: {
  //   trackEvent (action) {
  //     countly.trackEvent(countly.events.MOBILE_WARNING_MODAL_ACTION, {
  //       ...this.trackingData,
  //       action
  //     })
  //   },
  //   onStay () {
  //     // this.trackEvent('stay')
  //   },
  //   onCodeFree () {
  //     // this.trackEvent('codeFree')
  //   }
  // }
}
</script>
<style scoped>
.buttons {
  display: flex;
  justify-content: flex-end;
}

@media only screen and (max-width: 24rem) {
  .buttons {
    justify-content: center;
  }
}
</style>
