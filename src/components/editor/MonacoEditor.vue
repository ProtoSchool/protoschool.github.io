<template>
  <div :style="style"></div>
</template>

<script>
import debounce from 'lodash.debounce'
import * as monaco from 'monaco-editor'

export default {
  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    code: { type: String, default: '// code \n' },
    language: { type: String, default: 'javascript' },
    theme: { type: String, default: 'vs-dark' }, // vs, hc-black
    options: { type: Object, default: () => {} },
    changeThrottle: { type: Number, default: 0 }
  },
  mounted () {
    this.createMonaco()
  },
  destroyed () {
    this.destroyMonaco()
  },
  computed: {
    style () {
      const { width, height } = this
      const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`
      const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`
      return {
        width: fixedWidth,
        height: fixedHeight
      }
    },
    editorOptions () {
      return Object.assign({}, this.defaults, this.options, {
        value: this.code,
        language: this.language,
        theme: this.theme
      })
    }
  },
  data () {
    return {
      defaults: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true,
        minimap: {
          enabled: false
        }
      }
    }
  },
  watch: {
    language () {
      monaco.editor.setModelLanguage(this.editor.getModel(), this.language)
    }
  },
  methods: {
    editorHasLoaded (editor, monaco) {
      this.editor = editor
      this.monaco = monaco
      this.editor.onDidChangeModelContent(event =>
        this.codeChangeHandler(editor, event)
      )
      this.$emit('mounted', editor)
    },
    codeChangeHandler: function (editor) {
      if (this.codeChangeEmitter) {
        this.codeChangeEmitter(editor)
      } else {
        this.codeChangeEmitter = debounce(
          function (editor) {
            this.$emit('codeChange', editor)
          },
          this.changeThrottle
        )
        this.codeChangeEmitter(editor)
      }
    },
    createMonaco () {
      this.editor = monaco.editor.create(this.$el, this.editorOptions)
      this.editorHasLoaded(this.editor, monaco)
    },
    destroyMonaco () {
      if (typeof this.editor !== 'undefined') {
        this.editor.dispose()
      }
    }
  }
}
</script>
