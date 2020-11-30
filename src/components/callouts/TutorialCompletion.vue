<template>
  <transition
    name="state-view-transition"
  >
    <div
      v-if="!dismissed"
      data-state-view-active="true"
      data-state-view-transition-function="slide"
      class="tutorial-completion state-view bg-aqua-muted navy pa4 flex f4 br2"
    >
      <img src="../../static/images/complete.svg" class="w2 h2 mr3" alt="complete" />
      <div class="flex items-start flex-column">
        <div class="lh-title">
          Congratulations on completing the <span class="b">{{tutorial.title}}</span> tutorial!
        </div>
        <a
          :href="twitterShareLink"
          target="_blank"
          class="twitter-share-link no-underline b navy-muted hover-white inline-flex items-center mt2 pv2 tc br2 link"
          title="Twitter"
          v-on:click="twitterShareLinkClick"
        >
          <span class="f5 pr2">Share on Twitter</span>
          <img src="../../static/images/icons/twitter.svg" class="dib h1 w1 navy-muted" alt="twitter" />
        </a>
      </div>
      <ButtonClose
        title="Dismiss message"
        :onDismiss="dismiss"
      />
    </div>
  </transition>
</template>
<script>
import ButtonClose from '../buttons/ButtonClose'
import { getTutorialFullUrl, getTutorialType } from '../../utils/tutorials'
import settings from '../../utils/settings'
import countly from '../../utils/countly'

export default {
  components: {
    ButtonClose
  },
  props: {
    tutorial: Object
  },
  data: function () {
    return {
      dismissed: settings.tutorialCompletionCallout.isDismissed(this.tutorial.id)
    }
  },
  computed: {
    trackingData: function () {
      return {
        tutorial: this.tutorial.shortTitle,
        lessonNumber: 'resources',
        path: this.$route.path,
        tutorialType: getTutorialType(this.tutorial.formattedId),
        project: this.tutorial.project.name
      }
    },
    twitterShareLink: function () {
      let href = 'https://twitter.com/intent/tweet?'
      href += `text=I just completed the ${this.tutorial.title} tutorial at @ProtoSchool!`
      href += `&url=${encodeURIComponent(getTutorialFullUrl(this.tutorial.formattedId))}`
      href += `&hashtags=${this.tutorial.project.twitterHashtag}`

      return href
    }
  },
  methods: {
    dismiss () {
      this.dismissed = true
      settings.tutorialCompletionCallout.dismissed(this.tutorial.id)
    },
    twitterShareLinkClick () {
      countly.trackEvent(countly.events.TWITTER_SHARE_TUTORIAL_PASSED, this.trackingData)
      this.dismiss()
    },
    isDismissed: function () {
      this.dismissed = settings.tutorialCompletionCallout.isDismissed(this.tutorial.id)
    }
  }
}
</script>
<style scoped>
.tutorial-completion {
  position: relative;
}

a.twitter-share-link img {
  transition: filter .15s ease-in;
}

a.twitter-share-link:hover img,
a.twitter-share-link:active img,
a.twitter-share-link:focus img,
a.twitter-share-link:visited img {
  filter: brightness(0) invert(1);
}
</style>
