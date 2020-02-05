<template>
  <div>
    <Header :notFound="true" />
    <section class="mw7 center ph2">
      <h1 class="mt5">Page Not Found</h1>
      <p class="f4 fw5 lh-copy ma0 pv3">Oops! Looks like you've tried to access a page that doesn't exist. 😢  </p>
      <p class="f4 fw5 lh-copy ma0 pv3">May we suggest perusing our <router-link to="/">homepage</router-link> or checking out our awesome collection of <router-link to="/tutorials">interactive tutorials</router-link>?</p>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  name: 'NotFound',
  components: {
    Header
  }
}
</script>
