<template>
  <div>
    <Header/>
    <section class="w-100 mw7 center ph3">
      <h1 class="mt4">ProtoSchool Newsletter</h1>
      <p class="f4 fw5 lh-copy ma0 pv2">Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features.</p>
      <p class="f4 fw5 lh-copy ma0 pv2">Interested in <router-link to="/host">hosting local ProtoSchool workshops</router-link>? Be sure to check the box to receive additional news and guidance for event leaders.</p>
      <NewsletterSubscription
        class="mv4"
        :hideIfAlreadySubscribed="false"
      />
      <p class="f4 fw5 lh-copy ma0 pv2">Want updates from related projects? Sign up for the <a href="http://eepurl.com/gL2Pi5" target="blank">IPFS</a> or <a href="https://mailchi.mp/filecoin.io/subscribe" target="blank">Filecoin</a> newsletters.</p>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import NewsletterSubscription from '../components/forms/NewsletterSubscription.vue'

export default {
  name: 'News',
  components: {
    Header,
    NewsletterSubscription
  }
}
</script>
