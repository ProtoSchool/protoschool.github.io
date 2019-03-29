<template>
  <div>
    <Header/>
    <div class="home">
      <section class="mw7 center ph2">
        <h1 class="mt5">Build an Interactive Tutorial</h1>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        We're excited to add new tuorials to our collection, and we'd love your
        help brainstorming and building new content about decentralized web
        concepts and protocols.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        ProtoSchool is a community-driven effort, and we
        rely on contributors like you to create great educational content!
        </p>
        <h2>Share a tutorial idea</h2>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Have an idea for a new tutorial? Start by looking at the
        <a href="https://github.com/protoschool/protoschool.github.io/labels/new-tutorial">
        tutorial ideas</a> flagged with the "new tutorial"
        tag in the ProtoSchool issue queue. If there's a similar idea there
        already, join the conversation!
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        If you have an idea for a new tutorial that has not yet been proposed,
        please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-tutorial&template=tutorial-proposal.md&title=New+Tutorial%3A+%5BProposed+title%5D">
        open an new issue</a> so we can share feedback before you get started
        building.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Don't feel like you have the skills to build a tutorial yourself?
        Please still go ahead and share your idea!
        </p>

        <h2>Build a tutorial</h2>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Whether you've shared your own tutorial idea or found an
        <a href="https://github.com/protoschool/protoschool.github.io/labels/new-tutorial">
        existing proposal</a> you're excited about, we'd love to have your help
        building it.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        ProtoSchool tutorials are built using <a href="https://cli.vuejs.org/">
        Vue CLI 3</a> with single-file components and use an embedded
        <a href="https://www.npmjs.com/package/monaco-editor">Monaco Editor</a>
        to enable interactive code challenges. Check out our
        <a href="https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#developing-lessons">
        instructions for developing tutorials</a> to see how the pieces fit together.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        If the type of lesson you're
        hoping to create isn't supported by the current lesson structure,
        please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-tutorial&template=tutorial-proposal.md&title=New+Tutorial%3A+%5BProposed+title%5D">
        open an issue</a> and tell us more about the format you have in mind.
        </p>

        <h2>Other ways to contribute</h2>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        Not ready to build a tutorial quite yet? We'd love your help improving
        existing tutorials, answering technical questions, making our
        documentation more clear, or leading a local ProtoSchool chapter.
        Learn more about the many
        <a href="https://github.com/ProtoSchool/organizing/blob/master/CONTRIBUTING.md#ways-to-contribute">
        ways to contribute</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  name: 'Build',
  components: {
    Header
  }
}
</script>
