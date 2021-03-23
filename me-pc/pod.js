/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-19 10:17:04
 * @Description:
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-19 10:17:04
 */
var app = new Vue({
  el: "#app",
  data: {
    title: '',
    site: SITE_V,
    userId: USER_ID,
    messageText: "",
    OPERATION: "",
    CAN_CHANGE_OPERATION: true,
    RESOURCE: "",
    CAN_CHANGE_RESOURCE: true,
    ORDER: "",
    SHOW_ORDER: true,
    colLength: 12,
    SFC: "",
    SHOW_CODE: false,
    podBtns: [],
    QTY: "",
    QUEUE_QTY: "",
    IN_WORK_QTY: '',
    frameASrc: '',
    frameBSrc: '',
    frameCSrc: '',
    messageType: "",
    barcode: '',
    dialogOperationVisible: false,
    operData: [],
    dialogResourceVisible: false,
    resrceData: [],
    operOrResrceSelection: null,
    showtableData: [],//宣传框
    showdutyData: [],
    detailTableData: [],//通知
    //        peopletableData:[],//紧急联系人
    //SFC回车时执行的按钮ID
    sfcCustomBtnId: "",
    /* DOWNTABLE:[],*/
    UPTABLE: [],
    SHOPORDER: '',
    //browse start
    //        browsetitle:'',
    //        browseDialogVisible:false,
    //        browseData:[],
    //        ele:'',
    //        returnKey:'',
    //        browseObj: {layer: layer},
    //        index:'',
    //        cols:[],
    //browse end
    //        fullscreenLoading: false,
    pageParams: {},
    winIndex: null,
    handleIconClick: function () {
    },
    dialog: null,
    dialogVisible: '',
    dialogShop: '',
    ifSwitchShopOrder: false,
    current_btnId: '',
    lableWidth: {
      jspPeriod: null,
      jspResource: null,
      SFC: null,
      qty: null,
      queue: null,
      inwork: null
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      Object.keys(this.lableWidth).forEach(el => {
        const strLength = document.querySelector(`#${el} .el-form-item__label`).offsetWidth
        this.lableWidth[`${el}`] = strLength
      })
    })
    this.$nextTick(function () {
      Object.keys(this.lableWidth).forEach(el => {
        const strLength = document.querySelector(`#${el} .el-form-item__label`).offsetWidth
        this.lableWidth[`${el}`] = strLength
      })
    })
  },
  methods: {
    resourceChange: function (e) {
      var url = mobileDataPath + "/sfc/resourceChange";
      $.post(url, this.getPostData(), function (data) {
        if (data.isSuccess) {
          app.SHOPORDER = data.oldShopOrder;
        }
      }, 'json');
    },
    trim: function (str) {
      str = (str == null) ? "" : str;
      return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    },
    numSelect: function (obj, tip) {
      if (tip == 1) {
        var con = app.QTY + "";
        app.QTY = con + obj;
      } else if (tip == 2) {
        app.QTY = "";
      } else if (tip == 3) {
        var con = app.QTY + "";
        app.QTY = con.slice(0, -1);
      }
    },
    alterNum: function () {
      layer.open({
        type: 1,
        title: $.i18n.prop('qty'),
        closeBtn: 1,
        shade: 0.1,
        shadeClose: true,
        offset: ['20%', '50%'],
        btn: [$.i18n.prop('yes'), $.i18n.prop('back')],
        content: $('#numDialog')
      });
    },
    set: function () {
      var url = mobileDataPath + "/inspection/setShow";
      var postData = {
        activityId: activityId
      };
      this.fullscreenLoading = true;
      $.post(url, postData, function (ret) {
        hiddenFullscreenLoading(app);    //隐藏加载框
        if (ret.isSuccess) {
          app.showtableData = ret.TABLEDATA;       //宣传狂表格
          //app.peopletableData=ret.PEOTABLEDATA;  //紧急联系人表格
          app.detailTableData = ret.DETAILTABLEDATA;
          hiddenFullscreenLoading(app);
        } else {
          app.showError(ret.error);
        }
      }, "json")

    },
    show: function () {
      layer.open({
        type: 1,
        title: $.i18n.prop('slogan'),
        closeBtn: 1,
        anim: 6,
        //		  		  time:6000,
        maxmin: true,
        area: ['700px', '500px'], //宽高
        closeBtn: 1,
        shade: 0.1,
        shadeClose: true,
        offset: 'auto',
        content: $('#show')
      });

    },
    showDuty: function () {
      layer.open({
        type: 1,
        title: $.i18n.prop('tips'),
        anim: 6,
        //		  		  time:6000,
        maxmin: true,
        area: ['700px', '500px'], //宽高
        closeBtn: 0,
        shade: 0.1,
        shadeClose: true,
        offset: 'auto',
        content: $('#showduty')
      });

    },
    /**
     * logicId:Z_LOGIC对应编号
     * ele:返回时需要更改的值
     * params:参数，多个用,分隔
     * returnKey:返回列
     */
    //        browse:function(title,logicId,ele,params,returnKey) {
    //            app.browseObj.logicId = logicId;
    //            app.browseObj.ele = ele;
    //            app.browseObj.params = params;
    //            app.ele = ele;
    //            app.returnKey = returnKey;
    //            app.index = layer.open({
    //                type: 2,
    //                title: title,
    //                maxmin: true,
    //                scrollbar: false,
    //                shadeClose: false, //点击遮罩关闭层
    //                area : ['890px' , '520px'],
    //                content: '/sunny/com/sunny/jsp/pod/frame/openDialog.jsp'
    //            });
    //        },
    selectionChange: function (selection) {
    },
    demo: function () {
    },
    setSuccess: function (msg) {
      this.messageType = "success";
      this.msgTitle = $.i18n.prop('op_success');
      this.messageText = msg;
    },
    setError: function (msg) {
      this.msgTitle = $.i18n.prop('op_error');
      this.messageType = "error";
      this.messageText = msg;
    },
    setWarning: function (msg) {
      this.msgTitle = "警告:";
      this.messageType = $.i18n.prop('op_warning');
      this.messageText = msg;
    },
    setInfo: function (msg) {
      this.msgTitle = $.i18n.prop('op_info');
      this.messageType = "info";
      this.messageText = msg;
    },
    clear: function () {
      this.messageText = null;
    },
    showSuccess: function (msg, type) {
      this.closeAllMsg();
      this.$message({
        showClose: true,
        message: trimRight(msg),
        duration: durationShowTime,
        type: type || 'success'
      });
    },
    showError: function (msg) {
      playSound();
      //          this.showSuccess(msg, "error");
      this.$alert(msg ? msg : "", $.i18n.prop('error'), {
        type: 'error',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: true
      });
    },
    /*   showItemError: function(msg) {
         playSound();
//          this.showSuccess(msg, "error");
         this.$alert(msg?msg:"", '请先上料或者下料！！！', {
             type : 'error',
           dangerouslyUseHTMLString : true,
           closeOnClickModal : true
           });
       },*/
    showWarning: function (msg) {
      playSound();
      this.showSuccess(msg, "warning");
    },
    showInfo: function (msg) {
      this.showSuccess(msg, "info");
    },
    closeAllMsg: function () {//关闭所有消息
      $(".el-message").hide();
    },
    getPostData: function () {
      var postData = {
        logActivityId: activityId,
        activityId: activityId,
        operation: this.OPERATION,
        resource: this.RESOURCE,
        shopOrder: this.ORDER,
        /* oldShopOrder:this.SHOPORDER,*/
        sfc: this.SFC,
        qty: this.QTY,
        barcode: this.barcode,
        d: new Date().getTime()
      };
      if (this.pageParams) {
        for (var prop in this.pageParams) {
          postData[prop] = this.pageParams[prop];
        }
      }
      return postData;
    },
    validateParams: function () {
      if (!this.validateOpParams()) {
        return false;
      }
      if (!this.SFC) {
        return this.showWarning($.i18n.prop('sfc_empty_error')), false;
      }
      return true;
    },
    validateOpParams: function () {
      if (!this.OPERATION) {
        return this.showWarning($.i18n.prop('operation_empty_error')), false;
      }
      if (!this.RESOURCE) {
        return this.showWarning($.i18n.prop('resource_empty_error')), false;
      }
      return true;
    },
    btnLogic: function (btnId) {
      processBtnLogic(btnId);
    },
    watchOperationChange: function (curVal, oldVal) {
      if (curVal) {
        curVal = curVal.toUpperCase();
      }
      this.OPERATION = curVal;
    },
    watchResourceChange: debounce(function (curVal, oldVal) {
      app.resourceCallback();
    }, 2000),
    watchSfcChange: function (curVal, oldVal) {
      if (curVal) {
        this.SFC = curVal.toUpperCase();
      }
    },
    enterCode: function (e) {
      if (!this.validateOpParams()) {
        return;
      }
      if (!app.barcode) {
        return app.showError($.i18n.prop('iqc_empty_error')), false;
      }
      var url = mobileDataPath + "/base/queryData";
      //            $.post(url, {LOGIC_NO:'SUNNY_QY_SFC_BY_BARCODE', OPERATION:app.OPERATION, RESOURCE:app.RESOURCE, CODE: app.barcode, d: new Date().getTime() }, function(data) {
      $.post(url, { LOGIC_NO: 'SUNNY_QY_SFC_BY_BARCODE_HSF', OPERATION: app.OPERATION, RESOURCE: app.RESOURCE, CODE: app.barcode, d: new Date().getTime() }, function (data) {
        if (data.isSuccess) {
          if (data.RESULTS && data.RESULTS.length > 0) {
            app.QTY = data.RESULTS[0].QTY;
            app.SFC = data.RESULTS[0].SFC;
            app.sfcFocus();
            app.updateSfcQty();
            app.frameSfcCallback();
          } else {
            app.showWarning($.i18n.prop('sfc_not_exist_error'));
            app.SFC = "";
            app.QTY = "";
            app.QUEUE_QTY = "";
            app.IN_WORK_QTY = "";
          }
        } else {
          app.showError(data.error);
        }
      }, 'json');
    },
    confirmSwitch: function () {
      var checkUrl = mobileDataPath + "/sfc/validateSfc";
      $.post(checkUrl, this.getPostData(), function (data) {
        if (data.isSuccess) {
          app.updateSfcQty();
          app.frameSfcCallback();
          app.SHOPORDER = data.shopOrder;
          app.showSuccess(data.msg, 'success');
          layer.close(app.dialogShop);
          if (data.UPTABLE != null && "" != data.UPTABLE) {
            app.UPTABLE = data.UPTABLE;
            app.dialogVisible = layer.open({
              type: 1,
              title: $.i18n.prop('assy_fisrt_error'),
              closeBtn: 1,
              shade: 0.1,
              area: ['70%', '500px'],
              shadeClose: true,
              content: $('#dialogTableVisible')
            });
          }
          //mmz调用按钮
          if (app.current_btnId != null && app.current_btnId != "") {
            btnLogic(app.current_btnId);
          }
        } else {
          app.showError(data.error);
          /* app.sfcFocus();*/
          app.sfcSelected();
          layer.close(app.dialogShop);
          /*    app.resourceChange();
              app.dialogTableVisible = true;
              app.SHOPORDER = data.shopOrder;
              app.DOWNTABLE = data.DOWNTABLE;
              app.UPTABLE = data.UPTABLE;*/
        }
      }, 'json');
    },
    cancelSwitch: function () {
      layer.close(app.dialogShop);
    },
    enterSfc: function (e) {
      if (!this.validateParams()) {
        return;
      }
      if (!app.ifSwitchShopOrder) {
        var checkUrl = mobileDataPath + "/sfc/validateSfc";
        $.post(checkUrl, this.getPostData(), function (data) {
          if (data.isSuccess) {
            app.updateSfcQty();
            app.frameSfcCallback();
          } else {
            app.showError(data.error);
            app.sfcFocus();
          }
        }, 'json');

        //mmz调用按钮
        if (app.sfcCustomBtnId != null && app.sfcCustomBtnId != "") {
          btnLogic(app.sfcCustomBtnId);
        }
        return;
      }
      var url = mobileDataPath + "/sfc/ifSameShopOrder";
      $.post(url, this.getPostData(), function (res) {
        if (res.isSuccess) {
          app.dialogShop = layer.open({
            type: 1,
            title: $.i18n.prop('if_switch_order'),
            closeBtn: 1,
            shade: 0.1,
            area: ['40%', '300px'],
            shadeClose: true,
            content: $('#dialogShopOrder')
          });
        } else {
          if (res.error)
            app.showError(res.error);
          app.updateSfcQty();
          app.frameSfcCallback();
          //mmz调用按钮
          if (app.sfcCustomBtnId != null && app.sfcCustomBtnId != "") {
            btnLogic(app.sfcCustomBtnId);
          }
        }
      }, 'json')
    },
    //上料下料确定按钮
    confirm: function () {
      layer.close(app.dialogVisible);
      app.dialog = layer.open({
        type: 2,
        shade: 0.1,
        shadeClose: true,
        title: $.i18n.prop('item_setting'),
        maxmin: true,
        area: ['70%', '500px'],
        shade: 0,
        content: '/sunny/com/sunny/jsp/loadingitem/loadingItem.jsp',
      });
    },
    //mmz 添加修改sfc，数量方法
    clearSfcQty: function () {
      app.SFC = "";
      app.QTY = "";
      app.QUEUE_QTY = "";
      app.IN_WORK_QTY = "";
    },

    updateSfcQty: function () {
      app.QUEUE_QTY = "";
      app.QTY = "";
      app.IN_WORK_QTY = "";
      var url = mobileDataPath + "/base/queryData";
      $.post(url, { LOGIC_NO: "SUNNY_QY_SFC_STEP_QTY", SFC: app.SFC, OPERATION: app.OPERATION, RESRCE: app.RESOURCE, rd: Math.random() }, function (data) {
        if (data.isSuccess) {
          if (data.RESULTS && data.RESULTS.length > 0) {
            app.QUEUE_QTY = data.RESULTS[0]["QUEUE_QTY"];
            app.IN_WORK_QTY = data.RESULTS[0]["IN_WORK_QTY"];
          } else {
            app.QUEUE_QTY = "", app.IN_WORK_QTY = "";
          }
        } else {
          app.showError(data.error);
          app.sfcFocus();
        }
      }, 'json');
    },
    frameSfcCallback: function () {
      // 检查子页面是否存在SFC回车事件回调, 如果不存在则执行查询SFC数量代码;
      var frameA = $("#frameA")[0];
      if (frameA && frameA.contentWindow && frameA.contentWindow.sfcCallback
        && typeof (frameA.contentWindow.sfcCallback) === 'function') {
        frameA.contentWindow.sfcCallback();
      }
    },
    operationChangeEvent: function () {
      var frameA = $("#frameA")[0];
      if (frameA && frameA.contentWindow && frameA.contentWindow.operCallback
        && typeof (frameA.contentWindow.operCallback) === 'function') {
        frameA.contentWindow.operCallback();
      }
    },
    resourceCallback: function () {
      // 检查子页面是否存在SFC回车事件回调, 如果不存在则执行查询SFC数量代码;
      var frameA = $("#frameA")[0];
      if (frameA && frameA.contentWindow && frameA.contentWindow.resourceCallback
        && typeof (frameA.contentWindow.resourceCallback) === 'function') {
        frameA.contentWindow.resourceCallback();
      }
    },
    sfcFocus: function () {
      $("#POD_SFC").focus();
    },
    sfcSelected: function () {
      $("#POD_SFC").select();
    },
    barcodeSelected: function () {
      $("#POD_CODE").select();
    },
    numFocus: function () {
      $("#NUM").focus();
    },
    initFocus: function () {
      if (app.SHOW_CODE) {
        $("#POD_CODE").focus();
      } else {
        $("#POD_SFC").focus();
      }
    }
  },
  watch: {
    //        OPERATION: 'watchOperationChange',
    RESOURCE: 'watchResourceChange',
    //        SFC: 'watchSfcChange'
  },
  computed: {
  }
});

var activityId = $("#ACTIVITY_ID").val();
var workstation = $("#workstation").val();
$(function () {
  app.initFocus();
  loadPodConf(function () {
    loadPodDefaultView();
  });
  loadBtnConf();
  getSfcCustomBtnId();
});

var loadPodConf = function (callback) {
  var i_operation = $("#operation").val();
  var i_resource = $("#resource").val();
  var url = mobileDataPath + "/pod/loadPodConf";
  $.post(url, { workstation: workstation, d: new Date().getTime() }, function (ret) {
    if (ret.isSuccess === true) {
      var podConf = ret.POD_CONF;
      app.SHOPORDER = ret.oldShopOrder;
      if (podConf && podConf.attrs) {
        if (podConf.attrs["CAN_CHANGE_OPERATION"] === 'false') {
          app.CAN_CHANGE_OPERATION = false;
        }
        if (podConf.attrs["CAN_CHANGE_RESOURCE"] === 'false') {
          app.CAN_CHANGE_RESOURCE = false;
        }
        app.title = podConf.attrs["DESCRIPTION"];
        if (i_operation != null && i_operation != "") {
          app.OPERATION = i_operation;
        } else {
          app.OPERATION = podConf.attrs["OPERATION"];
        }
        if (i_resource != null && i_resource != "") {
          app.RESOURCE = i_resource;
        } else if (podConf.attrs["RESOURCE"] != null) {
          app.RESOURCE = podConf.attrs["RESOURCE"];
        }
        if (podConf.attrs["SHOW_ORDER"] != null && podConf.attrs["SHOW_ORDER"] === 'false') {

        }
        if (podConf.attrs["SHOW_CODE"] != null && podConf.attrs["SHOW_CODE"].toUpperCase() === 'TRUE') {
          app.SHOW_CODE = true;
          app.colLength = 6;
        }
      }
      if (callback && typeof (callback) === 'function') {
        callback();
      }
    } else {
      app.showError(ret.error);
    }
  }, 'json');
}

var loadBtnConf = function (callback) {
  var url = mobileDataPath + "/pod/loadBtnConf";
  $.post(url, { workstation: workstation, d: new Date().getTime() }, function (ret) {
    if (ret.isSuccess === true) {
      var podBtns = ret.POD_BTNS;
      app.podBtns = podBtns;
    } else {
      app.showError(ret.error);
    }
  }, 'json');
}


//获取SFC回车时执行的按钮ID
var getSfcCustomBtnId = function (callback) {
  var url = mobileDataPath + "/pod/getSfcCustomBtnId";
  $.post(url, { ACTIVITY_ID: activityId }, function (ret) {
    var btnId = ret.SFC_ENTER_EXE_BTN_ID;
    app.sfcCustomBtnId = btnId;

  }, 'json');
}

var processBtnLogic = function (btnId) {
  if (!btnId || !workstation) {
    return;
  }
  if (!app.validateOpParams()) {
    return;
  }
  if ('COMPLETE' === btnId || 'PASS' === btnId) {
    validateBoxNo(activityId, app.OPERATION, btnLogic, btnId);
  } else if ('Z_CLEAR_RESRCECF' === btnId) {
    //其他检验,需要弹出确认框
    layer.confirm($.i18n.prop('other_check_confirm'), {
      btn: [$.i18n.prop('ok'), $.i18n.prop('no')] //按钮
    }, function (index) {//是
      layer.close(index);
      btnLogic(btnId);
    }, function () {//否
    });
  } else {
    btnLogic(btnId);
  }
}

var btnLogic = function (btnId) {
  console.log(new Date());
  openSocket();
  console.log(new Date());
  app.clear();
  app.closeAllMsg();

  if (btnId == "XCSCKB") {
    var url = mobileDataPath + "/shortMessage/getData"
    var postData = {};
    $.post(url, postData, function (ret) {
      if (ret.isSuccess) {
        var reportip = ret.reportip;
        window.open(reportip + '/decision/view/form?viewlet=me/现场工序实时监控看板.frm&OPERATION=' + app.OPERATION + '&RESRCE=' + app.RESOURCE + '&SITE=' + app.site, 'newwindow', 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
      }

    }, "json")

    return;
  }

  var url = mobileDataPath + "/pod/doBtnProcess";
  var postData = app.getPostData();
  postData = postData || {};
  postData.workstation = workstation;
  postData.btnId = btnId;
  $.post(url, postData, function (ret) {
    if (ret.isSuccess === true) {
      var rtnResults = ret.RTN_PAGE_RESULT;
      if (rtnResults && rtnResults.length > 0) {
        var el = "";
        for (var idx = 0; idx < rtnResults.length; idx++) {
          el = rtnResults[idx];
          if (typeof (el) === 'object') {
            if (el.PAGE_URL && el.PAGE_URL.indexOf(PAGE_PREFIX) === 0) {
              processPageUrl(el.PAGE_URL.replace(PAGE_PREFIX, ""), el.PANEL, el.BTN_ACTIVITY_ID);
            } else if (el.INFO && el.INFO.indexOf('S:') > -1) {
              app.showSuccess(el.INFO.substr(2));
            } else if (el.INFO && EL.INFO.indexOf('E:') > -1) {
              app.showError(el.INFO.substr(2));
            }
          } else if (typeof (el) === 'string' && el.indexOf(EXPORT_PREFIX) === 0) {
            processExportUrl(el.replace(EXPORT_PREFIX, ""));
          } else {
            app.setWarning("Process button logic.");
          }
        }
      }
      if (btnProcessCallback && typeof (btnProcessCallback) === 'function') {
        btnProcessCallback(btnId, rtnResults);
      }
      app.current_btnId = btnId;
    } else {
      if (!ret.error) {
        FullScreen.showAppError(ret.message);
      } else {
        if (ret.error.indexOf("SUNNYMSG:") == -1) {
          FullScreen.showAppError(ret.error);
        } else {
          var url = mobileDataPath + "/checkAgeing/returnOperation";
          var postData = {};
          postData.MSG = ret.error.split("&")[0];
          app.fullscreenLoading = true;
          $.post(url, postData, function (data) {
            if (data.isSuccess) {
              if (data.message)
                app.showError(data.message);
            } else {
              if (data.error)
                app.showError(data.error);
            }
            hiddenFullscreenLoading(app);
          }, "json");

          url = mobileDataPath + "/checkAgeing/sendMessage";
          postData = {};
          postData.MSG = ret.error.split("&")[0];
          postData.RESULT = ret.error.split("&")[1];
          postData.QTY = ret.error.split("&")[2];
          $.post(url, postData, function (data) {
            if (data.isSuccess) {
              if (data.message)
                app.showError(data.message);
            } else {
              if (data.error)
                app.showError(data.error);
            }
          }, "json");
        }
      }
      if (!app.SHOW_CODE) {
        app.sfcSelected();
      }
    }
  }, 'json');
}

var processPageUrl = function (url, panel, btnActivityId) {
  if (panel === "A" || panel == "") {
    // 在A区域打开页面;
    app.frameASrc = addTimstamp(addActivity(url, btnActivityId));
  } else if (panel === 'B') {
    // 在B区域打开页面;
    app.frameBSrc = addTimstamp(addActivity(url, btnActivityId));
  } else if (panel === 'C') {
    // 在C区域打开页面;
    app.frameCSrc = addTimstamp(addActivity(url, btnActivityId));
  } else if (panel === 'Z') {
    //      window.open(addTimstamp(addActivity(url, btnActivityId)), btnActivityId, 
    //                "width=800,height=600,toolbar=no,scrollbars=no,menubar=no,resizable=yes");
    if ("STANDALONE_AS_BUILT" === btnActivityId) {
      var asBuilt = window.open(addTimstamp(addActivity(url, btnActivityId)), btnActivityId,
        "width=1000,height=600,toolbar=no,scrollbars=no,menubar=no,resizable=yes");
      $(asBuilt).load(function () {
        var asBuiltSfc = asBuilt.document.getElementById("templateForm:tcArea:onepanelv:areaA:asBuiltConfigurationView:PARENT_SFC");
        if (asBuiltSfc) {
          asBuiltSfc.value = app.SFC;
        }
      });
    } else {
      app.winIndex = layer.open({
        type: 2,
        title: " ",
        maxmin: true,
        shadeClose: true, //点击遮罩关闭层
        area: ['800px', '520px'],
        content: addTimstamp(addActivity(url, btnActivityId))
      });
    }
  }
}

var addActivity = function (url, bntActivityId) {
  if (url.indexOf("?") > -1) {
    url += "&ACTIVITY_ID=" + bntActivityId;
  } else {
    url += "?ACTIVITY_ID=" + bntActivityId;
  }
  return url;
}
var addTimstamp = function (url) {
  url += "&d=" + new Date().getTime();
  return url;
}
var processExportUrl = function (url) {
  window.open(addTimstamp(addActivity(url)));
}

var loadPodDefaultView = function () {
  if (!workstation) {
    return;
  }
  var url = mobileDataPath + "/pod/loadDefaultView";
  $.post(url, { workstation: workstation, d: new Date().getTime() }, function (ret) {
    if (ret.isSuccess === true) {
      var DEFAULT_VIEWS = ret.DEFAULT_VIEWS;
      if (DEFAULT_VIEWS && DEFAULT_VIEWS.length > 0) {
        for (var idx = 0; idx < DEFAULT_VIEWS.length; idx++) {
          var view = DEFAULT_VIEWS[idx];
          if (view.PANEL === 'A') {
            app.frameASrc = view.CLASS_OR_PROGRAM;
          } else if (view.PANEL === 'B') {
            app.frameBSrc = view.CLASS_OR_PROGRAM;
          }
        }
      }
    } else {
      app.showError(ret.error);
    }
  }, 'json');
}
var browseCallback = function (row, id) {
  if ("SFC" === id) {
    app.enterSfc();
  } if ("RESOURCE" === id) {
    app.resourceChange();
  }
}
var btnProcessCallback = function (btnId, processResults) {
  if ("START" === btnId || 'COMPLETE' === btnId || 'PASS' === btnId || "SIGNOFF" === btnId) {
    if (app.SFC) {
      app.updateSfcQty();
    }
  }
  if ('COMPLETE' === btnId || 'PASS' === btnId) {
    if (app.barcode) {
      app.barcodeSelected();
    } else {
      app.sfcSelected();
    }
  }
  // 针对于开始;
  for (var idx = 0; idx < processResults.length; idx++) {
    var obj = processResults[idx];
    if (obj && obj.CLEARS_SFC === 'true') {
      if (app.barcode) {
        app.barcodeSelected();
      } else {
        app.sfcSelected();
      }
    }
  }
}

/**
 * 延迟执行
 * 
 * @param {Object}
 *            func
 * @param {Object}
 *            wait
 * @param {Object}
 *            immediate
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    }, wait);
    if (immediate && !timeout)
      func.apply(context, args);
  };
};


function openSocket() {
  var url = mobileDataPath + "/shortMessage/getData"
  var postData = {};
  $.post(url, postData, function (ret) {
    if (ret.isSuccess) {
      if (ret.flag != 'true') {
        return;
      }

      var sessionid = ret.sessionid;
      var ip = ret.ip;
      var reportip = ret.reportip;

      console.log(sessionid);

      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        var socketUrl = "ws://" + ip + ":8082/wserver/" + sessionid;

        console.log(socketUrl);
        if (socket != null) {
          return;
        }
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function (msg) {
          console.log(msg.data);
          //发现消息进入    开始处理前端触发逻辑
          window.open(reportip + '/decision/view/form?viewlet=me%252F%25E7%258E%25B0%25E5%259C%25BA%25E5%25B7%25A5%25E5%25BA%258F%25E5%25AE%259E%25E6%2597%25B6%25E7%259B%2591%25E6%258E%25A7%25E7%259C%258B%25E6%259D%25BF.frm&ref_t=design&ref_c=d3878caf-6e64-4051-bf24-68c23d0b024d&OPERATION=' + app.OPERATION + '&RESRCE=' + app.RESOURCE + '&SITE=' + app.site, 'newwindow', 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        };
        //关闭事件
        socket.onclose = function () {
          socket.close();
          socket = null;
          console.log("websocket已关闭");

          //fullScreen();
          // window.open('http://192.168.170.3:8080/WebReport/ReportServer?formlet=%5B73b0%5D%5B573a%5D%5B7ba1%5D%5B7406%5D%2F%5B73b0%5D%5B573a%5D%5B751f%5D%5B4ea7%5D%5B770b%5D%5B677f%5D.frm&OPERATION='+app.OPERATION+'&RESRCE='+app.RESOURCE+'&SITE='+app.site,'','fullscreen=1, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
          //window.location.href = "http://www.baidu.com"
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    }

  }, "json")
}


var socket;
$(document).ready(function () {
  app.set();
  app.show();
  var checkUrl = mobileDataPath + "/sfc/ifSwitchShopOrder";
  $.post(checkUrl, app.getPostData(), function (data) {
    if (data.isSuccess) {
      app.ifSwitchShopOrder = data.ifSwitchShopOrder;
    } else {
      if (data.error)
        app.showError(data.error);
    }
  }, 'json');

  openSocket();
});

