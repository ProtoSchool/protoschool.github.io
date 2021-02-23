<template>
  <nav class="bg-aqua">
    <!-- STANDARD NAV -->
    <div class="dn db-ns center mw7 pv3 ph3">
      <!-- If in tutorial (breadcrumbs) -->
      <div v-if="tutorial && (hidden !== true)" class="link-list flex overflow-auto items-center bg-aqua navy f5 fw6 center tc mw7">
        <router-link class="nav-link navy" to="/tutorials">Tutorials</router-link>
        <span class="fw4">></span>
        <router-link data-cy="tutorial-landing-link" class="nav-link navy" :to="tutorialLanding">{{tutorial.shortTitle}}</router-link>
      </div>
      <!-- standard nav  -->
      <div v-else class="link-list dn flex overflow-auto items-center bg-aqua white tc mw7">
        <router-link
          v-for="(link, idx) in links" :key="`desktop-${idx}`"
          :class="[isActive(link) ? 'white' : 'navy ', 'nav-link']" :to="`${link.path}`"
        >
          {{link.text}}
        </router-link>
      </div>
    </div>

    <!-- MOBILE NAV -->
    <div class="db dn-ns">
      <div class="flex items-center bg-aqua ph3 pv3 w-100">
        <!-- If in lesson (breadcrumbs) -->
        <div v-if="tutorial" class="flex-auto link fw5 f5 db bb border-aqua navy">
          <router-link class="nav-link navy" to="/tutorials">Tutorials</router-link>
          <span class="fw4"> > </span>
          <router-link class="nav-link navy" :to="tutorialLanding">{{tutorial.shortTitle}}</router-link>
        </div>
        <!-- standard nav  -->
        <div v-else class="flex-auto link fw6 f5 db bb border-aqua">{{currentPage}}</div>
        <button @click="toggleHamburger" class="menu-toggle button-reset bg-transparent b--transparent">
          <BurgerIcon v-if="isHamburgerClosed" alt="open navigation menu" />
          <CloseIcon v-else alt="close navigation menu" />
        </button>
      </div>
      <!-- hamburger displayed when requested -->
      <div :class="{ dn: isHamburgerClosed }">
        <div class="tc bg-aqua-muted white">
          <div v-for="(link, idx) in links" :key="`mobile-${idx}`">
            <router-link @click.native="toggleHamburger" :class="[isActive(link) ? 'white' : 'navy', 'link pa3 fw5 f4 db bb border-aqua']" :to="`${link.path}`">{{link.text}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import BurgerIcon from '../../static/images/burger.svg?inline'
import CloseIcon from '../../static/images/close.svg?inline'

import { getTutorialByUrl } from '../../utils/tutorials'

export default {
  name: 'Navigation',
  components: {
    BurgerIcon,
    CloseIcon
  },
  props: {
    hidden: Boolean
  },
  data: (self) => {
    return {
      isHamburgerClosed: true,
      currentPath: self.$route.path.toString(),
      tutorialLanding: '/' + self.$route.path.split('/')[1],
      links: [
        { text: 'Home', path: '/' },
        { text: 'Tutorials', path: '/tutorials' },
        { text: 'Events', path: '/events' },
        { text: 'Contribute', path: '/contribute' },
        { text: 'Host', path: '/host' },
        { text: 'Build', path: '/build' },
        { text: 'News', path: '/news' }
      ]
    }
  },
  computed: {
    tutorial: function () {
      if (!this.$route.params.tutorialUrl) {
        return null
      }

      return getTutorialByUrl(this.$route.params.tutorialUrl)
    },
    currentPage: function () {
      let pageName
      this.links.forEach(link => {
        if (link.path === this.currentPath) {
          pageName = link.text.toString()
        }
      })
      return pageName
    }
  },
  methods: {
    toggleHamburger: function () {
      this.isHamburgerClosed = !this.isHamburgerClosed
    },
    isActive: function (link) {
      return link.path === this.$route.path
    }
  }
}
</script>

<style scoped>

.menu-toggle {
  /* Increase interaction area using negative margins */
  padding: 1rem;
  margin: -1rem;
  margin-left: 0;
}

.link-list {
  margin-left: -20px;
  margin-right: -20px;
}

.nav-link {
  margin: 2px 20px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover {
  color: white;
}

@media screen and (max-width: 479px) {
  .nav-link {
    margin: 2px 0px;
    font-size: 16px;
  }
}
</style>
