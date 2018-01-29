<template>
  <div class="hello">
    <div :class="['history-box',{ 'min-history-box': showHistory },{ 'max-history-box': !showHistory }]">
      <i class="el-icon-arrow-left" @click="showHistory = !showHistory" v-show="!showHistory"></i>
      <i class="el-icon-arrow-right" @click="showHistory = !showHistory" v-show="showHistory"></i>
        <div class='history-panal' v-show="!showHistory">
          <h2>查询记录</h2>
          <ul class='history-content' v-for="ul in liData" :key="ul.date">
            <li class="ecorded-time">
              <h3>{{ul.date}}</h3>
            </li>
            <li class="history-messages-everyday" v-for="data in ul.data" @click="findId(data.id)" :data-id='data.id' :key="data.id">
              <ul class='information-record'>
                <li>
                  <span class='circle'></span>
                </li>
                <li class="ecorded-data">{{data.time}}</li>
                <li class="ecorded-module">{{data.oData.tab}}</li>
                <li class='records'>
                  <ul class="detail-record-box">
                    <li class="detail-record" v-for="li in data.oData.keys" :key="li[0]">{{li[0]}}:{{li[1]}}</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
    </div>
    <!-- <div class='history-box' v-show="!showHistory" style='width:50px'>
      <i class="el-icon-arrow-right" @click="showHistory = !showHistory"></i>
    </div> -->
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
      myLocalStorage: [],
      showHistory: true,
      dataName:[{
          itemCode:"stock",
          itemName:"查出库"
        },{
          itemCode:"trace",
          itemName:"溯源"
        },{
          itemCode:"track",
          itemName:"追踪"
        },{
          itemCode:"restrain",
          itemName:"履历"
        },{
          itemCode:"link",
          itemName:"断链"
        },{
          itemCode:"batchNo",
          itemName:"条码"
        },{
          itemCode:"materialCode",
          itemName:"忘了什么码"
        }],
    }
  },
  created() {
    this.a = this.msg
    let _that = this
    bus.$on('id-selected', function(id) {
      _that.a = id

    })
    this.myLocalStorage = JSON.parse(window.localStorage.getItem("history"))
    this.fetchData(); //获取数据
  },
  computed: {
    liData() {
      return this.switchData(this.myLocalStorage)
    }
  },
  methods: {

    fetchData() {
      this.$get('static/data.json').then((oDatas) => {
        //debugger
        oDatas.data.forEach(el=>{
          el.id = this.guid()
        })
        this.myLocalStorage = oDatas.data
      })
    },
    /* 生成随机数函数 */
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    switchData(oldData) {
      let newData = []
      let oData = JSON.parse(JSON.stringify(oldData))
      oData.forEach((el, i) => {
        let a = {
          "date": "",
          "data": []
        }
        a["date"] = el.dateTime.split(" ")[0]
        el.time = el.dateTime.split(" ")[1]
        el.oData.keys = Object.entries(el.oData.keys)
        a["data"].push(el)
        newData.push(a)
        for (let j = i + 1; j < oData.length; j++) {
          if (a["date"] === oData[j].dateTime.split(" ")[0]) {
            oData[j].time = oData[j].dateTime.split(" ")[1]
            oData[j].oData.keys = Object.entries(oData[j].oData.keys)
            a["data"].push(oData[j])
            oData.splice(j, 1)
            j = j - 1
          }
        }
      })
      newData.forEach(e=>{
        e.data.forEach(el=>{
          this.dataName.forEach((data)=>{
            if(data.itemCode === el.oData.tab){
              el.oData.tab = data.itemName
            }
          })
          el.oData.keys.forEach((arr)=>{
            this.dataName.forEach((data)=>{
              if(data.itemCode === arr[0]){
                arr[0] = data.itemName
              }
            })
          })
        })
      })
      return newData
    },
    findId(listId) {
      debugger
      this.myLocalStorage.forEach(el=>{
        if(el.id === listId){
          console.log(el.oData)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.history-box {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
  left: 0;
  top: 0;
  .el-icon-arrow-left,
  .el-icon-arrow-right {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #fff;
    cursor: pointer;
  }
  .history-panal {
    box-sizing: border-box;
    margin-top: 50px;
    padding-left: 15px;
    padding-right: 15px;
    opacity: 1;
    transition: opacity .8s;
    &>h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
    }
    .history-content {
      margin-bottom: 30px;
      >li {
        margin: 20px;
      }
      .ecorded-time {
        &>h3 {
          font-size: 14px;
          color: 14px;
          text-align: left;
          color: #ffffff;
        }
      }
      .history-messages-everyday {
        .information-record {
          display: flex;
          color: #e5e5e5;
          font-size: 12px;
          line-height: 15px;
          cursor: pointer;
          &:hover {
            color: #42af8f;
            .circle {
              border-color: #42af8f;
              position: relative;
            }
            .circle:before {
              content: '';
              border: 2px solid #42af8f;
              border-radius: 50%;
              width: 2px;
              height: 2px;
              display: inline-block;
              position: absolute;
              left: 2px;
              top: 2px;
            }
          }
          &>li {
            margin-right: 10px;
            .circle {
              border: 2px solid #fff;
              border-radius: 50%;
              width: 10px;
              height: 10px;
              display: inline-block;
            }
          }
          .records {
            flex: 1;
            .detail-record-box {
              display: flex;
              flex-wrap: wrap;
              .detail-record {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
.max-history-box {
  transition: width .8s ease;
  width: 400px;
}
.min-history-box {
  transition: width .5s ease;
  width: 50px;
}
ul {
  padding: 0;
}

li {
  list-style: none;
}

</style>
