/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-10 14:18:00
 * @Description: 
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-11 08:12:50
 */
var app = new Vue({
  el: "#app",
  data: {
    //抛料主界面
    SHOP_ORDER: "",
    ITEM: "",
    DESCRIPTION: "",
    ID: "",
    PERIOD: "",
    PRINTER_NAME: "",
    TABLE: [],
    //抛料添加界面索引
    dialog: -1,
    dialog1: -1,
    index: -1,
    fullscreenLoading: false,
    lableWidth: {
      paoliao: {
        order: 130,
        item: 130,
        item_desc: 130,
        id: 130,
        printer: 130,
        period: 130
      },
      paoliaoAdd: {
        SHOP_ORDER_WIDTH: 130,
        ITEM_WIDTH: 130,
        DESCRIPTION_WIDTH: 130,
        OPERATION_WIDTH: 130
      },
      paoliaoDetail: {
        SHOP_ORDER_WIDTH: 130,
        ITEM_WIDTH: 130,
        DESCRIPTION_WIDTH: 130,
        PERIOD_WIDTH: 130,
        SFC_WIDTH: 130,
        QTY_WIDTH: 130
      }
    }
  },
  created: function () {

  },
  methods: {
    //抛料添加
    onAdd: function () {
      app.dialog = layer.open({
        type: 2,
        title: $.i18n.prop('paoliao.js.add_title'),
        maxmin: true,
        area: ['1000px', '500px'],
        shade: 0,
        content: '/sunny/com/sunny/jsp/paoliao/paoliaoAdd.jsp',
        end: function () {
          app.onSearch();
        }
      });
      layer.full(app.dialog);
    },
    //抛料查询
    onSearch: function () {
      var url = mobileDataPath + "/paoliao/search";
      var postData = {};
      //领料信息
      postData.SHOP_ORDER = app.SHOP_ORDER;
      postData.ITEM = app.ITEM;
      postData.DESCRIPTION = app.DESCRIPTION;
      postData.ID = app.ID;
      if (app.PERIOD) {
        if (app.PERIOD[0])
          postData.PRE_PERIOD = app.timeHandler(app.PERIOD[0].toString(), true);
        if (app.PERIOD[1])
          postData.POST_PERIOD = app.timeHandler(app.PERIOD[1].toString(), false);
      }
      app.fullscreenLoading = true;
      $.post(url, postData, function (data) {
        if (data.isSuccess) {
          app.TABLE = data.TABLE;
        } else {
          if (data.error)
            app.showError(data.error);
        }
        hiddenFullscreenLoading(app);
      }, "json");
    },
    detail: function (index) {
      app.index = index;
      app.dialog1 = layer.open({
        type: 2,
        title: $.i18n.prop('paoliao.js.detail_title'),
        maxmin: true,
        area: ['1000px', '500px'],
        shade: 0,
        content: '/sunny/com/sunny/jsp/paoliao/paoliaoDetail.jsp'
      });
      layer.full(app.dialog1);
    },
    printSFC: function (index) {
      var url = mobileDataPath + "/paoliao/printSfc";
      var postData = {};
      postData.SFC = app.TABLE[index].SFC;
      postData.ACTIVITY = activityId;
      postData.PRINTER_NAME = app.PRINTER_NAME;
      $.post(url, postData, function (data) {
        if (data.isSuccess) {
          app.showSuccess($.i18n.prop('paoliao.js.print_success'));
        } else {
          if (data.error)
            app.showError(data.error);
        }
      }, "json");
    },
    //时间处理
    timeHandler: function (val, is_pre) {
      var date = new Date(val);
      if (is_pre) {
        var time = date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate() + ' ' +
          date.getHours() + ':' +
          date.getMinutes() + ':' +
          date.getSeconds();
        return time;
      } else {
        var time = date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate() + ' ' +
          (date.getHours() + 24) + ':' +
          date.getMinutes() + ':' +
          date.getSeconds();
        return time;
      }
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
    }
  },
  watch: {
    SHOP_ORDER: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      app.SHOP_ORDER = curVal;
    },
    ITEM: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      app.ITEM = curVal;
    },
    DESCRIPTION: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      app.DESCRIPTION = curVal;
    },
    ID: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      app.ID = curVal;
    },
    PRINTER_NAME: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      app.PRINTER_NAME = curVal;
    }
  }
});

var browseCallback = function (row) {

}