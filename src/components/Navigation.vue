<template>
  <section>
    <div class="dn db-ns bg-aqua pv3">
      <div class="center mw7">
        <!-- nav if in lesson (breadcrumbs) -->
        <nav v-if="isLesson" class="flex overflow-auto items-center bg-aqua navy pv3 center tc mw7">
          <router-link class="nav-link navy" :to="'/'">Home</router-link> >
          <router-link class="nav-link navy" :to="'/tutorials'">Tutorials</router-link> >
          <span class="fake-nav-link">{{workshopShortname}}</span>
        </nav>
        <!-- standard nav  -->
          <nav v-else class="dn flex overflow-auto items-center bg-aqua white pv3 center tc mw7">
            <div v-for="link in links">
              <router-link v-if="link.path === $route.path"
               class="nav-link white" :to="`${link.path}`">{{link.text}}</router-link>
               <router-link v-else
                class="nav-link navy" :to="`${link.path}`">{{link.text}}</router-link>
            </div>
          </nav>
        </div>
    </div>
    <div class="db dn-ns">
      <div class="flex items-center bg-aqua pv3 w-100">
        <div class="flex-auto link pa2 fw5 f5 db bb border-aqua white">Current Page</div>
        <button v-on:click="toggleHamburger" class="button-reset bg-transparent b--transparent">
          <img v-if="isHamburgerClosed" src="../images/burger.svg"/>
          <img v-else src="../images/close.svg"/>
        </button>
      </div>
        <!-- mobile nav that expands and hides -->
        <div v-bind:class="{ dn: isHamburgerClosed }">
          <nav class="tc bg-aqua-muted white">
            <div v-for="link in links">
              <router-link v-on:click.native="toggleHamburger" v-if="link.path === $route.path"
               class="link pa3 fw5 f4 db bb border-aqua white" :to="`${link.path}`">{{link.text}}</router-link>
               <router-link v-else
                class="link pa3 fw5 f4 db bb border-aqua navy" :to="`${link.path}`">{{link.text}}</router-link>
            </div>
          </nav>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'Navigation',
  data: self => {
    return {
      isHamburgerClosed: true,
      currentPath: self.$route.path.toString(),
      workshopShortname: (self.$route.path.charAt(1).toUpperCase() + self.$route.path.slice(2, self.$route.path.lastIndexOf('/'))).split('-').join(" "),
      links: [
        {
          text: 'Home',
          path: '/'
        },
        {
          text: 'Tutorials',
          path: '/tutorials'
        },
        {
          text: 'Chapters',
          path: '/chapters'
        },
        {
          text: 'Contribute',
          path: '/contribute'
        },
        {
          text: 'Host',
          path: '/host'
        },
        {
          text: 'Build',
          path: '/build'
        }
      ]
    }
    },
    computed: {
      isLesson: function () {
        let count = 0
        this.links.forEach( link => {
          if (link.path === this.currentPath) {
            count++
          }
        })
        if (count === 0) {
          return true
        } else {
          return false
        }
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
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  margin: 2px 20px;
  text-decoration: none;
}
.fake-nav-link {
  font-size: 18px;
  font-weight: 700;
  margin: 2px 20px;
  text-decoration: none;
  color: white;
}
.nav-link:first {
  margin: 2px 20px 2px 0px;
}
.nav-link:focus, .nav-link:hover {
  color: white;
}



/* @media screen and (max-width: 617px) {
  nav {
    flex-direction: column;
  }
  .nav-link {
    display: block;
    margin: 5px 5px;
  }
} */

</style>
