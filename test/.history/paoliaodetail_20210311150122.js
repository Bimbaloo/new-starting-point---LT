/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-11 15:00:38
 * @Description: 
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-11 15:01:01
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
      order: 130,
      item: 130,
      item_desc: 130,
      period: 130,
      pl_sfc: 130,
      sfc_qty: 130
    }
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