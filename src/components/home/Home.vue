<template>
  <div>
    <Header current="Home"/>
    <div>
      <section class="mw7 center ph2">
        <h1 class="mt5">Interactive Tutorials</h1>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Our self-guided interactive tutorials are designed to introduce you to
        decentralized web concepts, protocols, and tools. Complete code
        challenges right in your web browser and track your progress as you go.
        </p>
        <div class="mv3">
          <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3" to="/tutorials">View All Tutorials</router-link>
          <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy" to="/build">Build a Tutorial</router-link>
        </div>
        <h2>Featured Tutorials</h2>
        <div id="featured" class="flex flex-wrap justify-between">
          <div class="bg-aqua br4 pa3 mb3 tutorial-tile">
            <router-link to="/data-structures/01">
              <h3 class="ma0 f3 fw7 navy">Decentralized Data Structures</h3>
              <p class="f5 fw5 ma0 pt2 lh-copy white">
                The decentralized web relies on unique data structures and linking strategies. Learn about the benefits of hashing, content addressing, DAG and Merkle Trees!
              </p>
            </router-link>
          </div>
          <div class="bg-aqua br4 pa3 mb3 tutorial-tile">
            <router-link to="/basics/01">
              <h3 class="ma0 f3 fw7 navy">P2P data links with content addressing</h3>
              <p class="f5 fw5 ma0 pt2 lh-copy white">
                Store, fetch, and create verifiable links between peer-hosted datasets with IPFS and CIDs. It’s graphs with friends!
              </p>
            </router-link>
          </div>
          <div class="bg-aqua br4 pa3 mb3 tutorial-tile">
            <router-link to="/blog/01">
              <h3 class="ma0 f3 fwy navy">Blogging on the Decentralized Web</h3>
              <p class="f5 fw5 ma0 pt2 lh-copy white">
                Cool content addresses don't change.
              </p>
            </router-link>
          </div>
          <div class="bg-aqua br4 pa3 mb3 tutorial-tile">
            <router-link to="/mutable-file-system/01">
              <h3 class="ma0 f3 fwy navy">IPFS as a Mutable File System</h3>
              <p class="f5 fw5 ma0 pt2 lh-copy white">
                Store, edit, and share files with with the Mutable File System (MFS)
              </p>
            </router-link>
          </div>
        </div>

        <h1>Chapter Events</h1>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Chapters around the world host in-person events using our tutorials as
        curriculum, with mentors available to help you work through the challenges.
        </p>
        <div class="mv3">
          <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3" to="/chapters">Find a Chapter Near You</router-link>
          <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy" to="/host">Start Your Own</router-link>
        </div>
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

.tutorial-tile {
  max-width: 49%
}
.tutorial-tile a  {
  text-decoration: none;
}

.tutorial-tile a h3:hover,
.tutorial-tile a h3:focus {
  color: white;
}

@media screen and (max-width: 750px) {
  #featured {
    flex-wrap: nowrap;
    flex-direction: column;
  }
  .tutorial-tile {
    max-width: 100%
  }
}

</style>
