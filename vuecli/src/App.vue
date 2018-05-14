<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- <HelloWorld/> -->
    <xlsx/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import xlsx from './components/xlsx'
export default {
  name: 'App',
  components: {
    HelloWorld,
    xlsx
  },
  data () {
    return {
      workbook: null
    }
  },
  created () {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
