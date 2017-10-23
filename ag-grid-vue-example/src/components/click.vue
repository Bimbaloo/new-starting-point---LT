<template>
  <div class="hello">
      <button v-finger:single-tap="singleTap">单击</button>
  </div>
</template>

<script>

export default {
  name: 'hello',
  props: {
    msg: String
  },
  data() {
    return {
        ok: true
    }
  },
  created() {

  },
  computed: {

  },
  methods: {
      doubleTap() { console.log('双击'); },
      singleTap () { console.log('单击'); }
  }
}
</script>


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
