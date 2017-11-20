<template>
  <div id="app">
    <img src="./assets/logo.png">
    <ul>
      <li v-for="(i,index) in count">
        <span style="margin-left:5px">count[{{index}}]:{{i}}</span>
      </li>
      <li>max:{{maxCount}}</li>
    </ul>
  <button @click="mutations">mutations</button>
  <button @click="actions">actions</button>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed:{
    count () {
      return this.$store.state.count
    },
    maxCount() {
      return this.$store.getters.maxCount
    }
  },
  methods: {
    mutations(){
      this.$store.commit('increment')
    },
    actions(){
      console.time("actions")
      this.$store.dispatch('incrementAsync')
      console.timeEnd("actions")
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
button {
  width: 100px;
  height: 20px;
}
</style>
