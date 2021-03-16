/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-11 15:00:38
 * @Description: 
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-11 15:03:50
 */
var reg = new Vue({
  el: "#reg",
  data: {
    //抛料添加界面
    SHOP_ORDER: "",
    ITEM: "",
    DESCRIPTION: "",
    DATE_TIME: "",
    SFC: "",
    QTY: "",
    TABLE: [],
    fullscreenLoading: false,
    lableWidth: {
      detail_order: null,
      detail_item: null,
      detail_item_desc: null,
      detail_period: null,
      detail_pl_sfc: null,
      detail_sfc_qty: null
    },
    tableHeight: 500
  },
  mounted: function () {
    window.addEventListener('resize', this.setTableHeight) // 监听resize的变化
    this.$nextTick(() => {
      Object.keys(this.lableWidth).forEach(el => {
        const strLength = document.querySelector(`#${el} .el-form-item__label`).offsetWidth
        this.lableWidth[`${el}`] = strLength
      })
      this.setTableHeight()
    })
  },
  destroyed: function () {
    window.removeEventListener('resize', this.setTableHeight) // 组件销毁时取消监听resize的变化
  },
  methods: {
    //报错
    showError: function (msg) {
      this.$message({
        showClose: true,
        message: msg,
        duration: durationShowTime,
        type: 'error'
      });
    },
    //报成功
    showSuccess: function (msg) {
      this.$message({
        showClose: true,
        message: msg,
        duration: durationShowTime,
        type: 'success'
      });
    },
    // 设置表格高度
    setTableHeight() {
      this.$nextTick(() => {
        const contentBox = document.querySelector('.layer-content-box').offsetHeight
        const searchBoxHeight = document.querySelector('.search-box').offsetHeight
        const tableBoxHeight = 40  // tableBoxHeight的高度
        this.tableHeight = contentBox - searchBoxHeight - tableBoxHeight - 30
      })
    }
  },
  watch: {
    SHOP_ORDER: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.SHOP_ORDER = curVal;
    },
    ITEM: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.ITEM = curVal;
    },
    DESCRIPTION: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.DESCRIPTION = curVal;
    },
    DATE_TIME: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.DATE_TIME = curVal;
    },
    SFC: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.SFC = curVal;
    },
    QTY: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.QTY = curVal;
    }
  }
});

function init() {
  var url = mobileDataPath + "/paoliao/detail";
  var postData = {};
  postData.ID = parent.app.TABLE[parent.app.index].ID;
  reg.fullscreenLoading = true;
  $.post(url, postData, function (data) {
    if (data.isSuccess) {
      reg.SHOP_ORDER = data.SHOP_ORDER;
      reg.ITEM = data.ITEM;
      reg.DESCRIPTION = data.DESCRIPTION;
      reg.DATE_TIME = data.DATE_TIME;
      reg.SFC = data.SFC;
      reg.QTY = data.QTY;
      reg.TABLE = data.TABLE;
    } else {
      if (data.error)
        reg.showError(data.error);
    }
    hiddenFullscreenLoading(reg);
  }, "json");
}

var browseCallback = function (row) {

}