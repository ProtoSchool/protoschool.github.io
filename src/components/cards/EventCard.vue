<template>
  <Card class="flex flex-column bg-white navy pa4">
    <p class="f5 fw7 ma0 pt0 lh-copy ttu teal">{{displayDate}} {{displayStartTime}}</p>
    <p class="f7 fw5 ma0 pt0 lh-copy ttu teal mb3">
      {{displayTimeZone}}
    </p>
    <div class="ma0 mb1 f3 fw9 ttu">{{ isVirtual ? "Virtual" : city }}</div>
    <p v-if="!isVirtual" class="f5 fw5 ma0 pt0">
      <span v-if="country" class="fw7">{{country}}</span>
      <span v-if="region"> - {{region}}</span>
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
    <ul class="pl4 mt0 mb4 f6 flex-grow">
      <li v-for="tutorialId in tutorials" v-bind:key="tutorialId" class="mb1">
        <router-link
          class="navy event-tutorial-link"
          :to="`/${tutorialsData[tutorialId].url}`"
        >
          {{tutorialsData[tutorialId].title}}
        </router-link>
      </li>
    </ul>
    <div class="event-footer tr flex justify-between items-center">
      <a v-if="cocUrl" class="event-coc gray f7 pv2" :href='cocUrl' target='_blank'>Code of Conduct</a>
      <ButtonLink
        external
        :href="url"
      >
        {{isFuture ? "Attend" : "View"}}
      </ButtonLink>
    </div>
  </Card>
</template>
<script>
import moment from 'moment'

import tutorialsData from '../../utils/tutorials'
import ButtonLink from '../buttons/ButtonLink'
import Card from './SimpleCard.vue'

export default {
  components: {
    Card,
    ButtonLink
  },
  props: {
    isVirtual: Boolean,
    timezone: Object,
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
      tutorialsData
    }
  },
  computed: {
    displayStartTime: function () {
      return moment(this.startTime).format('h:mm a')
    },
    displayDate: function () {
      return moment(this.startTime).format('ddd, MMM D, YYYY')
    },
    displayTimeZone: function () {
      return this.timezone ? `${this.timezone.abbreviation} ${this.timezone.offset}` : ''
    },
    isFuture: function () {
      return this.future
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
  .flex-grow {
    flex-grow: 3;
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
