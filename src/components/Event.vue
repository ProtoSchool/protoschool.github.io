<template>
  <Card class="flex flex-column bg-white navy pa4">
    <p class="f5 fw7 ma0 pt0 lh-copy ttu teal mb2">{{displayStart}}</p>
    <h3 class="ma0 mb1 f3 fw9 ttu">{{ virtual ? "Virtual" : city }}</h3>
    <p class="f5 fw5 ma0 pt0">
      <span v-if="!virtual && country" class="fw7">{{country}}</span>
      <span v-if="!virtual && region"> - {{region}}</span>
    </p>
    <p class="f6 fw5 ma0 mt4 navy" v-if="hostedByName || hostedAtName">
      Hosted
      <span v-if="hostedByName"> by
        <span v-if="hostedByUrl"><a class="navy" :href='hostedByUrl' target='_blank'>{{hostedByName}}</a></span>
        <span v-else>{{hostedByName}}</span>
      </span>
      <span v-if="hostedAtName"> at
        <span v-if="hostedAtUrl"><a class="navy" :href='hostedAtUrl' target='_blank'>{{hostedAtName}}</a></span>
        <span v-else>{{hostedAtName}}</span>
      </span>
    </p>
    <p v-else class="f6 fw5 ma0 pt0 navy">Hosted by {{groupName}}</p>
    <p class="fw5 f6 mb2">Featured Tutorial<span v-if="tutorials.length >1">s</span>:
    </p>
    <ul class="pl4 mt0 f6">
      <li v-for="tutorialId in tutorials" v-bind:key="tutorialId" class="mb1">
        <router-link
          class="navy event-tutorial-link"
          :to="`/${getTutorial(tutorialId).url}`"
        >
          {{getTutorial(tutorialId).title}}
        </router-link>
      </li>
    </ul>
    <div class="event-footer flex-grow tr flex justify-between items-end">
      <a v-if="cocUrl" class="event-coc gray f7 pv2" :href='cocUrl' target='_blank'>Code of Conduct</a>
      <a v-else></a>
      <a class="event-cta f5 link dim br-pill ph3 pv2 mb0 dib white bg-navy mt3" :href="url" target='_blank'>
        <span v-if="isFuture">Attend</span>
        <span v-else>View</span>
      </a>
    </div>
  </Card>
</template>
<script>
import moment from 'moment'

import Card from './Card.vue'
import tutorialsList from '../static/tutorials.json'
// will use util instead after existing PR is merged with different functions there

export default {
  components: {
    Card
  },
  props: {
    virtual: Boolean,
    city: String,
    region: String,
    country: String,
    startTime: String,
    endTime: String,
    duration: Number,
    tutorials: Array,
    cocUrl: String,
    url: String,
    type: String,
    hostedByName: String,
    hostedByUrl: String,
    hostedAtName: String,
    hostedAtUrl: String,
    future: Boolean
  },
  data: self => {
    return {
      tutorialsList
    }
  },
  computed: {
    displayStart: function () {
      return moment(this.startTime).format('ddd, MMM D, YYYY, h:mm a')
    },
    isFuture: function () {
      return this.future
    }
    // displayEnd: function () {
    //   return this.endsSameDay ? moment(this.endTime).format("h:mm a") : moment(this.endTime).format("MMMM D, YYYY, h:mm a")
    // },
    // endsSameDay: function () {
    //   return moment(this.startTime).format("YYYY-DD-MMMM") === moment(this.endTime).format("YYYY-DD-MMMM")
    // }
  },
  methods: {
    // will use util instead after existing PR is merged with different functions there
    getTutorial: function (tutorialId) {
      return this.tutorialsList[tutorialId]
    }
  }
}

// SAMPLE EVENT OBJECT FORMAT
// {
//   "city": "Boston",
//   "region": "Massachussetts",
//   "country": "United States of America",
//   "startTime": "2020-10-15T00:05:32",
//   "endTime": "2020-11-15T00:05:32",
//   "duration": 90,
//   "tutorials": ["0002", "0004"],
//   "cocUrl": "https://some.event/coc",
//   "url": "https//some.event",
//   "type": "meetup",
//   "hostedByName": "IPFS Boston",
//   "hostedByUrl": "https://some.group",
//   "hostedAtName": "AwesomeConf",
//   "hostedAtUrl": "https://some.conference",
//   "title": "Are we letting you do this?"
// },

</script>
<style scoped>

<style scoped>
  a,
  a:visited {
    color: navy;
    text-decoration: none;
  }

  a:hover,
  a:focus {
    text-decoration: none;
  }

  .event-footer {
    flex-grow: 3;
  }

  .event-cta,
  .event-cta:hover,
  .event-cta:focus,
  .event-cta:visited {
    color: white;
    text-decoration: none;
  }

  .event-footer .event-coc {
    text-decoration: none;
  }

  .border-outset {
    border-left: 1px solid #0b3a53;
    border-top: 1px solid #0b3a53;
    border-bottom: 3px solid #0b3a53;
    border-right: 2px solid #0b3a53;
  }

</style>
