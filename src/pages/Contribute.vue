<template>
  <div>
    <Header/>
    <section class="mw7 center ph3">
      <h1 class="mt4">Contribute to the Community</h1>
      <p class="f4 fw5 lh-copy ma0 pv3">
      ProtoSchool is a community-driven open source project dedicated to
      making it easy to get started with decentralized web technologies.
      We accomplish this by <strong>creating interactive tutorials</strong>
      and <strong>hosting community learning events</strong>.
      </p>

      <h2>Ways to contribute</h2>
      <p class="f4 fw5 lh-copy ma0 pv2 ">
      ProtoSchool depends on contributors to <router-link to="/build">build tutorials</router-link>,
      <router-link to="/host">organize local events</router-link>,
      improve our existing tutorials and documentation, and answer community
      questions. Whether you're an experienced DApp developer or a curious learner just getting started with decentralized web concepts, there are plenty of ways for you to pitch in.
      </p>

      <h3>Host local events</h3>
      <p class="f4 fw5 lh-copy ma0 pv2 ">
      <router-link to="/events">ProtoSchool events</router-link> around the world provide an opportunity for learners
      to explore our tutorials with guidance from local mentors at a variety of conferences and Meetups. Anyone can host a ProtoSchool workshop, and we provide tools and tips for organizing events
      that are fun and welcoming for everyone.
      </p>

      <p class="f4 fw5 lh-copy ma0 pv2 "><router-link to="/host">Learn more</router-link> about hosting local ProtoSchool events.</p>

      <h3>Build interactive tutorials</h3>
      <p class="f4 fw5 lh-copy ma0 pv2">
      Our <router-link to="/tutorials">interactive tutorials</router-link> are
      the heart of our educational mission. Each browser-based tutorial
      consists of lessons of increasing difficulty, often presenting the learner with JavaScript coding challenges or multiple-choice quizzes to apply the learning. Our boilerplates make it easy to <router-link to="/build">build new tutorials</router-link>, and you can create text-based or multiple-choice lessons without any coding background. To build coding challenges, you'll need to use JavaScript to create validation code. </p>

      <p class="f4 fw5 lh-copy ma0 pv3 "><router-link to="/build">Learn more</router-link> about how you can help to propose, build, and improve our interactive tutorials.</p>

      <h3>Share your questions and feedback</h3>
      <p  class="f4 fw5 lh-copy ma0 pv2 ">One of the most helpful things you can do to help, regardless of your coding background or experience with the decentralized web, is to let us know when a lesson or tutorial is confusing, or when the functionality of the website could be improved. There's a helpful link at the bottom of every lesson to make it easy to <a href="https://github.com/ProtoSchool/protoschool.github.io/issues/new/choose">log an issue</a> in our website repo.</p>

      <h3>Answer learner questions</h3>
      <p class="f4 fw5 lh-copy ma0 pv2 ">Our <a href="https://github.com/protoschool/protoschool.github.io/issues">issue queue</a> includes many questions raised by learners when they get stuck, ranging from beginner to advanced. In some cases, the best way to help will be to answer questions about the lesson content directly to help a user pass a lesson. In others, it will be to submit a pull request to make the explanations or instructions in a tutorial more clear.</p>

      <h3>Improve our tutorials and user experience</h3>
       <p class="f4 fw5 lh-copy ma0 pv2 "> Our <a href="https://github.com/protoschool/protoschool.github.io/issues">issue queue</a> highlights challenges with both tutorial content and learner experience (underlying website functionality). While our core team is focused on tackling the highest priority issues, we always welcome new contributors and pull requests. Before starting in on a small task, please make sure no one else is assigned to the issue in GitHub. For larger issues and those where multiple approaches to the problem are apparent, please add a comment to the issue you'd like to tackle so we can share any helpful context before you get to work.</p>

       <h3>Collaborating on GitHub</h3>
       <p  class="f4 fw5 lh-copy ma0 pv2 ">Most of our work and communication uses GitHub, a collaborative tool for code-based projects. However, you don't need coding skills to contribute to the ProtoSchool community! When you ask questions or share feedback, you'll do it by <a href="https://help.github.com/en/github/managing-your-work-on-github/creating-an-issue">creating an issue</a>. You can format the text in your issues using <a href="https://guides.github.com/features/mastering-markdown/">Markdown</a>, the same easy-to-use styling syntax that we use when building our tutorials. If you'd like to help out by fixing a typo or suggesting more beginner-friendly wording for a confusing lesson, you can do it by submitting a Pull Request. GitHub's <a href="https://guides.github.com/activities/hello-world/">Hello World</a> guide is a great place to learn about essentials like repositories, branches, commits, and Pull Requests with no code required. </p>

       <p class="f4 fw5 lh-copy ma0 pv2 ">Feeling overwhelmed by GitHub while contributing to ProtoSchool? Send us a good old-fashioned <a href="mailto:protoschool@protocol.ai">email</a> and we'll do our best to help.</p>

      <h2 id="contact">Get in Touch</h2>
      <p class="f4 fw5 lh-copy ma0 pv2 ">
      We use GitHub to organize ProtoSchool. The best place to get in touch
      with questions about event leadership and community engagement is our
      <a href="https://github.com/ProtoSchool/organizing" target="blank">organizing
      repository</a>, where you can open a new issue and our project maintainers will be
      notified and respond. If you have a new tutorial idea or suggestions for
      improving the ProtoSchool website or curriculum, please open an issue in the
      <a href="https://github.com/ProtoSchool/protoschool.github.io" target="blank">
      website repository</a>. For other issues, including Code of Conduct reports,
      please <a href="mailto:protoschool@protocol.ai">email the project maintainers</a>.
      </p>

      <p  class="f4 fw5 lh-copy ma0 pv2 "><router-link to="/news">Subscribe to our newsletter</router-link> for updates on new tutorials and site features, with an option to receive additional news and guidance for local event leaders.</p>

      <h2>Code of Conduct</h2>
      <p class="f4 fw5 lh-copy ma0 pv2 ">
      We strive to make ProtoSchool a welcoming place for all community members.
      All community members, including organizers of local events, must abide by the
      <a href="https://github.com/protoschool/organizing/blob/master/CODE_OF_CONDUCT.md">
      Code of Conduct</a> outlined in our organizing repository. Each local ProtoSchool
      workshop is also required to maintain its own Code of Conduct, which you'll
      find linked from our <router-link to="/events">events page</router-link>.
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
  name: 'Community',
  components: {
    Header,
    Footer
  },
  head () {
    return head()
  }
}
</script>
