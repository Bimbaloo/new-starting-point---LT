<template>
  <div id="app">
    <!-- <history :msg='msg'></history> -->
    <!-- <button style="width:100px;height:20px" @click="a"></button> -->
    <click></click>
    <dbclick></dbclick>
    <div style='border:1px solid red'>
      <button @click="listShow()">danji</button> 
       <button @dblclick="legendClickHandle()">shuangjia</button> 
    </div> 
  </div>
</template>

<script>
import history from './components/history'
import click from './components/click'
import dbclick from './components/dbclick'
import { bus } from './assets/bus.js'
export default {
  name: 'app',
  data () {
    return {
      msg: '1111',
      timeout: null 
    }
  },
  components: {
    history,
    click,
    dbclick
  },
  methods: {
    a(){
      bus.$emit('id-selected', 1)
    },
    clear() {   
      if (this.timeout) {  
         window.clearTimeout(this.timeout);  
      }  
    },
    listShow() {
      this.clear();  
      this.timeout = window.setTimeout(()=> {
        return console.log("1") 
      }, 300);  
    },
    legendClickHandle() {
      window.clearTimeout(this.timeout);
      console.log("2")
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
