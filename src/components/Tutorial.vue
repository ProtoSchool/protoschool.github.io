<template>
  <section class="db mw7 center ph2">
    <div class="flex items-start pv4">
      <div class="project-label flex-none tc">
        <h1 class="ma0 f3 fw6 pb2">{{tutorial.project}}</h1>
        <img :src="ipfsLogo" :alt="tutorial.project" style="height: 54px"/>
      </div>
      <div class="w-100">
        <h2 class="ma0 f3 fw5">
          <template v-if="isLanding !== true">
            <router-link :to="landingLink">{{tutorial.title}}</router-link>
          </template>
          <template v-else>
            {{tutorial.title}}
          </template>
        </h2>
        <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">{{tutorial.description}}</p>
        <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
          <template v-for="(lesson, index) in tutorial.lessons">
            <li :key="index">
              <LessonLink :to="lesson.to" :name="lesson.name" :index="index + 1" />
            </li>
          </template>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import LessonLink from '../components/LessonLink.vue'
import ipfsLogo from '../static/images/ipfs.svg'

export default {
  name: 'Tutorial',
  props: {
    tutorial: Object,
    isLanding: Boolean
  },
  components: {
    LessonLink
  },
  data: () => {
    return {
      ipfsLogo: ipfsLogo
    }
  },
  computed: {
    landingLink: function () {
      return `/${this.tutorial.lessons[0].to.split('/')[1]}/`
    }
  }
}
</script>

<style scoped>
.project-label {
  display: none;
}

h2,
h2 a {
  color: black;
  text-decoration: none;
}

h2 a:focus,
h2 a:hover {
  font-weight: bold;
  text-decoration: underline;
}

@media screen and (min-width: 530px) {
  .project-label {
    display: block;
    width: 93px;
  }
}
</style>
