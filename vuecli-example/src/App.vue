<template>
  <div id="app">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 800px"
      height="500">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],

      colors: [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        }
      ],
      colors2: [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        }
      ],
      colorShow: true
    };
  },

  created() {
    const num = 3000
    let arr = new Array(num)
    
    for(let i = 0;i<num;i++) {
      arr[i] = {
          date: `${i}`,
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
    }
    this.tableData = arr
  },
  mounted() {
    this.$dragging.$on("dragged", function(data) {
      console.log("开始");
      console.log("dragged", data);
    });
    this.$dragging.$on("dragend", function(data) {
      console.log("结束");
      console.log("dragend", data);
    });
  },
  methods: {
    test: function() {
      this.colors = [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        },
        {
          text: "Burlywood"
        }
      ];
      this.colorShow = !this.colorShow;
    }
  }
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
.playground {
  display: flex;
  margin-top: 4rem;
}
.color-item {
  background: #f5f5f5;
  padding: 0.5rem;
  color: #5f5f5f;
  transition: transform 0.3s;
}
.color-item.dragging {
  background-color: #fff;
}
.color-show {
  display: flex;
  flex-wrap: wrap;
  width: 30rem;
}
.color-box {
  width: 33%;
  height: 6rem;
  background: #efefef;
  line-height: 6rem;
  text-align: center;
  color: #fff;
  transition: transform 0.3s;
}
.color-box.dragging {
  transform: scale(1.1);
}
.in-out-translate-fade-enter-active,
.in-out-translate-fade-leave-active {
  transition: all 0.5s;
}
.in-out-translate-fade-enter,
.in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translate3d(100%, 0, 0);
}
.in-out-translate-fade-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>
