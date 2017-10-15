<template>
  <div id="app">
    <history :msg='msg'></history>
    <!-- <button style="width:100px;height:20px" @click="a"></button> -->
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
html,body, #app {
    height: 100%;
    width: 100%;
}
body {
    background-color: #f2f2f2;
    background: url(./assets/bg.jpg);
    background-size: cover;
    margin: 0;
  }

</style>
