<template>
  <div class="hello">
    <h2>{{msg}}</h2>
    <ul>
        <li>111</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: '查询记录功能尝试',
      liData:[]
    }
  },
  created() {
        this.fetchData(); //获取数据
    },
  methods:{
    fetchData() {
        this.$get('static/data.json').then((oData)=>{
            this.liData = oData.data
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
