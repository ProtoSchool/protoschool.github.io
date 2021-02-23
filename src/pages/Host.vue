<template>
  <div>
    <Header/>
    <section class="mw7 center ph3">
      <h1 class="mt4">Organize Local Events</h1>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
        ProtoSchool workshops are run independently by groups and inviduals around the world who
        are excited about introducing others to decentralized web concepts and protocols.
      ProtoSchool is a community-driven effort and is 100% open source. This
      means that anyone can use the ProtoSchool materials and/or host an event, so long as they adhere to our Code of Conduct and event guidelines.</p>
      <p class="f4 fw5 lh-copy ma0 pt3" >All ProtoSchool workshops:</p>
      <ul class="f4 lh-copy">
        <li> Offer learners the chance to <strong>work through one of the <router-link to="/tutorials">
        ProtoSchool tutorials</router-link> in person with support from mentors</strong></li>
        <li> Create a <strong>welcoming and inclusive environment</strong>, supported by a local Code of Conduct aligned with the global <a href="https://github.com/protoschool/organizing/blob/master/CODE_OF_CONDUCT.md">ProtoSchool Code of Conduct</a></li>
        <li> Are <strong>educational</strong> (not commercial or promotional)</li>
        <li> Are <strong>not-for-profit</strong> (free or low-cost to attendees)</li>
      </ul>
      <div class="mv3">
        <ButtonLink class="mb2 mr3" external link="https://github.com/ProtoSchool/organizing/blob/master/RESOURCES.md">
          Explore our event resources
        </ButtonLink>
        <ButtonLink class="mb2" external link="https://forms.gle/t1iEzpQAFSYHhpBr9">
            Add your event to our list
        </ButtonLink>
      </div>

      <h2>How it works</h2>

      <p class="f4 fw5 lh-copy ma0 pv2">Whether you want to lead a single workshop at a conference or incorporate
        our curriculum into the content of a longstanding meetup, we're eager to
        have you share ProtoSchool's content with your local community. If you're hosting a workshop that meets the qualifications listed above, we'll be happy to list it on our website, send you ProtoSchool stickers for your attendees, and share template slide decks and other resources. We'll also connect you with a community of local leaders who can share their experiences hosting ProtoSchool workshops in a variety of groups and settings. </p>

        <h3>Leading an active Meetup or community group with regular monthly
          meetings?
        </h3>
      <p class="f4 fw5 lh-copy ma0 pv2">If your members are interested in the decentralized web,
        consider mixing ProtoSchool workshops into your existing content. If you
        normally bring in speakers to present on IPFS to an audience of developers,
        try changing the format for your next event by offering a hands-on ProtoSchool
        workshop. There's no need to present ProtoSchool content at every event
        hosted by your group, but when you do schedule a ProtoSchool workshop, fill out a quick form to have that event added to our website. We'll
        help our online community find your local group at an event focused on ProtoSchool, and from there they'll learn about the other great content you offer. Meanwhile, you'll be introducing your local community to ProtoSchool so they can discover the rest of our online content.</p>

        <h3>Attending an upcoming conference on the decentralized web?
        </h3>
        <p class="f4 fw5 lh-copy ma0 pv2">Work with the conference organizers to schedule a ProtoSchool workshop as part of the offerings, or schedule an evening events outside of conference hours. Mention the conference when you submit the ProtoSchool workshop for inclusion on our website and we'll be sure our audience knows the events are co-located.</p>

        <h3>Working in a university setting?
        </h3>
        <p class="f4 fw5 lh-copy ma0 pv2">Take a break from lectures one week and let your students explore a ProtoSchool tutorial with hands-on coding challenge, or schedule a ProtoSchool workshop as part of a student or faculty gathering. If your workshop is open to the public, be sure to submit it for our events listings! </p>

        <h3>Wondering what happened to ProtoSchool chapters?</h3>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      We recently switched from a chapter-based community model to an event-based model to
      create a more scalable system that encourages ProtoSchool content to be presented
       either one-off or embedded in a variety of existing educational groups,
       with a lower barrier to entry for event leaders. If you previously attended
       events through a ProtoSchool chapter, you'll now find their upcoming
       ProtoSchool workshops listed on our <router-link to="/events">events page</router-link>,
        including links to learn about other content the group might offer.<p>

        <h2>Ready to get started?</h2>
        <p class="f4 fw5 lh-copy ma0 pv2"  >We're excited to have you join the ProtoSchool community as a local event leader! Please <router-link to="/news">subscribe to our newsletter</router-link> to stay up to date on helpful resources.</p>

      <div class="mv3">
        <ButtonLink class="mb2 mr3" external link="https://github.com/ProtoSchool/organizing/blob/master/RESOURCES.md">
          Explore our event resources
        </ButtonLink>
        <ButtonLink class="mb2" external link="https://forms.gle/t1iEzpQAFSYHhpBr9">
            Add your event to our list
        </ButtonLink>
      </div>

      <h2 class="">Other ways to contribute</h2>
      <p class="f4 fw5 lh-copy ma0 pv2  ">
      Not ready to host events quite yet? We'd love your help
      <router-link to="/build">building new tutorials</router-link>,
      improving existing ones, answering technical questions, or
      making our documentation more clear.
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
import ButtonLink from '../components/buttons/ButtonLink.vue'

export default {
  name: 'Host',
  components: {
    Header,
    Footer,
    ButtonLink
  },
  head () {
    return head()
  }
}
</script>
