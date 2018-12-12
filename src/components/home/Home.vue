<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
          <strong>Home</strong> content here.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Header from '../Header'

export default {
  name: 'home',
  components: {
    Header
  }
}

</script>

<style scoped>
.indent-1 {
  padding-left: 1rem;
}

@media screen and (min-width: 530px) {
  .indent-1 {
    padding-left: 93px;
  }
}
</style>
