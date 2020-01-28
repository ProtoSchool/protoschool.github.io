<template>
  <div class="bg-navy white br4 pa3 mb3 event-tile">
      <a :href='url' target='_blank'> <h3 class="ma0 f4 fw7">{{title || 'ProtoSchool Workshop'}}</h3></a>
      <p v-if="groupUrl" class="f5 fw5 ma0 pt2 lh-copy">Hosted by <a :href='url' target='_blank'>{{groupName}}</a></p>
      <p v-else class="f5 fw5 ma0 pt0 lh-copy">Hosted by {{groupName}}</p>
      <p class="f5 fw5 ma0 pt2 lh-copy white">
        <span class="fw7">{{country}}</span>
        <span> - {{city}}</span>
        <span v-if="region">, {{region}}</span>
      </p>
      <p class="f5 fw5 ma0 pt0 lh-copy">{{displayStart}} - {{displayEnd}}</p>

      <p>Explore
        <span v-if="tutorials.length === 1"> this ProtoSchool tutorial </span>
        <span v-else> these ProtoSchool tutorials </span>
        with support from mentors:
      </p>
      <ul>
        <li v-for="tutorialId in tutorials">
          <router-link
            :to="`/${getTutorial(tutorialId).url}`">
            {{getTutorial(tutorialId).title}}
          </router-link>
        </li>
      </ul>
      <p><a :href='cocUrl' target='_blank'>Code of Conduct</a></p>
    </div>

</template>
<script>
import moment from 'moment'
import tutorialsList from '../static/tutorials.json'
    // will use util instead after existing PR is merged with different functions there

export default {
  props: {
    title: String,
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
    groupUrl: String
  },
  data: self => {
    return {
      tutorialsList
    }
  },
  computed: {
    displayStart: function () {
      return moment(this.startTime).format("MMMM D, YYYY, h:mm a")
    },
    displayEnd: function () {
      return this.endsSameDay ? moment(this.endTime).format("h:mm a") : moment(this.endTime).format("MMMM D, YYYY, h:mm a")
    },
    endsSameDay: function () {
      return moment(this.startTime).format("YYYY-DD-MMMM") === moment(this.endTime).format("YYYY-DD-MMMM")
    }
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
  .event-tile {
    max-width: 49%;
    min-height: 167px;
  }
  .event-tile a  {
    color: white;
  }

  .event-tile a:hover,
  .event-tile a:focus {
    color: aqua;
    text-decoration: none;
  }

  @media screen and (max-width: 750px) {
    .events {
      flex-wrap: nowrap;
      flex-direction: column;
    }

    .event-tile {
      max-width: 100%
    }
  }
</style>
