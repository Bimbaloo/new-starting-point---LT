<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <HelloWorld/> -->
    <!-- <exampleVue/> -->
    <Demo/>
  </div>
</template>

<script>

import HelloWorld from './components/HelloWorld'
import Demo from './components/demo'

import exampleVue from './components/examples/01-default-vue.vue'
import example02 from './components/examples/02-text-javascript.vue'
import example03 from './components/examples/03-text-css.vue'
import example04 from './components/examples/04-text-html.vue'
import example05 from './components/examples/05-application-x-httpd-php.vue'
import example06 from './components/examples/06-python.vue'
import example07 from './components/examples/07-text-apl.vue'
import example08 from './components/examples/08-text-x-swift.vue'
import example09 from './components/examples/09-text-x-go.vue'
import example10 from './components/examples/10-text-x-lua.vue'
import example11 from './components/examples/11-text-x-mysql.vue'
import example12 from './components/examples/12-text-custom-mode.vue'
import example13 from './components/examples/13-text-plain-mode.vue'

export default {
  name: 'app',
  components: {
    exampleVue,
    example02,
    example03,
    example04,
    example05,
    example06,
    example07,
    example08,
    example09,
    example10,
    example11,
    example12,
    example13,
    Demo
  }
}
</script>


