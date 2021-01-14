<template>
  <div data-cy='resources-content' class='lesson-text lh-copy mb4'>
    <FeedbackSurvey class="mv4" />
    <h1>Resources</h1>
    <p>
      Ready to learn more? There are plenty of additional resources to explore, both in ProtoSchool and beyond.
      <span v-if='data.length > 1'>Here are some of our favorites:</span>
      <span v-else>Here's our top pick:</span>
    </p>
    <div v-for='(item, idx) in data' :key='`resources-${idx}`' class='mb3'>
      <p class='ma0 flex items-center'>
        <a class='b blue link' :href='item.link' target='_blank'>{{item.title}}</a>
        <span class='ml2 ph2 bg-navy br-pill white f7'>{{item.type}}</span>
        <span
          v-if='item.link.includes("/proto.school/")'
          class='ml2 ph2 bg-aqua br-pill white f7'
        >ProtoSchool</span>
      </p>
      <div v-if='item.description' class='ma0 resource-desc' v-html='parse(item.description)'></div>
    </div>
    <div class="flex flex-wrap items-start mb5 mt4" >
      <ButtonLink
        v-for="course in courses(tutorialId)" :key="course.id"
        data-cy="all-tutorials"
        class="bg-navy white mb3 mr3"
        text="All Tutorials"
        :to="`/course/${course.id}`"
      >
        <ProjectIcon
          class="mr2"
          :id="course.id"
          :alt="`${course.name} project logo`"
          style="height: 1.5em;"
        />
        <span>{{course.name}} Course</span>
      </ButtonLink>
    </div>
    <NewsletterSubscription class="mv4" />
  </div>
</template>

<script>
import marked from 'marked'

import ProjectIcon from './icons/ProjectIcon'
import NewsletterSubscription from './forms/NewsletterSubscription.vue'
import FeedbackSurvey from './forms/feedback-survey/FeedbackSurvey.vue'
import ButtonLink from './buttons/ButtonLink.vue'

import { getAll } from '../utils/projects'
import { getTutorialCount, coursesIncludingTutorial } from '../utils/courses'

export default {
  components: {
    NewsletterSubscription,
    FeedbackSurvey,
    ButtonLink,
    ProjectIcon
  },
  props: {
    coursesIncludingTutorial: Function,
    project: String,
    tutorialId: String,
    data: Array

  },
  methods: {
    parse (description) {
      return marked(description || '')
    },
    courses (tutorialId) {
      return getAll()
        .filter(course => coursesIncludingTutorial(tutorialId).includes(course.id))
        .sort((a, b) => getTutorialCount(b.id) - getTutorialCount(a.id))
    }
  }
}
</script>

<style>
.resource-desc > p {
  margin-top: 0;
}
</style>
