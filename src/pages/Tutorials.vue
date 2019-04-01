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

      <Tutorial
        :project="{ title: 'IPFS', logo: ipfsLogo }"
        title="Decentralized data structures"
        description="The decentralized web relies on unique data structures and linking strategies. Learn about the benefits of hashing, content addressing, DAG and Merkle Trees!"
        :lessons="[
          { to: '/data-structures/01', name: 'Data structures' },
          { to: '/data-structures/02', name: 'The centralized web: Location-based addressing' },
          { to: '/data-structures/03', name: 'The decentralized web: Content addressing' },
          { to: '/data-structures/04', name: 'Cryptographic hashing and Content Identifiers (CIDs)' },
          { to: '/data-structures/05', name: 'Merkle trees and directed acyclic graphs (DAG)' }
        ]" />

      <Tutorial
        :project="{ title: 'IPFS', logo: ipfsLogo }"
        title="P2P data links with content addressing"
        description="Store, fetch, and create verifiable links between peer-hosted datasets with IPFS and CIDs. It’s graphs with friends!"
        :lessons="[
          { to: '/basics/01', name: 'Create a node and return a Content Identifier (CID)' },
          { to: '/basics/02', name: 'Create a new node that\'s linked to an old one' },
          { to: '/basics/03', name: 'Read nested data using links' }
        ]" />

      <Tutorial
        :project="{ title: 'IPFS', logo: ipfsLogo }"
        title="Blogging on the Decentralized Web"
        description="Cool content addresses don't change."
        :lessons="[
          { to: '/blog/01', name: 'Link an author to a blog post using its CID' },
          { to: '/blog/02', name: 'Update posts with tags and watch their CIDs change' },
          { to: '/blog/03', name: 'Build a tag cloud with arrays of links' },
          { to: '/blog/04', name: 'Add a new blog post linked to an author and tags' },
          { to: '/blog/05', name: 'Add a new tag linked to multiple blog posts' },
          { to: '/blog/06', name: 'List posts chronologically with a chain of links' },
          { to: '/blog/07', name: 'Traverse through all posts, starting with the most recent' }
        ]" />

    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Tutorial from '../components/Tutorial.vue'
import ipfsLogo from '../static/images/ipfs.svg'

export default {
  name: 'Tutorials',
  components: {
    Header,
    Tutorial
  },
  data: self => {
    return {
      firstWorkshopVisit: true,
      ipfsLogo
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
