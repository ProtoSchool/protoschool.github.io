<template>
  <div>
    <Header/>
    <section class="w-100 mw7 center ph3">
      <h1 class="mt4">ProtoSchool Newsletter</h1>
      <p class="f4 fw5 lh-copy ma0 pv2">Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features.</p>
      <p class="f4 fw5 lh-copy ma0 pv2">Interested in <router-link to="/host">hosting local ProtoSchool workshops</router-link>? Be sure to check the box to receive additional news and guidance for event leaders.</p>
      <NewsletterSubscription
        class="mv4"
        :hideIfAlreadySubscribed="false"
      />
      <p class="f4 fw5 lh-copy ma0 pv2 mb2 mt4">Get news from related projects:</p>
      <ul class="flex flex-wrap justify-center ma0 pa0 mb2">
        <li class="list " v-for="project in newsletters" :key="project.id">
          <a v-on:click="onClickTrack(project)" class="newsletter-link pv3 ph4 db ma1 br3 flex items-center no-underline navy" :href="project.newsletterUrl" target="blank">
            <ProjectIcon
              class="h2 mr3"
              :id="project.id"
            />
            <span class="f4">{{project.name}}</span>
          </a>
        </li>
      </ul>
    </section>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import ProjectIcon from '../components/icons/ProjectIcon'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import NewsletterSubscription from '../components/forms/NewsletterSubscription.vue'
import { getNewsletters } from '../utils/projects'
import countly from '../utils/countly'

export default {
  name: 'News',
  components: {
    Header,
    Footer,
    NewsletterSubscription,
    ProjectIcon
  },
  computed: {
    newsletters: function () {
      return getNewsletters()
    },
    trackingData: function () {
      return {
        path: this.$route.path,
        source: 'News Page'
      }
    }
  },
  methods: {
    onClickTrack: function (project) {
      countly.trackEvent(countly.events.NEWSLETTER_REFERRAL, {
        ...this.trackingData,
        href: project.newsletterUrl,
        project: project.name
      })
    }
  },
  head () {
    return head()
  }
}
</script>
<style scoped>

.newsletter-link {
  outline: none;

  transition:
    background-color var(--transition-default);
}

.newsletter-link span {
  user-select: none;
}

/* States */
.newsletter-link:hover {
  background-color: var(--color-snow-muted);
}

.newsletter-link:active {
  background-color: var(--color-snow);
}

@media screen and (max-width: 640px) {
  .newsletter-link {
    background-color: var(--color-snow-muted);
  }
}
</style>
