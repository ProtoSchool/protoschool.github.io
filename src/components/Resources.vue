<template>
  <div class="lesson-text lh-copy">
    <div v-for="(item, idx) in data" :key="`resources-${idx}`" class="mb2">
      <p class="mb2">
        <a class="b blue link" :href="item.link" target="_blank">{{item.title}}</a>
        <span class="ml2 ph1 bg-navy br-pill white f7">{{item.type}}</span>
      </p>
      <p v-if="item.description" class="ma0">{{item.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>
