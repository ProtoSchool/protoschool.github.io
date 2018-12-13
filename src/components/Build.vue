<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <h1 class="tc">Build a Workshop</h1>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        We're excited to add new workshops to our collection, and we'd love your
        help brainstorming and building new content about decentralized web
        concepts and protocols.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        ProtoSchool is a community-driven effort, and we
        rely on contributors like you to create great educational content!
        </p>
        <h2 class="indent-1">Share a workshop idea</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Have an idea for a new workshop? Start by looking at the
        <a href="https://github.com/protoschool/protoschool.github.io/labels/new%20workshop">
        workshop ideas</a> flagged with the "new workshop"
        tag in the ProtoSchool issue queue. If there's a similar idea there
        already, join the conversation!
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        If you have an idea for a new workshop that has not yet been proposed,
        please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-workshop&template=workshop-proposal.md&title=New+Workshop%3A+%5BProposed+title%5D">
        open an new issue</a> so we can share feedback before you get started
        building.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Don't feel like you have the skills to build a workshop yourself?
        Please still go ahead and share your idea!
        </p>

        <h2 class="indent-1">Build a workshop</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Whether you've shared your own workshop idea or found an
        <a href="https://github.com/protoschool/protoschool.github.io/labels/new%20workshop">
        existing proposal</a> you're excited about, we'd love to have your help
        building it.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        ProtoSchool workshops are built using <a href="https://cli.vuejs.org/">
        Vue CLI 3</a> with single-file components and use an embedded
        <a href="https://www.npmjs.com/package/monaco-editor">Monaco Editor</a>
        to enable interactive code challenges. Check out our
        <a href="https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#developing-lessons">
        instructions for developing workshops</a> to see how the pieces fit together.
        </p>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        If the type of lesson you're
        hoping to create isn't supported by the current lesson structure,
        please <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-workshop&template=workshop-proposal.md&title=New+Workshop%3A+%5BProposed+title%5D">
        open an issue</a> and tell us more about the format you have in mind.
        </p>

        <h2 class="indent-1">Other ways to contribute</h2>
        <p class="f4 fw5 lh-copy ma0 pv3 indent-1 measure-wide">
        Not ready to build a workshop quite yet? We'd love your help improving
        existing workshops, answering technical questions, making our
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
import Header from './Header.vue'

export default {
  name: 'Build',
  components: {
    Header
  },
}
</script>

<style scoped>

.indent-1 {
  padding-left: 1rem;
}
.section-1 {
  display: none;
}
@media screen and (min-width: 530px) {
  .indent-1 {
    padding-left: 93px;
  }
  .section-1 {
    display: block;
    width: 93px;
  }
}

</style>
