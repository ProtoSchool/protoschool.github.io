<template>
  <div>
    <Header/>
    <div>
      <section class="mw7 center ph2">
        <h2>Interactive Tutorials</h2>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Our self-guided interactive tutorials are designed to introduce you to
        decentralized web concepts, protocols, and tools. Complete code
        challenges right in your web browser and track your progress as you go.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        <router-link to="/workshops">View All Tutorials</router-link> |
        <router-link to="/build">Build a Tutorial</router-link>
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        <em>TODO: make those links ^ more button-y</em>
        </p>

        <h3>Featured Tutorials</h3>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        <em>TODO: insert some featured tutorials</em>
        </p>


        <h2>Chapter Events</h2>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Chapters around the world host in-person events using our tutorials as
        curriculum, with mentors available to help you work through the challenges.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        <router-link to="/chapters">Find a Chapter Near You</router-link> |
        <router-link to="/host">Start Your Own</router-link>
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
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
