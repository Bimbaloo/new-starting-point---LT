<template>
<div>   
      <!-- Bidirectional data binding（双向数据绑定） -->
  <codemirror ref="myEditor" v-model="code" :options="editorOptions"></codemirror>
  <button @click="autoFormatSelection()">Autoformat Selected</button>
  <button @click="commentSelection(true)">Comment Selected</button>
  <button @click="commentSelection(false)">Uncomment Selected</button>
</div>

</template>

<script>
  // 格式化插件
  require('codemirror-formatting/formatting.js')

  // require active-line.js
  require('codemirror/addon/selection/active-line.js')

  // styleSelectedText
  require('codemirror/addon/selection/mark-selection.js')
  require('codemirror/addon/search/searchcursor.js')

  // hint
  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')
  require('codemirror/addon/selection/active-line.js')

  // highlightSelectionMatches
  require('codemirror/addon/scroll/annotatescrollbar.js')
  require('codemirror/addon/search/matchesonscrollbar.js')
  require('codemirror/addon/search/searchcursor.js')
  require('codemirror/addon/search/match-highlighter.js')

  // keyMap
  require('codemirror/mode/clike/clike.js')
  require('codemirror/addon/edit/matchbrackets.js')
  require('codemirror/addon/comment/comment.js')
  require('codemirror/addon/dialog/dialog.js')
  require('codemirror/addon/dialog/dialog.css')
  require('codemirror/addon/search/searchcursor.js')
  require('codemirror/addon/search/search.js')
  require('codemirror/keymap/sublime.js')

  // foldGutter
  require('codemirror/addon/fold/foldgutter.css')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/comment-fold.js')
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/indent-fold.js')
  require('codemirror/addon/fold/markdown-fold.js')
  require('codemirror/addon/fold/xml-fold.js')
// Similarly, you can also introduce the resource pack you want to use within the component
// require('codemirror/some-resource')
export default {
    name: "Demo",
  data () {
    return {
      code: 'const a = 10',
      editorOptions: {
        tabSize: 4,
          styleActiveLine: false,
          lineNumbers: false,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
          mode: 'text/javascript',
          // hint.js options
          hintOptions:{
            // 当匹配只有一项的时候是否自动补全
            completeSingle: false
          },
          //快捷键 可提供三种模式 sublime、emacs、vim
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: {
            Ctrl: "autocomplete",
            F11(cm) {
              cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            Esc(cm) {
              if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
          }
      }
    }
  },
  methods: {
    onEditorReady(editor) {
      console.log('the editor is readied!', editor)
    },
    onEditorFocus(editor) {
      console.log('the editor is focus!', editor)
    },
    onEditorCodeChange(newCode) {
      console.log('this is new code', newCode)
      this.code = newCode
    },
    getSelectedRange() {
        return { from: this.editor.getCursor(true), to: this.editor.getCursor(false) };
    },
    autoFormatSelection() {
      let range = this.getSelectedRange();
      this.editor.autoFormatRange(range.from, range.to);
    },
    commentSelection(isComment) {
      let range = this.getSelectedRange();
      this.editor.commentRange(isComment, range.from, range.to);
    }      
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor
    }
  },
  mounted() {
    console.log('this is current editor object', this.editor)
    // you can use this.editor to do something...
  }
}
</script>