<template>
  <section class="flex items-center bg-aqua white pv3"
    <div class="bg-aqua w-100">
      <nav v-if="isLesson" class="flex items-center bg-aqua navy pv3 center tc mw7">
        <router-link class="nav-link navy" :to="'/'">Home</router-link> >
        <router-link class="nav-link navy" :to="'/tutorials'">Tutorials</router-link> >
        <span class="fake-nav-link">{{workshopShortname}}</span>
      </nav>
      <nav v-else class="flex items-center bg-aqua white pv3 center tc mw7">
        <div v-for="link in links">
          <router-link v-if="link.path === $route.path"
           class="nav-link white" :to="`${link.path}`">{{link.text}}</router-link>
           <router-link v-else
            class="nav-link navy" :to="`${link.path}`">{{link.text}}</router-link>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>

export default {
  name: 'Navigation',
  data: self => {
    return {
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
    }
}
</script>

<style scoped>

nav {
  overflow: auto;
}

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



@media screen and (max-width: 617px) {
  nav {
    flex-direction: column;
  }
  .nav-link {
    display: block;
    margin: 5px 5px;
  }
}

</style>
