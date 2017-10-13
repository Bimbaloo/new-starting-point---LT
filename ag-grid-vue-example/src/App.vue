<template>
  <div id="app">
    <history :msg='msg'></history>
    <button style="width:100px;height:20px" @click="a"></button>
  </div>
</template>

<script>
import history from './components/history'
import { bus } from './assets/bus.js'
export default {
  name: 'app',
  data () {
    return {
      msg: '1111'
    }
  },
  components: {
    history
  },
  methods: {
    a(){
      bus.$emit('id-selected', 1)
    }
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
