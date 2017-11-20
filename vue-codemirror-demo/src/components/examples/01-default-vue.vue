<template>
  <!-- <md-card> -->
    <!-- <md-card-actions>
      <div class="md-subhead">
        <span>mode: {{ editorOption.mode.ext }}</span>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <span>theme: {{ editorOption.theme }}</span>
      </div>
      <md-button class="md-icon-button"
                 target="_blank"
                 href="https://github.com/surmon-china/vue-codemirror/tree/master/examples/01-default-vue.vue">
        <md-icon>code</md-icon>
      </md-button>
    </md-card-actions> -->
    <div>
          <!-- codemirror -->
          <codemirror v-model="code" 
                      :options="editorOption"
                      @cursorActivity="onEditorCursorActivity"
                      @ready="onEditorReady"
                      @focus="onEditorFocus"
                      @blur="onEditorBlur">
          </codemirror>
        </div>
        <!-- <div class="pre">
          <pre>{{ code }}</pre>
        </div>
      </div>
    </md-card-media>
  </md-card> -->
</template>

<script>
// require active-line.js
require("codemirror/addon/selection/active-line.js");

// styleSelectedText
require("codemirror/addon/selection/mark-selection.js");
require("codemirror/addon/search/searchcursor.js");

// highlightSelectionMatches
require("codemirror/addon/scroll/annotatescrollbar.js");
require("codemirror/addon/search/matchesonscrollbar.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/search/match-highlighter.js");

// keyMap
require("codemirror/mode/clike/clike.js");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/comment/comment.js");
require("codemirror/addon/dialog/dialog.js");
require("codemirror/addon/dialog/dialog.css");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/search/search.js");
require("codemirror/keymap/sublime.js");

// foldGutter
require("codemirror/addon/fold/foldgutter.css");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/comment-fold.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/markdown-fold.js");
require("codemirror/addon/fold/xml-fold.js");

export default {
  name: "exampleVue",
  data() {
    let _that = this
    const code = `<template>
  <h1>Hello World!</h1>
  <codemirror v-model="code" :options="editorOption"></codemirror>
</template>

<script>
  // require('some-codemirror-resource')
  export default {
    data() {
      return {
        code: 'const A = 10',
        editorOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'text/javascript',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: { "Ctrl": "autocomplete" },
          hintOptions:{
            completeSingle: false
          }
        }
      }
    }
  }
<\/script>

<style lang="scss">
  @import './sass/mixins';
  @import './sass/variables';
  main {
    position: relative;
  }
</style>`;
    return {
      code,
      editorOption: {
        tabSize: 4,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        keyMap: "sublime",
        mode: {
          ext: "vue"
        },
        theme: "base16-dark",
        extraKeys: {
          F11(cm) {
           _that.setFullScreen(cm, !_that.isFullScreen(cm));
          },
          Esc(cm) {
            if (_that.isFullScreen(cm)) _that.setFullScreen(cm, false);
          }
        }
      }
    };
  },
  methods: {
    onEditorCursorActivity(codemirror) {
      console.log("onEditorCursorActivity", codemirror);
    },
    onEditorReady(codemirror) {
      console.log("onEditorReady", codemirror);
    },
    onEditorFocus(codemirror) {
      console.log("onEditorFocus", codemirror);
    },
    onEditorBlur(codemirror) {
      console.log("onEditorBlur", codemirror);
    },
    isFullScreen(cm) {
      return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
    },
    winHeight() {
      return (
        window.innerHeight ||
        (document.documentElement || document.body).clientHeight
      );
    },
    setFullScreen(cm, full) {
      var wrap = cm.getWrapperElement(),
        scroll = cm.getScrollerElement();
      if (full) {
        wrap.className += " CodeMirror-fullscreen";
        scroll.style.height = this.winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
      } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        scroll.style.height = "";
        document.documentElement.style.overflow = "";
      }
      cm.refresh();
    }
  }
};
</script>
<style >
.CodeMirror.CodeMirror-fullscreen {
        display: block;
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        z-index: 9999;
      }
</style>

