<template>
  <div class="home">
    <header>
      <section class="flex items-center bg-navy white pv3">
        <div class="flex-auto">
          <div class="pseudo-logo center mw7">
            <a href="/">
              <img src="../images/ps_symbol_color.svg" alt="ProtoSchool" class="mr3" />
            </a>
            <div class="header-text">
              <h1 class="ma0 fw4">
                <span class="montserrat fw4">Proto</span>
                <span class="montserrat fw2">School</span>
              </h1>
              <h2 class="ma0 montserrat fw3">
                Interactive tutorials on decentralized web protocols
              </h2>
            </div>
            </div>
        </div>
      </section>
      <Navigation/>
    </header>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
export default {
  name: 'Header',
  components: {
    Navigation
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
.pseudo-logo {
  display: flex;
  align-items: center;
}
.pseudo-logo img {
  height: 80px;
}

@media screen and (min-width: 620px) {
  .header-text h1 {
    font-size: 40px;
  }
  .header-text h2 {
    font-size: 20px;
  }
  .pseudo-logo img {
    height: 100px;
  }
}

@media screen and (max-width: 498px) {
  .header-text h1 {
    font-size: 24px;
  }
  .header-text h2 {
    font-size: 12px;
  }
  .pseudo-logo img {
    height: 60px;
  }
}
</style>
