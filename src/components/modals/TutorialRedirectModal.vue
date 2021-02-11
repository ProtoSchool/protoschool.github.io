<template>
  <BaseModal
    :show="show"
    :onClose="onStay"
    :title="translations.title"
    data-cy="tutorial-redirect-modal"
  >
    <p class="f4 measure lh-copy">{{body._1}}<span class="fw7">{{tutorial.title}}</span>{{body._2}}<span class="fw7">{{lesson.title}}</span>{{body._3}}</p>
    <div class="buttons mt4">
      <ButtonLink
        class="mr3"
        :onClick="this.resume ? onStay : onResume"
        :text="suggestedAction"
        :to="suggestedPath"
        :data-cy="`tutorial-redirect-modal-action-${this.resume ? 'resume' : 'start'}`"
      />
      <Button
        :click="onStay"
        :text="translations.actions.stay"
        data-cy="tutorial-redirect-modal-view-lesson"
      />
    </div>
  </BaseModal>
</template>

<script>
import { tutorialRedirectModal } from '../../config'
import { isLessonPassed, getTutorialType } from '../../utils/tutorials'
import { debugLog } from '../../utils/debug'
import countly from '../../utils/countly'
import translations from '../../static/translations'
import Button from '../buttons/Button'
import ButtonLink from '../buttons/ButtonLink'
import BaseModal from './BaseModal'

const debugGroup = '[modals/TutorialRedirectModal]'

export default {
  name: 'TutorialRedirectModal',
  components: {
    Button,
    ButtonLink,
    BaseModal
  },
  props: {
    tutorial: Object,
    lesson: Object
  },
  computed: {
    resume: function () {
      return (
        this.show &&
        this.lesson.id > 1 && // is not first lesson
        isLessonPassed(this.tutorial, this.tutorial.lessons[0]) && // first lesson passed
        !isLessonPassed(this.tutorial, this.tutorial.lessons[this.lesson.id - 2])) // lesson prior to this one not passed
    },
    translations: function () {
      return translations.modals.tutorialRedirect
    },
    body: function () {
      return this.resume ? this.translations.body.resume : this.translations.body.start
    },
    suggestedAction: function () {
      return this.resume ? this.translations.actions.resume : this.translations.actions.start
    },
    suggestedPath: function () {
      let nextLessonIndex = this.tutorial.lessons.findIndex((lesson) => !isLessonPassed(this.tutorial, lesson))

      return this.resume ? this.tutorial.lessons[nextLessonIndex].url : `/${this.tutorial.url}/01`
    },
    trackingData: function () {
      return {
        tutorial: this.tutorial.shortTitle,
        path: this.$route.path,
        lessonType: this.lesson.type,
        tutorialType: getTutorialType(this.tutorial.formattedId),
        project: this.tutorial.project.name,
        referrer: typeof document !== 'undefined' && document.referrer
      }
    }
  },
  data: function () {
    // For debug only
    const _forceShowRedirectModal = this.$route.query._forceShowRedirectModal === 'true'

    const conditionstoShow = [
      {
        show: typeof document !== 'undefined' && !!document.referrer,
        log: `referrer is not defined: document.referrer=${document.referrer}` },
      {
        show: tutorialRedirectModal.referrer.SEARCH_ENGINES.some(searchEngine => document.referrer.includes(searchEngine.url)),
        log: 'referrer isn\'t one of the configured search engines'
      },
      {
        show: this.lesson.id !== 1,
        log: `lesson is the first: lesson.id=${this.lesson.id}`
      },
      {
        show: this.lesson.type !== 'resources',
        log: 'lesson is resources'
      },
      {
        show: !isLessonPassed(this.tutorial, this.lesson),
        log: 'lesson has been passed'
      },
      {
        show: !this.$root.$data.state.modals.tutorialRedirect.shown,
        log: 'modal has been shown already'
      }
    ]

    if (this.lesson.id > 1) {
      conditionstoShow.push({
        show: !isLessonPassed(this.tutorial, this.tutorial.lessons[this.lesson.id - 2]),
        log: 'previous lesson has been passed'
      })
    }

    if (!conditionstoShow.some(reason => !reason.show)) {
      this.$root.$data.state.modals.tutorialRedirect.shown = true
    } else {
      debugLog(debugGroup, '## reasons for not showing modal:')
      conditionstoShow.forEach(reason => {
        !reason.show &&
          debugLog(debugGroup, `## ${reason.log}`)
      })
    }

    return {
      show: _forceShowRedirectModal ||
        !conditionstoShow.some(reason => !reason.show)
    }
  },
  methods: {
    trackEvent (action) {
      countly.trackEvent(countly.events.TUTORIAL_MODAL_REDIRECT_ACTION, {
        ...this.trackingData,
        action
      })
    },
    onStay () {
      this.trackEvent('stay')
      this.show = false
    },
    onStart () {
      this.trackEvent('start')
      this.show = false
    },
    onResume () {
      this.trackEvent('resume')
      this.show = false
    }
  },
  mounted () {
    !this.$route.query._forceShowRedirectModal &&
      debugLog(
        debugGroup,
        'to force redirect modal to show, add _forceShowRedirectModal=true query parameter to the URL.'
      )
  }
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
