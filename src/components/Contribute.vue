<template>
  <div>
    <Header/>
    <div>
      <section class="mw7 center ph2">
        <h1 class="mt5">Contribute to the Community</h1>
        <p class="f4 fw5 lh-copy ma0 pv3">
        ProtoSchool is a community-driven open source project dedicated to
        making it easy to get started with decentralized web technologies.
        We accomplish this by <strong>creating interactive tutorials</strong>
        and <strong>hosting community learning events</strong>.
        </p>
        <h2>Interactive Tutorials</h2>
        <p class="f4 fw5 lh-copy ma0 pv3">
        Our <router-link to="/tutorials">interactive tutorials</router-link> are
        the heart of our educational mission. Each browser-based tutorial
        consists of lessons of increasing difficulty, in which a new
        concept is explained and the learner is given a code challenge
        to solve to apply their learning. The learner submits their solution
        when ready, and receives contextual feedback if needed to try again.
        If their code passes, they move on to the next lesson in the tutorial.
        </p>

        <p class="f4 fw5 lh-copy ma0 pv3 ">
        For contributors <router-link to="/build">building new tutorials,</router-link>
        the process feels similar to creating a unit test suite
        which the learner must pass by implementing the correct code.
        </p>


        <h2>Topics</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 ">
        ProtoSchool content is designed to introduce learners to the concepts,
        protocols, and tools that support the decentralized web. We're excited
        to add new tutorials to our collection, and we'd love your help building
        content about projects such as
        <a href="https://ipfs.io/" target="blank">IPFS</a>,
        <a href="https://ipld.io/" target="blank">IPLD</a>,
        <a href="https://libp2p.io/" target="blank">libp2p</a>,
        <a href="https://multiformats.io/" target="blank">Multiformats</a>,
        and more.
        </p>

        <h2>Chapter Events</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 ">
        Community events around the world provide an opportunity for learners
        to explore ProtoSchool tutorials with guidance from mentors in their
        <router-link to="/chapters">local chapters</router-link>. Anyone can
        <router-link to="/host">host a ProtoSchool chapter</router-link>, and we
        provide tools and tips for managing local chapters and organizing events
        that are fun and welcoming for everyone.
        </p>

        <h2>Contributing</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 ">
        ProtoSchool is a community-driven effort, and we depend on contributors
        to <router-link to="/host">build tutorials</router-link>,
        <router-link to="/host">organize chapter events</router-link>,
        improve our existing tutorials and documentation, and answer community
        questions. Learn more about
        <a href="https://github.com/ProtoSchool/organizing/blob/master/CONTRIBUTING.md" target="blank">
        ways to contribute</a>.
        </p>

        <h2>Get in Touch</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 ">
        We use GitHub to organize ProtoSchool. The best place to get in touch
        with questions about chapter leadership and community engagement is our
        <a href="https://github.com/ProtoSchool/organizing" target="blank">organizing
        repository</a>, where you can open a new issue and organizers will be
        notified and respond. If you have a new tutorial idea or suggestions for
        improving the ProtoSchool site, please open an issue in the
        <a href="https://github.com/ProtoSchool/protoschool.github.io" target="blank">
        website repository</a>.
        </p>

        <h2>Code of Conduct</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 ">
        We strive to make ProtoSchool a welcoming place for all community members.
        All community members, including chapter organizers, must abide by the
        <a href="https://github.com/protoschool/organizing/blob/master/CODE_OF_CONDUCT.md">
        Code of Conduct</a> outlined in our organizing repository.
        </p>

        <p class="f4 fw5 lh-copy ma0 pv3 ">
        Additionally, each ProtoSchool chapter is responsible for maintaining
        their own Code of Conduct for chapter events and repos. If you have questions about the
        Code of Conduct for a specific chapter, you can open an issue in their
        associated GitHub repository.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'

export default {
  name: 'Community',
  components: {
    Header
  },
}
</script>
