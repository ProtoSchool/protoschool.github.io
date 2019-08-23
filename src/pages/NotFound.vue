<template>
  <div>
    <Header :notFound="notFound" />
    <section class="mw7 center ph2">
      <h1 class="mt5">Page not found</h1>
      <p class="f4 fw5 lh-copy ma0 pv2">It seems like you hit a route that doesn't exist 😢</p>
      <p class="f4 fw5 lh-copy ma0 pt2">Go to the <router-link to="/">homepage</router-link> or check out our awesome <router-link to="/tutorials">tutorials</router-link>!</p>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  name: 'NotFound',
  components: {
    Header
  },
  props: {
    notFound: Boolean
  }
}
</script>

<style scoped>
h1 {
  font-size: 6rem;
}
</style>
