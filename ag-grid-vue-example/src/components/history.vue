<template>
  <div class="hello">
    <h2>{{a}}</h2>
    <button style="width:100px;height:20px" @click="a = '66666'"></button>
    <ul v-for="ul in needDate">
      <li class="date-box" style='font-size: 16px;font-weight:bold'>{{ul.date}}</li>
      <li v-for="data in ul.data">
        <ul class='libox'>
          <li>{{data.time}}</li>
          <li>
            <ul>
              <li v-for="li in data.oData.keys">{{li[0]}}:{{li[1]}}</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <button @click="myLocalStorage = myLocalStorage.concat(myLocalStorage);"></button>
     <ul v-for="ul in needArr">
      <li class="date-box" style='font-size: 16px;font-weight:bold'>{{ul.date}}</li>
      <li v-for="data in ul.data">
        <ul class='libox'>
          <li>{{data.time}}</li>
          <li>
            <ul>
              <li v-for="li in data.oData.keys">{{li[0]}}:{{li[1]}}</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { bus } from '../assets/bus.js'
export default {
  name: 'hello',
  props: {
    msg: String
  },
  data() {
    return {
      liData: [],
      needDate: [],
      myLocalStorage: [],
      needArr: [],
      a:''
    }
  },
  created() {
    this.a = this.msg
    let _that = this
    bus.$on('id-selected', function (id) {
      _that.a = id
      
    })
    this.myLocalStorage = JSON.parse(window.localStorage.getItem("history"))
    this.fetchData(); //获取数据
  },
  watch: {
    myLocalStorage(){
      window.localStorage.setItem("history",JSON.stringify(this.myLocalStorage))
    }
  },
  computed: {
  },
  methods: {

    fetchData() {
      this.$get('static/data.json').then((oDatas) => {
        this.liData = oDatas.data
        var localData = oDatas.data
        var arr = []
        var oData = JSON.parse(JSON.stringify(localData))
        oData.forEach((el,i)=>{
            var a = {
                "date":"",
                "data":[]
            }
            a["date"] = el.dateTime.split(" ")[0]
            el.time = el.dateTime.split(" ")[1]
            el.oData.keys = Object.entries(el.oData.keys)
            delete(el.dateTime)
            a["data"].push(el)
            arr.push(a)
            for (let j = i+1 ; j < oData.length; j++){
                if (a["date"] === oData[j].dateTime.split(" ")[0]){
                    oData[j].time = oData[j].dateTime.split(" ")[1]
                    oData[j].oData.keys = Object.entries(oData[j].oData.keys)
                    delete(oData[j].dateTime)
                    a["data"].push(oData[j])
                    oData.splice(j, 1)
                    j=j-1   
                }
            }
        })
        this.needArr = arr
      })
      this.$get('static/need.json').then((oData) => {
        this.needDate = oData.data
      })
    },
    /* 生成随机数函数 */
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.hello {
  width: 200px;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: block;
  margin: 0 10px;
}

.libox>li {
  display: inline-block;
  margin: 0 3px;
}

a {
  color: #42b983;
}
.date-box {
  text-align: left;
}
</style>
