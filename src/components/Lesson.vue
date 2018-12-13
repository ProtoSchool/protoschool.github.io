<template>
  <div>
    <header class="bg-navy pa2 pa3-ns flex items-center justify-around">
      <a href='/#/' class="db-ns link flex-auto">
        <img src="./home/ps_logo_horiz_white.svg" alt="ProtoSchool" style="height: 80px" class="ml3-ns"/>
      </a>
      <div class="tr dn db-ns">
        <img src="./home/ipfs-illustrations-how-3.svg" alt="" style="height: 50px">
      </div>
    </header>

    <div class="flex-l items-start bt border-aqua bw4">
      <section class="pv3 indent-1">
        <h1 class="f3 measure-wide">{{lessonTitle}}</h1>
        <div class="lh-solid v-mid">
          <span class="green v-mid"><span class="b">{{workshopShortname}}</span> | Lesson {{lessonNumber}} of {{lessonsInWorkshop}}</span>
          <span class="pl1"><img v-if="lessonPassed" src="./home/complete.svg" alt="complete" style="height: 1.2rem;" class="v-mid"/></span>
        </div>
        <div class="lesson-text lh-copy measure-wide" v-html="parsedText"></div>
      </section>
      <section v-if="concepts" class='dn db-ns ba border-green ph4 ml3 ml5-l mt5 mb3 mr3 measure' style="background: rgba(105, 196, 205, 10%)">
        <h2 class="f5 fw2 green mt0 nb1 pt3">Useful concepts</h2>
        <div class='f6 lh-copy' v-html="parsedConcepts"></div>
      </section>
    </div>
    <section v-if="exercise" v-bind:class="{expand: expandExercise}" class="indent-1 exercise pb4 pt3 ph3 ph4-l mb3 mr5 flex flex-column" style="background: #F6F7F9;">
      <div class="flex-none">
        <h2 class="mt0 mb2 green fw4 fill-current">
          <span style='vertical-align:-1px'>
            <img v-if="lessonPassed" src="./home/complete.svg" alt="complete" style="height: 1rem;"/>
            <img v-else-if="cachedCode" src="./home/in-progress.svg" alt="complete" style="height: 1rem;"/>
            <img v-else src="./home/not-started.svg" alt="not yet started" style="height: 1rem;"/>
          </span>
          <span class="green ttu f6 pl2 pr1 fw7 v-mid">
            <span v-if="lessonPassed">You did it!</span>
            <span v-else-if="cachedCode">Keep working.</span>
            <span v-else>Try it!</span>
          </span>
          <span class="green f6 fw5 v-mid">
            <span v-if="cachedCode && !lessonPassed">{{cachedStateMsg}}</span>
          </span>
          <div class="fr">
            <button
              v-if="expandExercise"
              title="go smol"
              v-on:click="toggleExpandExercise"
              class='b--transparent bg-transparent green hover-green-muted pointer focus-outline'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"><path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z"></path></svg>
            </button>
            <button
              v-else
              v-on:click="toggleExpandExercise"
              title='embiggen the exercise'
              class='b--transparent bg-transparent charcoal-muted hover-green pointer focus-outline'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"><path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z"></path></svg>
            </button>

          </div>
        </h2>
        <div v-if="exercise" v-html="parsedExercise" class='lh-copy'></div>
      </div>
      <div>
        <span v-if="cachedCode" v-on:click="resetCode" class="textLink fr pb1">Reset Code</span>
      </div>
      <div class="bg-white flex-auto" style='height:100%;'>
        <MonacoEditor
          class="editor"
          srcPath="."
          :height="editorHeight"
          :options="options"
          :code="code"
          theme="vs"
          language="javascript"
          @mounted="onMounted"
          @codeChange="onCodeChange">
        </MonacoEditor>
      </div>
      <div class='flex-none'>
        <div class="pv2">
          <div v-if="output.test && this.cachedCode" v-bind="output.test">
            <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.error">
              Error: {{output.test.error.message}}
            </div>
            <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.fail">
              {{output.test.fail}}
            </div>
            <div class="lh-copy pv2 ph3 bg-green white" v-if="output.test.success && lessonPassed">
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
          <div v-if="((output.test && output.test.success) || lessonPassed) && lessonNumber === lessonsInWorkshop">
            <Button v-bind:click="workshopMenu" class="bg-aqua white">More Workshops</Button>
          </div>
          <div v-else-if="lessonPassed">
            <Button v-bind:click="next" class="bg-aqua white">Next</Button>
          </div>
          <div v-else>
            <Button v-bind:click="run" class="bg-green white">Submit</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="indent-1 mb4 mw-900">
      <div>
        <p>Feeling stuck? We'd love to hear what's confusing so we can improve
        this lesson. Please <a :href="issueUrl" target="_blank">share your questions and feedback</a>.</p>
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
  // be sure this function returns the requested value
}

return run

`
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
      cachedCode: !!localStorage['cached' + self.$route.path],
      code: localStorage[self.cacheKey] || self.$attrs.code || defaultCode,
      parsedText: marked(self.$attrs.text),
      parsedExercise: marked(self.$attrs.exercise || ''),
      parsedConcepts: marked(self.$attrs.concepts || ''),
      cacheKey: 'cached' + self.$route.path,
      cachedStateMsg: '',
      lessonKey: 'passed' + self.$route.path,
      lessonPassed: !!localStorage['passed' + self.$route.path],
      lessonTitle: self.$attrs.lessonTitle,
      issueUrl: `https://github.com/ipfs-shipyard/proto.school/issues/new?labels=question&title=Question+on+Lesson+${self.$route.path.slice(self.$route.path.lastIndexOf('/') + 1)}:+${self.$attrs.lessonTitle}+(${self.$route.path})&body=Have%20a%20question%20or%20suggestion%20regarding%20a%20ProtoSchool%20lesson%3F%20Please%20use%20this%0Atemplate%20to%20share%20it!%0A%0A1.%20URL%20of%20the%20lesson%20that's%20confusing%3A%0A%20https%3A%2F%2Fproto.school%2F%23${self.$route.path}%0A%0A2.%20What%27s%20confusing%20about%20this%20lesson%3F%0A%0A3.%20What%20additional%20context%20could%20we%20provide%20to%20help%20you%20succeed%3F%0A%0A4.%20What%20other%20feedback%20would%20you%20like%20to%20share%20about%20ProtoSchool%3F%0A`,
      output: self.output,
      IPFS,
      expandExercise: false,
      options: {
        selectOnLineNumbers: false,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }
    }
  },
  computed: {

    exploreIpldUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toBaseEncodedString()
      cid = cid || ''
      return `https://ipfs.io/ipfs/QmYJETQ15RAnKXoJxqpXzcvQ2DuQA35UHwJBTjTPCSs9Ky/#/explore/${cid}`
    },
    lessonNumber: function () {
      return parseInt(this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1), 10)
    },
    workshopShortname: function () {
      return this.$route.path.charAt(1).toUpperCase() + this.$route.path.slice(2, this.$route.path.lastIndexOf('/'))
    },
    lessonsInWorkshop: function () {
      let basePath = this.$route.path.slice(0, -2)
      let number = this.$route.path.slice(-2)
      while (this.$router.resolve(basePath + number).route.name !== '404') {
        number++
        number = number.toString().padStart(2, '0')
      }
      return parseInt(number) - 1
    },
    editorHeight: function () {
      if (this.expandExercise) {
        return undefined
      } else {
        const lineHeight = 18
        // In compact view show at least 12 lines, and at most 25 lines.
        const lines = Math.min(Math.max(this.code.split('\n').length, 12), 25)
        const height = lines * lineHeight
        return height
      }
    }
  },
  beforeCreate: function () {
    this.output = {}
    // doesn't work to set lessonPassed in here because it can't recognize lessonKey yet
  },
  updated: function () {
    // runs on page load AND every keystroke in editor AND submit
  },
  beforeUpdate: function () {
    // runs on every keystroke in editor, NOT on page load, NOT on code submit
  },
  methods: {
    run: async function () {
      if (oldIPFS) {
        oldIPFS.stop()
        oldIPFS = null
      }
      let output = this.output
      let ipfs = this.createIPFS()
      let code = this.editor.getValue()
      let modules = {}
      if (this.$attrs.modules) modules = this.$attrs.modules
      let result = await _eval(code, ipfs, modules)

      if (result && result.error) {
        Vue.set(output, 'test', result)
        this.lessonPassed = !!localStorage[this.lessonKey]
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
      if (output.test.success) {
        localStorage[this.lessonKey] = 'passed'
      }
      this.lessonPassed = !!localStorage[this.lessonKey]
    },
    createIPFS: function () {
      if (this.$attrs.createIPFS) {
        return this.$attrs.createIPFS()
      } else {
        return new IPFS({repo: Math.random().toString()})
      }
    },
    resetCode: function () {
      // TRACK? User chose to reset code
      this.code = this.$attrs.code || defaultCode
      // this ^ triggers onCodeChange which will clear cache
      this.editor.setValue(this.code)
      this.clearPassed()
    },
    clearPassed: function () {
      delete localStorage[this.lessonKey]
      this.lessonPassed = !!localStorage[this.lessonKey]
    },
    loadCodeFromCache: function () {
      this.code = localStorage[this.cacheKey]
      this.editor.setValue(this.code)
    },
    onMounted: function (editor) {
      // runs on page load, NOT on every keystroke in editor
      this.editor = editor
      if (this.cachedCode) {
        // TRACK? returned to lesson previously visited
        this.loadCodeFromCache()
        this.cachedStateMsg = "Pick up where you left off. We've saved your code for you!"
        if (this.lessonPassed) {
          this.run()
        }
      } else {
        // TRACK? first time starting lesson
      }
    },
    onCodeChange: function () {
      if (this.editor.getValue() === (this.$attrs.code || defaultCode)) {
        // TRACK? edited back to default state by chance or by 'reset code'
        delete localStorage[this.cacheKey]
        this.cachedCode = !!localStorage[this.cacheKey]
      } else if (this.code === this.editor.getValue()) {
        // TRACK? returned to cached lesson in progress
      } else {
        localStorage[this.cacheKey] = this.editor.getValue()
        this.code = this.editor.getValue()
        this.cachedCode = !!localStorage[this.cacheKey]
        this.cachedStateMsg = "We're saving your code as you go."
      }
    },
    next: function () {
      Vue.set(this.output, 'test', null)
      let current = this.lessonNumber
      let next = (parseInt(current) + 1).toString().padStart(2, '0')
      this.$router.push({path: next})
    },
    workshopMenu: function () {
      Vue.set(this.output, 'test', null)
      this.$router.push({path: '/'})
    },
    toggleExpandExercise: function () {
      this.expandExercise = !this.expandExercise
    }
  }
}
</script>

<style scoped>
.editor {
  height: 100%;
  min-height: 15rem;
}
.exercise {
  overflow: hidden;
  max-width: 100%;
  width: 900px;
}
.exercise.expand {
  height: 100vh;
  width: initial;
  margin: 0;
  width: auto;
  position: fixed;
  top:0;
  left: 0;
  right:0;
}
.indent-1 {
  margin-left: 1rem;
}
.mw-900 {
  max-width: 900px;
}
span.textLink {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}

@media screen and (min-width: 60rem) {
  .indent-1 {
    margin-left: 93px;
  }
}
</style>
