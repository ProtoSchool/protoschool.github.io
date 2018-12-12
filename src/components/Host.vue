<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <h1 class="tc">Organize Your Own Chapter Events</h1>
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        ProtoSchool is a community-driven effort and is 100% open source. This
        means that anyone can use the ProtoSchool materials and/or host an event.
        <p>
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        The only expectations for event hosts is that events be not-for-profit
        (free or low cost) and that governance of events should have an open
        membership model (so that nobody can 'control' the events).
        <p>
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        Check out our <a href="https://github.com/protoschool/organizing">
        Organizing repo</a> for info on how to create a chapter, run a
        successful event, and build a local ProtoSchool community!
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'

export default {
  name: 'Host',
  components: {
    Header
  },
}
</script>

<style scoped>

.indent-1 {
  padding-left: 1rem;
}
.section-1 {
  display: none;
}
@media screen and (min-width: 530px) {
  .indent-1 {
    padding-left: 93px;
  }
  .section-1 {
    display: block;
    width: 93px;
  }
}

</style>
