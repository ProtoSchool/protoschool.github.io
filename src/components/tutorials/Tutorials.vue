<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <h1 class="mw7 center ph2 mt5">Interactive Tutorials</h1>
        <p class="f4 fw5 lh-copy ma0 pv4 mw7 center ph2">
          Our interactive tutorials help you learn about the
          the decentralized web by writing code and solving challenges.
        </p>
      </section>
      <section class="db mw7 center ph2">
        <div class="flex items-start pv4">
          <div class="project-label flex-none tc">
            <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
            <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
          </div>
          <div class="w-100">
            <h2 class="ma0 f3 fw5"><router-link to="/data-structures/01">Decentralized data structures</router-link></h2>
            <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
              The decentralized web relies on unique data structures and linking strategies. Learn about the benefits of hashing, content addressing, DAG and Merkle Trees!
            </p>
            <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
              <li>
                <ExerciseLink to="/data-structures/01" index="1" name="Data structures" />
              </li>
              <li>
                <ExerciseLink to="/data-structures/02" index="2" name="The centralized web: Location-based addressing" />
              </li>
              <li>
                <ExerciseLink to="/data-structures/03" index="3" name="The decentralized web: Content addressing" />
              </li>
              <li>
                <ExerciseLink to="/data-structures/04" index="4" name="Cryptographic hashing and Content Identifiers (CIDs)" />
              </li>
              <li>
                <ExerciseLink to="/data-structures/05" index="5" name="Merkle trees and directed acyclic graphs (DAG)" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="db mw7 center ph2">
        <div class="flex items-start pv4">
          <div class="project-label flex-none tc">
            <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
            <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
          </div>
          <div class="w-100">
            <h2 class="ma0 f3 fw5"><router-link to="/basics/01">P2P data links with content addressing</router-link></h2>
            <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
              Store, fetch, and create verifiable links between peer-hosted datasets with IPFS and CIDs. It’s graphs with friends!
            </p>
            <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
              <li>
                <ExerciseLink to="/basics/01" index="1" name="Create a node and return a Content Identifier (CID)" />
              </li>
              <li>
                <ExerciseLink to="/basics/02" index="2" name="Create a new node that's linked to an old one" />
              </li>
              <li>
                <ExerciseLink to="/basics/03" index="3" name="Read nested data using links" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="db mw7 center ph2">
        <div class="flex items-start pv4">
          <div class="project-label flex-none tc">
            <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
            <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
          </div>
          <div class="w-100">
            <h2 class="ma0 f3 fw5 "><router-link to="/blog/01">Blogging on the Decentralized Web</router-link></h2>
            <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
              Cool content addresses don't change.
            </p>
            <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
              <li>
                <ExerciseLink to="/blog/01" index="1" name="Link an author to a blog post using its CID" />
              </li>
              <li>
                <ExerciseLink to="/blog/02" index="2" name="Update posts with tags and watch their CIDs change" />
              </li>
              <li>
                <ExerciseLink to="/blog/03" index="3" name="Build a tag cloud with arrays of links" />
              </li>
              <li>
                <ExerciseLink to="/blog/04" index="4" name="Add a new blog post linked to an author and tags" />
              </li>
              <li>
                <ExerciseLink to="/blog/05" index="5" name="Add a new tag linked to multiple blog posts" />
              </li>
              <li>
                <ExerciseLink to="/blog/06" index="6" name="List posts chronologically with a chain of links" />
              </li>
              <li>
                <ExerciseLink to="/blog/07" index="7" name="Traverse through all posts, starting with the most recent" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="db mw7 center ph2">
        <div class="flex items-start pv4">
          <div class="project-label flex-none tc">
            <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
            <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
          </div>
          <div class="w-100">
            <h2 class="ma0 f3 fw5"><router-link to="/basics/01">Working with files in IPFS</router-link></h2>
            <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
              That's all well and good, but how do I share a file?
            </p>
            <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
              <li>
                <ExerciseLink to="/file-basics/01" index="1" name="Working with your IPFS node" />
              </li>
              <li>
                <ExerciseLink to="/file-basics/02" index="2" name="Working with files in ProtoSchool" />
              </li>
              <li>
                <ExerciseLink to="/file-basics/03" index="3" name="Adding a file to IPFS" />
              </li>
              <li>
                <ExerciseLink to="/file-basics/04" index="4" name="Adding a file using MFS" />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import ExerciseLink from './ExerciseLink.vue'
import Header from '../Header.vue'

export default {
  name: 'Tutorials',
  components: {
    ExerciseLink,
    Header
  },
  data: self => {
    return {
      firstWorkshopVisit: true
    }
  },
  mounted: function () {
    this.checkFirstWorkshopVisit()
  },
  methods: {
    checkFirstWorkshopVisit: function () {
      for (let key of Object.keys(localStorage)) {
        if (key.startsWith('passed') || key.startsWith('cached')) {
          // TRACK? return visit
          this.firstWorkshopVisit = false
          return
        }
      } 
      // TRACK? first site visit
      this.firstWorkshopVisit = true
    }
  }
}
</script>

<style scoped>

.project-label {
  display: none;
}

h2 a {
  color: black;
  text-decoration: none;
}

h2 a:focus,
h2 a:hover {
  font-weight: bold;
  text-decoration: underline;
}

@media screen and (min-width: 530px) {
  .project-label {
    display: block;
    width: 93px;
  }
}

</style>
