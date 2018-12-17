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
      <section class="flex items-center bg-aqua white pv3"
        <div class="bg-aqua w-100">
          <nav class="flex items-center bg-aqua white pv3 center tc mw7">
            <router-link :to="'/'" class="nav-link navy">Home</router-link>
            <router-link :to="'/workshops'" class="nav-link navy">Tutorials</router-link>
            <router-link :to="'/chapters'" class="nav-link navy">Chapters</router-link>
            <router-link :to="'/contribute'" class="nav-link navy">Contribute</router-link>
            <router-link :to="'/host'" class="nav-link navy">Host</router-link>
            <router-link :to="'/build'" class="nav-link navy">Build</router-link>
          </nav>
        </div>
      </section>
    </header>
  </div>
</template>

<script>

export default {
  name: 'Header'
}
</script>

<style scoped>

.header-text h1 {
  font-size: 32px;
}
.header-text h2 {
  font-size: 16px;
}
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
.pseudo-logo {
  display: flex;
  align-items: center;
}
.pseudo-logo img {
  height: 80px;
}

@media screen and (min-width: 530px) {
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

@media screen and (max-width: 435px) {
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
