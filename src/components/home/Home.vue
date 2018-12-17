<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db bb border-aqua bw2">
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        ProtoSchool is an educational community providing interactive tutorials
        on decentralized web technologies. Explore them on your own or at an
        event near you.
        </p>
      </section>
      <section class="db">
        <h2 class="indent-1">Workshops</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Our workshops are self-guided interactive tutorials on decentralized web
        topics. Complete code challenges right in your web browser and track your
        progress as you go.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        <router-link to="/workshops">View All Workshops</router-link> |
        <router-link to="/build">Build a Workshop</router-link>
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        <em>TODO: make those links ^ more button-y</em>
        </p>

        <h3 class="indent-1">Featured Workshops</h3>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        <em>TODO: insert some featured workshops</em>
        </p>


        <h2 class="indent-1">Chapter Events</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Chapters around the world host in-person events using our workshops as
        curriculum, with mentors available to help you work through the challenges.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        <router-link to="/chapters">Find a Chapter Near You</router-link> |
        <router-link to="/host">Start Your Own</router-link>
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        <em>TODO: make those links ^ more button-y</em>
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
