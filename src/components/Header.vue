<template>
  <div class="home">
    <header>
      <section class="bg-navy white pv3">
        <div class="flex-auto flex items-center center mw7 ph3">
          <a href="/">
            <img src="../static/images/ps_symbol_color.svg" alt="ProtoSchool" class="w3" />
          </a>
          <div class="header-text ml3">
            <div class=" header-title ma0 fw4">
              <span class="montserrat fw4">Proto</span>
              <span class="montserrat fw2">School</span>
            </div>
            <div class="header-slogan ma0 montserrat fw3">
              Interactive tutorials on decentralized web protocols
            </div>
          </div>
        </div>
      </section>
      <Navigation :hidden="hidden"/>
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
    notFound: Boolean,
    hidden: Boolean
  }
}
</script>

<style scoped>
.header-title {
  font-size: 32px;
}
.header-slogan {
  font-size: 16px;
}

@media screen and (min-width: 620px) {
  .header-title {
    font-size: 40px;
  }
  .header-slogan {
    font-size: 20px;
  }
}

@media screen and (max-width: 498px) {
  .header-title {
    font-size: 24px;
  }
  .header-slogan {
    font-size: 12px;
  }
}
</style>
