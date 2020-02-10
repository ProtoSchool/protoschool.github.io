<template>
  <div class="home">
    <header>
      <section class="bg-navy white pv3">
        <div class="flex-auto flex items-center center mw7 ph3">
          <a href="/">
            <img src="../static/images/ps_symbol_color.svg" alt="ProtoSchool" class="w3" />
          </a>
          <div class="header-text ml3">
            <h1 class="ma0 fw4">
              <span class="montserrat fw4">Proto</span>
              <span class="montserrat fw2">School</span>
            </h1>
            <h2 class="ma0 montserrat fw3">
              Interactive tutorials on decentralized web protocols
            </h2>
          </div>
        </div>
      </section>
      <Navigation :notFound="notFound"/>
    </header>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
export default {
  name: 'Header',
  components: {
    Navigation
  },
  props: {
    notFound: Boolean
  }
}
</script>

<style scoped>
.header-text h1 {
  font-size: 32px;
}
.header-text h2 {
  font-size: 16px;
}

@media screen and (min-width: 620px) {
  .header-text h1 {
    font-size: 40px;
  }
  .header-text h2 {
    font-size: 20px;
  }
}

@media screen and (max-width: 498px) {
  .header-text h1 {
    font-size: 24px;
  }
  .header-text h2 {
    font-size: 12px;
  }
}
</style>
