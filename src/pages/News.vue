<template>
  <div>
    <Header/>
    <section class="w-100 mw7 center ph3">
      <h1 class="mt4">ProtoSchool Newsletter</h1>
      <p>Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features.</p>
      <p>Interested in <router-link to="/host">hosting local ProtoSchool workshops</router-link>? Be sure to check the box to receive additional news and guidance for event leaders.</p>
      <NewsletterSubscription
        class="mv4"
        :hideIfAlreadySubscribed="false"
        tracking="News Page"
      />
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
