<template>
  <div>
    <div v-if="isFileLesson" class="f5 fw7 mt4 mb2">
      Step 2: Update code
      <span class="pl1">
        <CompleteIcon v-if="cachedCode" alt="complete" style="height: 1.2rem;" class="v-mid" />
      </span>
    </div>
    <div class="h-100 flex-auto" v-bind:data-cy="editorReady ? 'code-editor-ready' : undefined">
      <span v-if="cachedCode" @click="resetCode" class="textLink" data-cy="reset-code">Reset Code</span>
      <MonacoEditor
        class="editor mt2"
        :height="editorHeight"
        :options="options"
        :value="code"
        theme="vs"
        language="javascript"
        :editorMounted="onMounted"
        @change="onCodeChange" />
    </div>
    <div class="mt2 h-100 flex-auto" v-bind:data-cy="editorReady ? 'solution-editor-ready' : undefined">
      <div v-if="solution" class="mb2 ml3">
        <span v-if="viewSolution" @click="toggleSolution" class="textLink chevron down" data-cy="hide-solution">Hide Solution</span>
        <span v-else @click="toggleSolution" class="textLink chevron right" data-cy="view-solution">View Solution</span>
        <!-- Special hidden buttons only to be used by Cypress for the E2E tests -->
        <span @click="cyReplaceWithSolution" class="dn o-0 textLink fr" data-cy="replace-with-solution">Replace with Solution</span>
        <span @click="cyClearDefaultCode" class="dn o-0 textLink fr" data-cy="clear-default-code">Clear Default Code</span>
      </div>
      <MonacoEditor
        v-show="viewSolution"
        class="editor solution-editor"
        :height="editorHeight"
        :options="Object.assign({}, { readOnly: true }, options)"
        :value="solution"
        theme="vs"
        language="javascript"
        data-cy="solution" />
    </div>
  </div>
</template>

<script>
import CompleteIcon from '../static/images/complete.svg?inline'

import countly from '../utils/countly'
import MonacoEditor from 'monaco-editor-vue'

export default {
  components: {
    MonacoEditor,
    CompleteIcon
  },
  props: {
    isFileLesson: Boolean,
    editorReady: Boolean,
    code: String,
    solution: String,
    cachedCode: Boolean,
    onMounted: Function,
    onCodeChange: Function,
    resetCode: Function,
    expandChallenge: Boolean,
    cyReplaceWithSolution: Function,
    cyClearDefaultCode: Function,
    trackingData: Object
  },
  data: self => {
    return {
      options: {
        selectOnLineNumbers: false,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      },
      viewSolution: false
    }
  },
  methods: {
    toggleSolution: function () {
      this.viewSolution = !this.viewSolution

      if (this.viewSolution) {
        countly.trackEvent(countly.events.CODE_VIEW_SOLUTION, this.trackingData)
      }
    }
  },
  computed: {
    editorHeight: function () {
      if (this.expandChallenge) {
        return undefined
      } else {
        const lineHeight = 18
        // In compact view show at least 12 lines, and at most 25 lines.
        const lines = Math.min(Math.max(this.code.split('\n').length, 12), 25)
        const height = lines * lineHeight
        return height
      }
    }
  }
}
</script>

<style scoped>
.textLink {
  color: blue;
  cursor: pointer;
}

.editor {
  height: 100%;
  min-height: 15rem;
}

.chevron {
  position: relative;
}

.chevron.down::before {
  content: '';
  height: 0px;
  width: 0px;
  position: absolute;
  top: 0;
  right: 100%;
  border-color: blue transparent transparent transparent ;
  border-style: solid;
  border-width: 5px 5px 5px 5px;
  margin-top: 8px;
  margin-right: 5px;
}

.chevron.right::before {
  content: '';
  height: 0px;
  width: 0px;
  position: absolute;
  top: 0;
  right: 100%;
  border-color: transparent transparent transparent blue;
  border-style: solid;
  border-width:  5px 5px 5px;
  margin-top: 5px;
}

.solution-editor {
  filter: invert(1) hue-rotate(170deg) brightness(0.8) grayscale(0.3)
}
</style>
