<template>
  <div class="home">
    <header class="flex items-center bg-navy white pv3">
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
    </header>
    <section class="db bt border-aqua bw4">
      <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        <strong>ProtoSchool is a collection of workshops</strong> that help you learn about the
        IPFS protocol by writing code and solving challenges.
      </p>
    </section>
    <section class="db bt border-aqua bw4 relative">
      <label class="absolute ttu f6 fw5 white" style="top: -15px; left: 91px;">
        TOPICS
      </label>
      <div class="flex items-start pv4">
        <div class="section-1 flex-none tc">
          <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
          <img src="./ipfs.svg" alt="" style="height: 54px"/>
        </div>
        <div class="w-100 w-50-l measure-wide ph2 ph0-l">
          <h2 class="ma0 f3 fw5">P2P data links with content addressing</h2>
          <p class="f5 fw5 ma0 pt2 lh-copy measure-wide charcoal-muted">
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
        <div class="dn db-l flex-auto tc">
          <img src="./ipfs-illustrations-how-1.svg" alt="">
        </div>
      </div>
    </section>
    <section class="db">
      <div class="flex items-start pv4">
        <div class="section-1 flex-none tc">
          <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
          <img src="./ipfs.svg" alt="" style="height: 54px"/>
        </div>
        <div class="w-100 w-50-l measure-wide ph2 ph0-l">
          <h2 class="ma0 f3 fw5 ">Blogging on the Decentralized Web</h2>
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
        <div class="dn db-l flex-auto tc">
          <img src="./ipfs-illustrations-how-4.svg" alt="">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ExerciseLink from './ExerciseLink'

export default {
  name: 'home',
  components: {
    ExerciseLink
  }
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
.indent-1 {
  padding-left: 1rem;
}
.pseudo-logo {
  display: flex;
  align-items: center;
}
.pseudo-logo img {
  height: 80px;
}
.section-1 {
  display: none;
}
@media screen and (min-width: 530px) {
  .header-text h1 {
    font-size: 40px;
  }
  .header-text h2 {
    font-size: 20px;
  }
  .indent-1 {
    padding-left: 93px;
  }
  .section-1 {
    display: block;
    width: 93px;
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
