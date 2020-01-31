<template>
  <div>
    <Header/>
    <section class="mw7 center ph2">
      <h1 class="mt5">Organize Chapter Events</h1>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      ProtoSchool is a community-driven effort and is 100% open source. This
      means that anyone can use the ProtoSchool materials and/or host an event.
      <p>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Events are run independently by local <router-link to="/chapters">
      ProtoSchool chapters</router-link> around the world, but we ask that all
      events be not-for-profit (free or low-cost) and that governance of events
      have an open membership model (so that nobody can "control" the events).
      <p>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      ProtoSchool chapters also have an online presence to keep local
      communities interacting between events. Each chapter has its own
      GitHub repo within our organization, which makes it easy to manage a
      discussion board using GitHub issues and host a chapter website on our
      domain using GitHub Pages.
      <p>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Check out our <a href="https://github.com/protoschool/organizing">
      Organizing repo</a> for info on how to create a chapter, run a
      successful event, and build a local ProtoSchool community!
      </p>
      <h2 class="">Other ways to contribute</h2>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Not ready to host events quite yet? We'd love your help
      <router-link to="/build">building new tutorials</router-link>,
      improving existing ones, answering technical questions, or
      making our documentation more clear.
      Learn more about the many
      <router-link to="/contribute">ways to contribute</router-link>.
      </p>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  name: 'Host',
  components: {
    Header
  }
}
</script>
