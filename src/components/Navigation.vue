<template>
  <nav>
    <!-- STANDARD NAV -->
    <div class="dn db-ns bg-aqua pv3">
      <div class="center mw7">
        <!-- If in lesson (breadcrumbs) -->
        <div v-if="isLesson" class="flex overflow-auto items-center bg-aqua navy f5 fw6 pv3 center tc mw7">
          <router-link class="nav-link navy" to="/tutorials">Tutorials</router-link>
          <span class="fw4">></span>
          <router-link class="nav-link navy" :to="workshopLanding">{{workshopShortname}}</router-link>
        </div>
        <!-- standard nav  -->
        <div v-else class="dn flex overflow-auto items-center bg-aqua white pv3 center tc mw7">
          <div v-for="link in links">
            <router-link v-if="link.path === $route.path"
              class="nav-link white" :to="`${link.path}`">{{link.text}}</router-link>
              <router-link v-else
              class="nav-link navy" :to="`${link.path}`">{{link.text}}</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE NAV -->
    <div class="db dn-ns">
      <div class="flex items-center bg-aqua pv3 w-100">
        <!-- If in lesson (breadcrumbs) -->
        <div v-if="isLesson" class="flex-auto link pa2 fw5 f5 db bb border-aqua navy">
          <router-link class="link navy" to="/tutorials">Tutorials</router-link>
          <span class="fw4"> > </span>
          <router-link class="nav-link navy" :to="workshopLanding">{{workshopShortname}}</router-link>
        </div>
        <!-- standard nav  -->
        <div v-else class="flex-auto link pa2 fw5 f5 db bb border-aqua white">{{currentPage}}</div>
        <button v-on:click="toggleHamburger" class="button-reset bg-transparent b--transparent pr2">
          <img v-if="isHamburgerClosed" src="../static/images/burger.svg"/>
          <img v-else src="../static/images/close.svg"/>
        </button>
      </div>
      <!-- hamburger displayed when requested -->
      <div v-bind:class="{ dn: isHamburgerClosed }">
        <div class="tc bg-aqua-muted white">
          <div v-for="link in links">
            <router-link v-on:click.native="toggleHamburger" v-if="link.path === $route.path"
              class="link pa3 fw5 f4 db bb border-aqua white" :to="`${link.path}`">{{link.text}}</router-link>
            <router-link v-else
              class="link pa3 fw5 f4 db bb border-aqua navy" :to="`${link.path}`">{{link.text}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'Navigation',
  data: (self) => {
    return {
      isHamburgerClosed: true,
      currentPath: self.$route.path.toString(),
      workshopShortname: self.$route.path.split('/')[1].split('-').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' '),
      workshopLanding: `/${self.$route.path.split('/')[1]}`,
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
      if (count === 0) {
        return true
      } else {
        return false
      }
    },
    currentPage: function () {
      let pageName
      this.links.forEach(link => {
        if (link.path === this.currentPath) {
          console.log(link.text)
          pageName = link.text.toString()
        }
      })
      return pageName
    }
  },
  methods: {
    toggleHamburger: function () {
      this.isHamburgerClosed = !this.isHamburgerClosed
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

.nav-link:focus,
.nav-link:hover {
  color: white;
}

@media screen and (max-width: 479px) {
  .nav-link {
    margin: 2px 0px;
    font-size: 14px;
  }
}
</style>
