<template>
  <div class="lesson-text lh-copy">
    <p>Ready to learn more? There are plenty of additional resources to explore, both in ProtoSchool and beyond. <span v-if="data.length > 1">Here are some of our favorites:</span> <span v-else>Here's our top pick:</span></p>
    <div v-for="(item, idx) in data" :key="`resources-${idx}`" class="mb3">
      <p class="ma0 flex items-center">
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
