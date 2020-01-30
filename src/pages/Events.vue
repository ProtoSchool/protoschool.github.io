<template>
  <div>
    <Header current="Events"/>
    <section class="mw7 center ph2">
      <h1 class="mt5">Events</h1>
      <p class="f4 fw5 lh-copy ma0 pv3  ">
        ProtoSchool workshops around the globe offer you the
        opportunity to complete our interactive tutorials with the support of
        local mentors. Learn alongside fellow community members at a Meetup, conference, or independent event near you.
      </p>
      <h2>Upcoming Events</h2>
      <div class="flex flex-wrap justify-between items-stretch events-list">
        <Event v-for="(event, index) in futureEvents"
        v-bind="event"
        :key="`future${index}`"
        class="event-tile"
        :future="true" />
      </div>
      <h2>Past Events</h2>
      <div class="flex flex-wrap justify-between items-stretch events-list">
        <Event v-for="(event, index) in pastEvents"
        v-bind="event"
        :key="`past${index}`"
        class="event-tile"
        :future="false" />
      </div>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header'
import Event from '../components/Event'
import eventsList from '../static/events.json'
import moment from 'moment'


export default {
  name: 'events',
  components: {
    Header,
    Event
  },
  data: self => {
    return {
      eventsList,
      today: moment()
    }
  },
  computed: {
    futureEvents: function () {
      return eventsList.filter((event) => this.isFuture(event.startTime)).sort((a, b) => moment(a.startTime) - moment(b.startTime))
    },
    pastEvents: function () {
      return eventsList.filter((event) => !this.isFuture(event.startTime)).sort((a, b) => moment(b.startTime) - moment(a.startTime))
    }
  },
  methods: {
    isFuture: function (date) {
      return (moment(date) >= this.today)
    }

  }
}

</script>

<style>

.events-list {
  margin-left: -10px;
  margin-right: -10px;
}

.event-tile {
  max-width: 48%;
  flex-grow: 1;
  margin: 10px;
}

@media screen and (max-width: 750px) {
  .events {
    flex-wrap: nowrap;
    flex-direction: column;
  }

  .event-tile {
    max-width: 100%;
  }
}
</style>
