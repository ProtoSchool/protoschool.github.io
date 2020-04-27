<template>
  <div>
    <Header/>
    <section class="w-100 mw7 center ph3">
      <h1 class="mt4">ProtoSchool Newsletter</h1>
      <NewsletterSubscription class="mv4" :hideIfAlreadySubscribed="false" />
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
