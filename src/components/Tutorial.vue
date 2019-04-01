<template>
  <section class="db mw7 center ph2">
    <div class="flex items-start pv4">
      <div class="project-label flex-none tc">
        <h1 class="ma0 f3 fw6 pb2">{{project.title}}</h1>
        <img :src="project.logo" :alt="project.title" style="height: 54px"/>
      </div>
      <div class="w-100">
        <h2 class="ma0 f3 fw5"><router-link to="/data-structures/01">{{title}}</router-link></h2>
        <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">{{description}}</p>
        <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
          <template v-for="(lesson, index) in lessons">
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

export default {
  name: 'Tutorial',
  props: {
    project: Object,
    title: String,
    description: String,
    lessons: Array
  },
  components: {
    LessonLink
  }
}
</script>

<style scoped>

.project-label {
  display: none;
}

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
