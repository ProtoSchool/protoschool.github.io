<template>
  <div >
    <header class="bg-navy pa3 flex items-center justify-around">
      <a href='/#/' class="dn db-ns link flex-auto w-third-ns">
        <img src="./home/ipfs-logo.svg" alt="IPFS" style="height: 66px" class="ml3-ns"/>
      </a>
      <a href='/#/' class="link ma0 ttu f3 f1-ns fw4 w-third-ns tc">
        <span class="green">Proto</span>
        <span class="white">school</span>
      </a>
      <div class="w-third-ns tr dn db-ns">
        <img src="./home/ipfs-illustrations-how-3.svg" alt="" style="height: 50px">
      </div>
    </header>
    <section class="db bt border-aqua bw4 indent-1">
      <div class="measure-wide pv3">
        <h1 class="f3">{{lessonTitle}}</h1>
        <div class="lesson-text lh-copy" v-html="parsedText"></div>
        <div v-if="concepts" v-html="parsedConcepts"></div>
      </div>
      <div v-if="exercise"  class="exercise pv4 ph2 ph4-l mb5"
           style="background: #F6F7F9; max-width: 700px">
        <div v-html="parsedExercise"></div>
        <div class="editor bg-white"
             v-bind:class="{large: code.split('\n').length > 12}">
          <MonacoEditor
            :editorOptions="options"
            :code="code"
            theme="vs"
            language="javascript"
            @mounted="onMounted"
            @codeChange="onCodeChange">
          </MonacoEditor>
        </div>
        <div class="pv2">
          <div v-if="output.test" v-bind="output.test">
            <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.error">
              Error: {{output.test.error.message}}
            </div>
            <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.fail">
              {{output.test.fail}}
            </div>
            <div class="lh-copy pv2 ph3 bg-green white" v-if="output.test.success">
              {{output.test.success}}
              <a v-if="output.test.cid"
              class="link fw7 underline-hover dib ph2 mh2 white"  target='explore-ipld' :href='exploreIpldUrl'>
                View in IPLD Explorer
              </a>
            </div>
          </div>
          <div class="lh-copy pv2 ph3" v-else>
            Update the code to complete the exercise. Click <strong>submit</strong> to check your answer.
          </div>
        </div>
        <div class="pt3 ph2 tr">
          <div v-if="output.test && output.test.success">
            <Button v-bind:click="next" class="bg-aqua white">Next</Button>
          </div>
          <div v-else>
            <Button v-bind:click="run" class="bg-green white">Submit</Button>
          </div>
        </div>
      </div>
      <div v-else>
        <Button v-bind:click="next" class="bg-aqua white">Next</Button>
      </div>
    </section>
  </div>
</template>

<script>
import 'highlight.js/styles/github.css'
import Vue from 'vue'
import MonacoEditor from 'vue-monaco-editor'
import Explorer from './Explorer.vue'
import Button from './Button.vue'
const IPFS = require('ipfs')
const CID = require('cids')
const marked = require('marked')

const hljs = require('highlight.js/lib/highlight.js')
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))

marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value
  }
})

const _eval = async (text, ipfs, modules = {}) => {
  await new Promise(resolve => ipfs.on('ready', resolve))

  let fn
  let result
  try {
    // eslint-disable-next-line
    fn = new Function('ipfs', 'require', text)
  } catch (e) {
    result = {error: e}
    return result
  }

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
let oldIPFS

export default {
  components: {
    MonacoEditor,
    Explorer,
    Button
  },
  data: self => {
    return {
      text: self.$attrs.text,
      exercise: self.$attrs.exercise,
      concepts: self.$attrs.concepts,
      code: self.$attrs.code || defaultCode,
      parsedText: marked(self.$attrs.text),
      parsedExercise: marked(self.$attrs.exercise || ''),
      parsedConcepts: marked(self.$attrs.concepts || ''),
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
  computed: {
    exploreIpldUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toBaseEncodedString()
      cid = cid || ''
      return `https://ipfs.io/ipfs/QmeznoNAoUcQdCFEEz4ktv4zLfYYyhVNin28Frsv8LLxCb/#/explore/${cid}`
    }
  },
  methods: {
    run: async function () {
      if (oldIPFS) {
        oldIPFS.stop()
        oldIPFS = null
      }
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
      if (CID.isCID(result)) {
        oldIPFS = ipfs
        Vue.set(output.test, 'cid', result)
      } else {
        ipfs.stop()
      }
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
.editor {
  width: 100%;
  height: 35vh;
}
.large {
  height: 80vh;
}
.code, code {
  border-radius: 3px;
  background-color: rgba(27,31,35,0.05);
  padding: 0.2rem 0.3rem;
  margin: 0 -0.1rem;
  font-size: 85%;
  font-family: SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
}
pre code {
  margin: 0.5rem 0;
  padding: 0.6rem 0.8rem;
  display: block;
  font-size: 12px;
}
.indent-1 {
  padding-left: 1rem;
}
@media screen and (min-width: 60rem) {
  .indent-1 {
    padding-left: 93px;
  }
}
</style>
