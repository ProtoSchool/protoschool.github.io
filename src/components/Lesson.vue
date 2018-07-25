<template>
  <div class="lesson">
    <div class="lesson-title">
      <h2>{{lessonTitle}}</h2>
    </div>
    <div class="lesson-text" v-html="parsedText">
    </div>
    <div class="editor">
      <MonacoEditor
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
    <div class="run">
      <div class="run-buttons">
        <div class="run-button">
          <button v-on:click="run">run</button>
        </div>
      </div>
      <div v-if="output.test" class="output" v-bind="output.test">
        <div class="output-error" v-if="output.test.error">
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
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MonacoEditor from 'vue-monaco-editor'
const IPFS = require('ipfs')
const marked = require('marked')

const _eval = async (text, ipfs, modules = {}) => {
  await new Promise(resolve => ipfs.on('ready', resolve))

  // eslint-disable-next-line
  let fn = new Function('ipfs', 'require', text)
  let result
  let require = name => {
    if (!modules[name]) throw new Error(`Cannot find modules: ${name}`)
    return modules[name]
  }
  try {
    result = await fn(ipfs, require)()
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
      lessonTitle: self.$attrs.lessonTitle,
      output,
      IPFS,
      options: {
        selectOnLineNumbers: false,
        lineDecorationsWidth: '2px',
        automaticLayout: true
      }
    }
  },
  methods: {
    run: async function () {
      let ipfs = this.createIPFS()
      let code = this.editor.getValue()
      let modules = {}
      if (this.$attrs.modules) modules = this.$attrs.modules
      let result = await _eval(code, ipfs, modules)
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
      console.log(this.$route)
      let current = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
      let next = (parseInt(current) + 1).toString().padStart(2, '0')
      console.log(current, next)
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
    "lesson-title ..."
    "lesson-text editor"
    "... run";
  background-color: #fff;
  color: #444;
  margin: 15px 15px 15px 15px;
}
.editor {
  grid-area: editor;
  width: 100%;
  height: 50vh;
  border: 1px solid #eee;
}
.lesson-text {
  grid-area: lesson-text;
}
.lesson-title {
  grid-area: lesson-title;
}

button {
  border: solid #222 2px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.run {
  grid-area: run;
  padding-top: 5px;
}
.output * {
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
}
.output-error {
  background-color: pink;
}
.output-fail {
  background-color: pink;
}
.output-success {
  background-color: greenyellow;
}
</style>
