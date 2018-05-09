<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button style="width:200px;height: 40px" @click="show = !show"></button>
    <div v-if='show'>
      <chart
      :options="options"
      :init-options="initOptions"
      ref="sankey"
      theme="ovilia-green"
      auto-resize
      class="aaa"
    />
    </div>

  </div>
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/sankey'
// built-in theme
import 'echarts/theme/dark'
import 'echarts/lib/component/tooltip'

import sankeyData from './data/sankey'
console.log(sankeyData())
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      initOptions: {
        renderer: 'canvas'
      },
      options: sankeyData(),
      show: true
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.aaa {
  width: 100%
}
</style>
