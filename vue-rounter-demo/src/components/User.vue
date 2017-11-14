<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <router-link to="/edit">Go to edit</router-link>
    <router-link to="/">Go to Hello</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '我是 user.vue 组件'
    }
  },
  created() {
    let oData = sessionStorage.getItem("user")  // 本地缓存里面取值
    if(!oData){                                 // 如果不存在，说明首次进入
      console.log("第一次进入，发起请求")
      this.$nextTick(function(){                 // 请求完成后在本地做标记
          sessionStorage.setItem("user",'true')
      })
    }else {
       console.log("不是第一次进入，不发起请求")
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
</style>
