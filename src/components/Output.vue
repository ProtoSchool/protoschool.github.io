<template>
  <div class="pt2">
    <div v-if="output.test && (output.test instanceof Error || output.test.error)"
      class="output-log lh-copy bg-red white"
      v-html="parseData(`${output.test instanceof Error ? output.test : output.test.error}`)"
    />
    <div
      v-if="output.test.fail"
      class="output-log lh-copy bg-red white"
      v-html="parseData(output.test.fail)"
      data-cy="output-fail"
    />
    <div class="lh-copy bg-green white" v-if="output.test.success && lessonPassed">
      <span class="output-log" data-cy="output-success" v-html="parseData(output.test.success)" />
      <span v-if="output.test.cid">
        <a
          class="link fw7 underline-hover dib ph2 mh2 white"
          target="_blank"
          :href="exploreIpldUrl"
          @click="onClickTrackIPLD"
        >
          View in IPLD Explorer
        </a>
        <a
          class="link fw7 underline-hover dib ph2 mh2 white"
          target="_blank"
          :href="inspectCidUrl"
          @click="onClickTrackCID"
        >
          View in CID Inspector
        </a>
      </span>
    </div>
    <div v-if="output.test.log">
      <div v-if="isFileLesson" class="f5 fw7 mt4 mb2">Step 3: Inspect results</div>
      <div v-else class="f5 fw7 mt4 mb2">Inspect results</div>
      <div v-if="output.test.logDesc" class="lh-copy" v-html="parseData(output.test.logDesc)" />
      <highlight-code class="code-highlight" lang="json" >{{output.test.log}}</highlight-code>
    </div>
  </div>
</template>

<script>
import countly from '../utils/countly'

export default {
  props: {
    output: Object,
    isFileLesson: Boolean,
    lessonPassed: Boolean,
    parseData: Function,
    trackingData: Object
  },
  computed: {
    Error: () => Error,
    exploreIpldUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toString()

      return `https://explore.ipld.io/#/explore/${cid || ''}`
    },
    inspectCidUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toString()

      return `https://cid.ipfs.io/#${cid || ''}`
    }
  },
  methods: {
    onClickTrackIPLD: function () {
      countly.trackEvent(countly.events.LINK_CLICK_IPLD_EXPLORER, {
        ...this.trackingData,
        href: this.exploreIpldUrl,
        type: 'IPLD Explorer'
      })
    },
    onClickTrackCID: function () {
      countly.trackEvent(countly.events.LINK_CLICK_CID_INSPECTOR, {
        ...this.trackingData,
        href: this.inspectCidUrl,
        type: 'CID Inspector'
      })
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

pre.code-highlight {
  border-radius: 3px;
}

pre.code-highlight,
pre.code-highlight > code.hljs {
  background: #ffffff;
  padding: 0.6em;
}
</style>
