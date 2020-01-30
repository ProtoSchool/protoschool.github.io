<template>
  <div class="bg-white navy br4 pa3 border-outset">
      <p class="f5 fw7 ma0 pt0 lh-copy ttu teal">{{displayStart}}</p>
      <h3 class="ma0 f3 fw7">{{city}}</h3>
      <p class="f5 fw5 ma0 pt0">
        <span class="fw7">{{country}}</span>
        <span v-if="region"> - {{region}}</span>
      </p>
      <p v-if="groupUrl" class="f5 fw7 ma0 pt2 teal">Hosted by <a :href='groupUrl' target='_blank'>{{groupName}}</a></p>
      <p v-else class="f5 fw7 ma0 pt0 teal">Hosted by {{groupName}}</p>
      <p class="fw7 mb1">Featured Tutorial<span v-if="tutorials.length >1">s</span>:
      </p>
      <ul class="pl4 mt0">
        <li v-for="tutorialId in tutorials">
          <router-link
            :to="`/${getTutorial(tutorialId).url}`">
            {{getTutorial(tutorialId).title}}
          </router-link>
        </li>
      </ul>
      <p class="mb0"><a :href='cocUrl' target='_blank'>Code of Conduct</a></p>
      <div class="button tr">
        <a class="f5 link dim br-pill ph3 pv2 mb0 dib white bg-navy mr3" :href="url" target='_blank'>
          <span v-if="isFuture">Attend</span>
          <span v-else>View</span>
        </a>
      </div>
    </div>

</template>
<script>
import moment from 'moment'
import tutorialsList from '../static/tutorials.json'
    // will use util instead after existing PR is merged with different functions there

export default {
  props: {
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
    groupName: String,
    groupUrl: String,
    future: Boolean
  },
  data: self => {
    return {
      tutorialsList
    }
  },
  computed: {
    displayStart: function () {
      return moment(this.startTime).format("ddd, MMM D, YYYY, h:mm a")
    },
    isFuture: function () {
      console.log(this.future)
      console.log(this.date == 'future')
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
//   "groupName": "IPFS Boston",
//   "groupUrl": "https://some.group",
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

  .button a,
  .button a:hover,
  .button a:focus,
  .button a:visited {
    color: white;
    text-decoration: none;
  }

  .border-outset {
    border-left: 1px solid #0b3a53;
    border-top: 1px solid #0b3a53;
    border-bottom: 3px solid #0b3a53;
    border-right: 2px solid #0b3a53;
  }

</style>
