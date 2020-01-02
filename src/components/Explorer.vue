<template>
  <div class="explorer">
    <iframe :src="src">
    </iframe>
  </div>
</template>

<script>
export default {
  data: self => {
    let cid = self.$attrs.cid.toString()
    let src = `https://ipfs.io/ipfs/QmeznoNAoUcQdCFEEz4ktv4zLfYYyhVNin28Frsv8LLxCb/?embed=true#/explore/${cid}`
    return {src}
  }
}
</script>

<style scoped>
iframe {
  width: 100%;
  height: 50vh;
}
</style>
