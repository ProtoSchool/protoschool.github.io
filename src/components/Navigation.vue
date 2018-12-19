<template>
  <section class="flex items-center bg-aqua white pv3"
    <div class="bg-aqua w-100">
      <nav class="flex items-center bg-aqua white pv3 center tc mw7">
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
      links: [
        {
          text: 'Home',
          path: '/'
        },
        {
          text: 'Tutorials',
          path: '/workshops'
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
.nav-link:first {
  margin: 2px 20px 2px 0px;
}
.nav-link:focus, .nav-link:hover {
  color: white;
}

</style>
