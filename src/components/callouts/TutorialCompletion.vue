<template>
  <div class="bg-aqua-muted navy pa4 flex f4 br2">
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
      >
        <span class="f5 pr2">Share on Twitter</span>
        <img src="../../static/images/icons/twitter.svg" class="dib h1 w1 navy-muted" alt="twitter" />
      </a>
    </div>
  </div>
</template>
<script>
import { getTutorialFullUrl } from '../../utils/tutorials'

export default {
  props: {
    tutorial: Object
  },
  computed: {
    twitterShareLink: function () {
      let href = 'https://twitter.com/intent/tweet?'
      href += `text=I just completed the ${this.tutorial.title} tutorial at @ProtoSchool!`
      href += `&url=${encodeURIComponent(getTutorialFullUrl(this.tutorial.formattedId))}`
      href += `&hashtags=${this.tutorial.project.twitterHashtag}`

      return href
    }
  }
}
</script>
<style scoped>
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
