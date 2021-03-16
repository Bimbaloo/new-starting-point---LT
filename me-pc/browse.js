/*
 * @Author: 马燥
 * @Email: 1030102244@qq.com
 * @Date: 2021-03-16 14:21:59
 * @Description: 
 * @LastEditors: 马燥
 * @LastEditTime: 2021-03-16 14:21:59
 */
/**
 * 弹出框
 */
var browseInfo = null;

function initBrowseInfo() {
  browseInfo = {
    _logicId: '',
    _ele: '',
    _returnKey: '',
    _formData: null,
    _app: null,
    _index: null,
    _tableRow: 0,
    browseComplete: function (row) {
      if (this._returnKey != null && this._ele != null) {
        this._app[this._ele] = row[this._returnKey.toUpperCase()];
      }
      try {
        browseCallback(row, this._ele, this._tableRow);
      } catch (e) {
      }
    }
  };
}

var browse = function (title, logicId, ele, returnKey, app, tableRow) {
  initBrowseInfo();
  browseInfo._logicId = logicId;
  browseInfo._ele = ele;
  var formData = JSON.parse(JSON.stringify(app.$data));//app.$data;火狐不支持

  //删除表单中表格数据
  jQuery.each(formData, function (key, val) {
    if (Object.prototype.toString.call(val) === '[object Array]') {
      delete formData[key];
    }
  });

  browseInfo._formData = formData
  browseInfo._returnKey = returnKey;
  browseInfo._app = app;
  browseInfo._tableRow = tableRow;
  var _layer = layer;

  if (parent != null && pApp != null) {	//pod內使用
    parent.browseInfo = browseInfo;
    _layer = parent.layer;
  }
  browseInfo._index = _layer.open({
    type: 2,
    title: title,
    skin: 'layer-title-box',
    maxmin: true,
    scrollbar: false,
    shadeClose: false, //点击遮罩关闭层
    area: ['890px', '530px'],
    content: '/sunny/com/sunny/jsp/common/browse.jsp'
  });
}