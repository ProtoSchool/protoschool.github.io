<template>
  <div>
    <Header current="Events"/>
    <section class="mw7 center ph2">
      <h1 class="mt5">Events</h1>
      <p class="f4 fw5 lh-copy ma0 pv3">
        Live ProtoSchool workshops around the globe offer you the
        opportunity to complete our interactive tutorials with the support of
        local mentors. Learn alongside fellow community members at a Meetup, conference, or independent event near you.
      </p>
      <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mv3" to="/host">Host an Event</router-link>
      <h2>Upcoming Events</h2>
      <div v-if="futureEvents().length" class="flex flex-wrap justify-between events-list">
        <Event v-for="event in futureEvents()"
          v-bind="event"
          class="event-tile"
          :key="event.id"
          :future="true"
        />
      </div>
      <div v-else>
        <p class="f4 fw5 lh-copy ma0 pv3">More events coming soon!</p>
      </div>
      <p class="f4 fw5 lh-copy ma0 pv3">Know of an upcoming workshop not listed here? Ask the event organizer to <a href="https://forms.gle/t1iEzpQAFSYHhpBr9" target="_blank">submit it</a>. </p>
      <p class="f4 fw5 lh-copy ma0 pv3">Wish there were more workshops near you? Learn how to <a href="https://forms.gle/t1iEzpQAFSYHhpBr9" target="_blank">host an event</a>!</p>
      <div v-if="pastEvents().length">
        <h2>Past Events
          <span v-if="viewAllPast || (pastEvents().length <= maxRedacted)">(All)</span>
          <span v-else>(Most Recent)</span>
        </h2>
        <div class="flex flex-wrap justify-between events-list">
          <Event v-for="event in pastEvents((viewAllPast ? null : maxRedacted))"
            v-bind="event"
            class="event-tile"
            :key="event.id"
            :future="false"
          />
        </div>
        <div v-if="(pastEvents().length > maxRedacted)" class="mb2">
          <span v-if="viewAllPast" @click="togglePastEvents" class="textLink chevron down">View Only Most Recent Events</span>
          <span v-else @click="togglePastEvents" class="textLink chevron right" data-cy="view-solution">View Older Events</span>
        </div>
      </div>

      <p class="f4 fw5 lh-copy ma0 pv3">View our archived <router-link to="/chapters">chapter listings</router-link>.</p>
    </section>
  </div>
</template>

<script>
import Header from '../components/Header'
import Event from '../components/Event'
import { pastEvents, futureEvents } from '../utils/events'

export default {
  name: 'events',
  components: {
    Header,
    Event
  },
  data: self => {
    return {
      pastEvents,
      futureEvents,
      viewAllPast: false,
      maxRedacted: 4
    }
  },
  methods: {
    togglePastEvents: function () {
      this.viewAllPast = !this.viewAllPast
    }
  },
}

</script>

<style>

.events-list {
  margin-left: -10px;
  margin-right: -10px;
}

.event-tile {
  flex-basis: calc(50% - 20px);
  margin: 10px;
}

@media screen and (max-width: 750px) {
  .events {
    flex-wrap: nowrap;
    flex-direction: column;
  }

  .event-tile {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
