<template>
  <div class="home">
    <header>
    <section class="flex items-center bg-navy white pv3">
        <div class="flex-auto">
          <div class="pseudo-logo">
            <img src="./ps_symbol_color.svg" alt="ProtoSchool" class="mr3 ml3" />
            <div class="header-text">
                <h1 class="ma0 fw4">
                  <span class="montserrat fw4">Proto</span>
                  <span class="montserrat fw2">School</span>
                </h1>
                <h2 class="ma0 montserrat fw3">
                  The interactive IPFS protocol workshop
                </h2>
            </div>
          </div>
        </div>
        <div class="flex-auto tc bonus-illustration">
          <img src="./ipfs-illustrations-how-3.svg" alt="" style="height: 70px;"/>
        </div>
      </section>
      <nav class="flex items-center bg-aqua white pv3">
        <router-link :to="'/'" class="nav-link navy">Home</router-link>
        <router-link :to="'/workshops'" class="nav-link navy">Workshops</router-link>
      </nav>
    </header>
  </div>
</template>

<script>

export default {
  name: 'Header',
}
</script>

<style scoped>

.bonus-illustration {
  display: none;
}
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
@media screen and (min-width: 740px) {
  .bonus-illustration {
    display: block;
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
