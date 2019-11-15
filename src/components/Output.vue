<template>
  <div class="pt2">
    <div v-if="output.test.error" class="lh-copy pv2 ph3 bg-red white" v-html="parseData(`Error: ${output.test.error.message}`)">
    </div>
    <div
      v-if="output.test.fail"
      class="output-log lh-copy bg-red white"
      v-html="parseData(output.test.fail)" />
    <div class="lh-copy bg-green white" v-if="output.test.success && lessonPassed">
      <span class="output-log" v-html="parseData(output.test.success)" />
      <span v-if="output.test.cid">
        <a
          class="link fw7 underline-hover dib ph2 mh2 white"
          target="_blank"
        :href="exploreIpldUrl">View in IPLD Explorer</a>
        <a
          class="link fw7 underline-hover dib ph2 mh2 white"
          target="_blank"
          :href="inspectCidUrl">View in CID Inspector</a>
      </span>
    </div>
    <div v-if="output.test.log">
      <div v-if="isFileLesson" class="f5 fw7 mt4 mb2">Step 3: Inspect results</div>
      <div v-else class="f5 fw7 mt4 mb2">Inspect results</div>
      <div v-if="output.test.logDesc" class="lh-copy" v-html="parseData(output.test.logDesc)" />
      <highlight-code lang="json" class="output-code">{{output.test.log}}</highlight-code>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    output: Object,
    isFileLesson: Boolean,
    lessonPassed: Boolean,
    parseData: Function
  },
  computed: {
    exploreIpldUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toBaseEncodedString()
      cid = cid || ''
      return `https://explore.ipld.io/#/explore/${cid}`
    },
    inspectCidUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toBaseEncodedString()
      cid = cid || ''
      return `https://cid.ipfs.io/#${cid}`
    }
  }
}
</script>

<style> /* We need this unscoped to override the hljs styles. */
.output-log p {
  word-break: break-word;
  display: inline-block;
  margin: .5rem 1rem;
}

.output-log code {
  background-color: rgba(0, 0, 0, 0.2);
}

.output-code {
  margin: 1rem 0 0 0;
}

.output-code code {
  margin: 0;
  padding: 1rem;
  background: white;
}
</style>
