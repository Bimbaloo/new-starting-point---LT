/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-11 14:17:54
 * @Description:
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-11 15:03:59
 */
var reg = new Vue({
  el: "#reg",
  data: {
    //抛料添加界面
    SHOP_ORDER: "",
    ITEM: "",
    DESCRIPTION: "",
    OPERATION: "",
    TABLE: [],
    multipleSelection: [],
    fullscreenLoading: false,
    lableWidth: {
      add_order: null,
      add_item: null,
      add_item_desc: null,
      add_operation: null
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
    onSave: function () {
      var url = mobileDataPath + "/paoliao/save";
      var postData = {};
      postData.SHOP_ORDER = reg.SHOP_ORDER;
      postData.ITEM = reg.ITEM;
      postData.DESCRIPTION = reg.DESCRIPTION;
      postData.OPERATION = reg.OPERATION;
      postData.SIZE = reg.multipleSelection.length;
      postData.TABLE = reg.multipleSelection;
      reg.fullscreenLoading = true;
      $.post(url, postData, function (data) {
        if (data.isSuccess) {
          parent.layer.close(parent.app.dialog);
          parent.app.onSearch();
        } else {
          if (data.error)
            reg.showError(data.error);
        }
        hiddenFullscreenLoading(reg);
      }, "json");
    },
    onCancel: function () {
      parent.layer.close(parent.app.dialog);
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    autoToggleRow: function (index) {
      reg.$refs.table.toggleRowSelection(reg.TABLE[index], true);
    },
    //时间处理
    timeHandler: function (val) {
      var date = new Date(val);
      var time = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds();
      return time;
    },
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
    OPERATION: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      reg.OPERATION = curVal;
    },
    TABLE: {
      handler: function (curVal, oldVal) {
        for (var i = 0; i < reg.TABLE.length; i++) {
          if (!/^[0-9]{1,}$/.test(reg.TABLE[i].PL_QTY)) {
            if (reg.TABLE[i].PL_QTY != "")
              reg.showError(parent.$.i18n.prop('paoliao.js.check_qty'));
          } else {
            reg.TABLE[i].LEFT_QTY = parseInt(reg.TABLE[i].INV_QTY) - parseInt(reg.TABLE[i].PL_QTY);
          }
        }
      },
      deep: true
    }
  }
});

function init() {
  var url = mobileDataPath + "/paoliao/init";
  var postData = {};
  postData.SHOP_ORDER = parent.app.SHOP_ORDER;
  reg.fullscreenLoading = true;
  $.post(url, postData, function (data) {
    if (data.isSuccess) {
      reg.SHOP_ORDER = data.SHOP_ORDER;
      reg.ITEM = data.ITEM;
      reg.DESCRIPTION = data.DESCRIPTION;
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