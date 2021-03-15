<template>
  <div>
    <Header/>
    <section class="mw7 center ph3">
      <h1 class="mt4">Build an Interactive Tutorial</h1>

      <p class="f4 fw5 lh-copy ma0 pv2  ">
      ProtoSchool is a community-driven effort, and we
      rely on contributors like you to create great educational content!
      </p>

      <p class="f4 fw5 lh-copy ma0 pv2 ">
      ProtoSchool content is designed to introduce learners to the concepts,
      protocols, and tools that support the decentralized web. We're excited
      to add new tutorials to our collection, and we'd love your help brainstorming and building new content
      content about projects such as
      <a href="https://ipfs.io/" target="blank">IPFS</a>,
      <a href="https://ipld.io/" target="blank">IPLD</a>,
      <a href="https://libp2p.io/" target="blank">libp2p</a>,
      <a href="https://multiformats.io/" target="blank">Multiformats</a>,
      <a href="https://filecoin.io/" target="blank">Filecoin</a>,
      and more.
      </p>

      <h2>Share a tutorial idea</h2>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Our guide to <a href="https://github.com/ProtoSchool/protoschool.github.io/blob/main/DEVELOPING_TUTORIALS.md">designing effective ProtoSchool tutorials</a> covers the process for proposing and outlining a new tutorial with community input and explains the skills needed to build a tutorial using the ProtoSchool platform. Perhaps more importantly, it clarifies the scope of ProtoSchool and outlines some of the key elements of an effective learning experience, so that you can design the best possible tutorial for our users.</p>

      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Ready to share your idea for new content? After reviewing the guide, please check out the
      <a href="https://github.com/protoschool/protoschool.github.io/labels/new-tutorial">
      existing tutorial proposals</a> in the ProtoSchool issue queue. If there's a similar idea there
      already, join the conversation!
      </p>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      If you have an idea for a new tutorial that has not yet been proposed,
      please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-tutorial&template=tutorial-proposal.md&title=New+Tutorial%3A+%5BProposed+title%5D">
      open an new issue</a> so we can share feedback before you get started
      building.
      </p>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Don't feel like you have the skills to build a tutorial yourself?
      Please still go ahead and share your idea!
      </p>

      <h2>Build a tutorial</h2>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Whether you've shared your own tutorial idea or found an
      <a href="https://github.com/protoschool/protoschool.github.io/labels/new-tutorial">
      existing proposal</a> you're excited about, we'd love to have your help
      building it.
      </p>

      <p class="f4 fw5 lh-copy ma0 pv2 ">Our boilerplate files make it easy to build new tutorials using Markdown formatting for lesson content, and you can create text-based or multiple-choice lessons without any coding background. To build coding challenges, you'll need to create validation tests using JavaScript, a process that feels similar to creating a unit test suite
      which the learner must pass by implementing the correct code. Whichever lesson type you choose, our <a href="https://github.com/ProtoSchool/protoschool.github.io/blob/main/DEVELOPING_TUTORIALS.md">detailed instructions on building tutorials</a> will walk you through every step of the process.
      </p>

      <p class="f4 fw5 lh-copy ma0 pv2 ">
      If the type of lesson you're
      hoping to create isn't supported by the current lesson structure,
      please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-tutorial&template=tutorial-proposal.md&title=New+Tutorial%3A+%5BProposed+title%5D">
      open an issue</a> and tell us more about the format you have in mind.
      </p>

      <h2>Other ways to contribute</h2>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Not ready to build a tutorial quite yet? We'd love your help
      improving existing tutorials, answering technical questions,
      making our documentation more clear, or <router-link to="/host">hosting local events</router-link>.
      Learn more about the many
      <router-link to="/contribute">ways to contribute</router-link>.
      </p>
    </section>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

export default {
  name: 'Build',
  components: {
    Header,
    Footer
  },
  head () {
    return head()
  }
}
</script>
