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
      order: null,
      item: null,
      item_desc: null,
      id: null,
      printer: null,
      period: null
    },
    tableHeight: 500
  },
  created: function () {

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
    //抛料添加
    onAdd: function () {
      app.dialog = layer.open({
        type: 2,
        title: $.i18n.prop('paoliao.js.add_title'),
        skin: 'layer-title-box',
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
        skin: 'layer-title-box',
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
    },
    //设置表格高度
    setTableHeight() {
      this.$nextTick(() => {
        const bodyHeight = document.querySelector('body').offsetHeight
        const titleBoxHeight = document.querySelector('.title-box').offsetHeight
        const searchBoxHeight = document.querySelector('.search-box').offsetHeight
        const tableBoxHeight = 40  // tableBoxHeight的高度
        this.tableHeight = bodyHeight - titleBoxHeight - searchBoxHeight - tableBoxHeight - 50
      })
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