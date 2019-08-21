<template>
  <nav>
    <!-- STANDARD NAV -->
    <div class="dn db-ns bg-aqua pv3">
      <div class="center mw7">
        <!-- If in lesson (breadcrumbs) -->
        <div v-if="isLesson" class="flex overflow-auto items-center bg-aqua navy f5 fw6 pv3 center tc mw7">
          <router-link class="nav-link navy" to="/tutorials">Tutorials</router-link>
          <span class="fw4">></span>
          <router-link class="nav-link navy" :to="tutorialLanding">{{tutorialShortname}}</router-link>
        </div>
        <!-- standard nav  -->
        <div v-else class="dn flex overflow-auto items-center bg-aqua white pv3 center tc mw7">
          <div v-for="(link, idx) in links" :key="`desktop-${idx}`">
            <router-link :class="[isActive(link) ? 'white' : 'navy ', 'nav-link']" :to="`${link.path}`">{{link.text}}</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE NAV -->
    <div class="db dn-ns">
      <div class="flex items-center bg-aqua pv3 w-100">
        <!-- If in lesson (breadcrumbs) -->
        <div v-if="isLesson" class="flex-auto link pa2 fw5 f5 db bb border-aqua navy">
          <router-link class="nav-link navy" to="/tutorials">Tutorials</router-link>
          <span class="fw4"> > </span>
          <router-link class="nav-link navy" :to="tutorialLanding">{{tutorialShortname}}</router-link>
        </div>
        <!-- standard nav  -->
        <div v-else class="flex-auto link pa2 fw5 f5 db bb border-aqua white">{{currentPage}}</div>
        <button @click="toggleHamburger" class="button-reset bg-transparent b--transparent pv1 pr2 pl3">
          <img v-if="isHamburgerClosed" src="../static/images/burger.svg"/>
          <img v-else src="../static/images/close.svg"/>
        </button>
      </div>
      <!-- hamburger displayed when requested -->
      <div :class="{ dn: isHamburgerClosed }">
        <div class="tc bg-aqua-muted white">
          <div v-for="(link, idx) in links" :key="`mobile-${idx}`">
            <router-link @click.native="toggleHamburger" :class="[isActive(link) || isActiveLesson(link) ? 'white' : 'navy', 'link pa3 fw5 f4 db bb border-aqua']" :to="`${link.path}`">{{link.text}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { deriveShortname } from '../utils/paths'

export default {
  name: 'Navigation',
  data: (self) => {
    return {
      isHamburgerClosed: true,
      currentPath: self.$route.path.toString(),
      tutorialShortname: deriveShortname(self.$route.path),
      tutorialLanding: self.$route.path.split('/')[1],
      links: [
        { text: 'Home', path: '/' },
        { text: 'Tutorials', path: '/tutorials' },
        { text: 'Chapters', path: '/chapters' },
        { text: 'Contribute', path: '/contribute' },
        { text: 'Host', path: '/host' },
        { text: 'Build', path: '/build' }
      ]
    }
  },
  computed: {
    isLesson: function () {
      let count = 0
      this.links.forEach(link => {
        if (link.path === this.currentPath) {
          count++
        }
      })
      return count === 0
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
    },
    isActiveLesson: function (link) {
      return this.isLesson && link.path === '/tutorials'
    }
  }
}
</script>

<style scoped>
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
