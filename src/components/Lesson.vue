<template>
  <div class="lesson">
    <div class="run">
      <div v-if="output.test" class="output" v-bind="output.test">
        <div class="output-error" v-if="output.test.error">
          {{output.test.error.message}}
          <br>
          {{output.test.error.stack}}
        </div>
        <div class="output-fail" v-if="output.test.fail">
          {{output.test.fail}}
        </div>
        <div class="output-success" v-if="output.test.success">
          {{output.test.success}}
          <button v-on:click="next">Next Lesson</button>
        </div>
      </div>
      <button v-on:click="run">run</button>
    </div>
    <div class="lesson-text" v-html="parsedText">
    </div>
    <div class="editor">
      <MonacoEditor
        height="600"
        width="100%"
        :editorOptions="options"
        class="editor"
        :code="code"
        theme="vs"
        language="javascript"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        >
      </MonacoEditor>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MonacoEditor from 'vue-monaco-editor'
const IPFS = require('ipfs')
const marked = require('marked')

const _eval = async (text, ipfs) => {
  await new Promise(resolve => ipfs.on('ready', resolve))

  // eslint-disable-next-line
  let fn = new Function('ipfs', text)
  let result
  try {
    result = await fn(ipfs)()
  } catch (e) {
    result = {error: e}
  }
  return result
}

const defaultCode = `/* globals ipfs */

const run = async () => {
  // your code goes here!
  // example: ipfs.dag.put({hello: 'world'})
}

return run

`

const output = {}

export default {
  components: {
    MonacoEditor
  },
  data: self => {
    return {
      text: self.$attrs.text,
      code: self.$attrs.code || defaultCode,
      parsedText: marked(self.$attrs.text),
      output,
      IPFS,
      options: {
        selectOnLineNumbers: false,
        lineDecorationsWidth: '2px'
      }
    }
  },
  methods: {
    run: async function () {
      let ipfs = this.createIPFS()
      let code = this.editor.getValue()
      let result = await _eval(code, ipfs)
      if (result && result.error) {
        Vue.set(output, 'test', result)
        return
      }
      let test = await this.$attrs.validate(result, ipfs)
      Vue.set(output, 'test', test)
      ipfs.stop()
    },
    createIPFS: function () {
      if (this.$attrs.createIPFS) {
        return this.$attrs.createIPFS()
      } else {
        return new IPFS({repo: Math.random().toString()})
      }
    },
    onMounted: function (editor) {
      this.editor = editor
    },
    onCodeChange: function (editor) {
      // console.log(editor.getValue())
    },
    next: function () {
      Vue.set(output, 'test', null)
      let current = this.$route.path.slice(1)
      let next = (parseInt(current) + 1).toString().padStart(2, '0')
      this.$router.push({path: next})
    }
  }
}
</script>

<style scoped>
.lesson {
  display: grid;
  grid-gap: 2%;
  grid-template-columns: 39% 59%;
  grid-template-areas:
    "....... run"
    "lesson-text editor";
  background-color: #fff;
  color: #444;
}
.editor {
  grid-area: editor;
}
.lesson-text {
  grid-area: lesson-text;
}
.run {
  grid-area: run;
}
.output-error {
  background-color: red;
}
.output-fail {
  background-color: pink;
}
.output-success {
  background-color: greenyellow;
}
</style>
