<template>
  <div class="home">
    <h1>Workshops</h1>

    <h3>Basics</h3>
    <ul>
      <li>
        <router-link to="/01">Lesson 1: Basics</router-link>
      </li>
      <li>
        <router-link to="/02">Lesson 2: TBD</router-link>
      </li>
    </ul>

    <h3>Permanent Web</h3>
    <ul>
      <li>
        <router-link to="/11">Lesson 1: Create a simple DAG node</router-link>
      </li>
      <li>
        <router-link to="/12">Lesson 2: Your first link</router-link>
      </li>
      <li>
        <router-link to="/13">Lesson 3: Create a blog post</router-link>
      </li>
      <li>
        <router-link to="/14">Lesson 2: Linking again</router-link>
      </li>
      <li>
        <router-link to="/15">Lesson 2: More linkage</router-link>
      </li>
      <li>
        <router-link to="/16">Lesson 2: Update the blog</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped>
</style>
