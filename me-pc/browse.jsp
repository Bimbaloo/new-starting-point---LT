<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="stylesheet" href="<%=request.getContextPath() %>/resource/css/reset.css?ver=${applicationScope.RE_VER}" />
    <link rel="stylesheet" href="<%=request.getContextPath() %>/resource/element-ui2.0/theme-chalk/index.css?ver=${applicationScope.RE_VER}" />
    <link rel="stylesheet" href="<%=request.getContextPath() %>/resource/css/pod.css?ver=${applicationScope.RE_VER}" />
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/vue.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-1.7.1.min.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery.timers-1.2.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/element-ui2.0/index.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/element-ui2.0/umd/locale/en.js"></script>
    <script type="text/javascript">
      var jsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
        if(jsSrc.indexOf('zh')>=0){
        }else {
        	ELEMENT.locale(ELEMENT.lang.en);
        }
        
      var mobileDataPath = "/mobile-data";
      var loadingFullScreen = true;
      var loadingIndex;
      var getLoadingIndex = function(){
        return loadingIndex;
      }

      var setLoadingIndex = function(_loadingIndex){
        loadingIndex = _loadingIndex;
      }

      var clearLoadingIndex = function(){
        loadingIndex = null;
      }

      var getLayer = function(){
        return layer;
      }
      //设置AJAX的全局默认选项
      $.ajaxSetup( {
        error: function(jqXHR, textStatus, errorMsg) {
            if ("error" === textStatus || jqXHR.status != 200) {
            }
        },
        beforeSend: function(xhr) {
          var ind = getLoadingIndex();
          if(ind == null){		//加载层已经打开时，不需要任何处理，未打开时才开启新的层
            setLoadingIndex(getLayer().load(2, {
                shade: [0.5,'#CCCCCC'] //0.1透明度的白色背景
            }));
            }
        },
        complete: function(xhr, status) {
          var ind = getLoadingIndex();
            if(ind!=null){   //加载层已经关闭时，不需要任何处理，未关闭则关闭当前层
              getLayer().close(ind);
              clearLoadingIndex();
            }
        },
        success: function(result, status, xhr) {
        }
      });
		</script>
  </head>

    <body>
      <div id="dialogApp" v-cloak  class='layer-content-box'>
        <div class="table-box browse-table" style='margin-top:0'>
          <el-table :data="browseData" :highlight-current-row="true" border ref="singleTable" tooltip-effect="light"
            style="width: 100%" :height="tableHeight" @row-dblclick="dbclickRow" @current-change="clickRow" @sort-change="sort" stripe>
            <el-table-column v-for="col in cols" :key="col.name" :prop="col.name" :width="col.width" :label="col.des"
              sortable="custom" :show-overflow-tooltip='true' align='center'>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style='margin:5px 0'>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="pageNumber" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalRow">
            </el-pagination>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button size="small" @click="closeDialog()">
              <core:text name="browse.jsp.cancel" />
            </el-button>
            <el-button size="small" type="primary" @click="okClick()">
              <core:text name="browse.jsp.confirm" />
            </el-button>
          </el-row>
        </div>
      </div>
    </body>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resource/layer/layer.js"></script>
    <script type="text/javascript">
      var dialogApp = new Vue({
        el: "#dialogApp",
        data: {
            cols:[],
            browseData: [],
            currentRow:null,
            pageNumber:1,
            pageSize:100,
            totalRow:0,
            prop:"",
            order:"",
            tableHeight:400
        },
        mounted:function () {
          window.addEventListener('resize', this.setTableHeight) // 监听resize的变化
          var _this = this
          this.$nextTick(function(){
                _this.setTableHeight() 
            }
          )
        },
        destroyed: function () {
          window.removeEventListener('resize', this.setTableHeight) // 组件销毁时取消监听resize的变化
        },
        methods: {
          handleSizeChange:function(pageSize) {
            this.pageSize = pageSize;
            this.getData();
          },
          handleCurrentChange:function(pageNumber) {
            this.pageNumber = pageNumber;
            this.getData();
          },
          getData:function(){
            var browseInfo =  parent.browseInfo;
              var fData = browseInfo._formData;
              fData.logicId = browseInfo._logicId;
              fData.ele = browseInfo._ele;
              var url = mobileDataPath + "/browse/browse";
              fData.pageNumber = this.pageNumber;
              fData.pageSize = this.pageSize;
              fData.prop = this.prop;
              fData.order = this.order;
                $.post(url, fData, function(data) {
                  if (data.isSuccess) {
                    dialogApp.cols = data.cols;
                    dialogApp.browseData = data.browseData;
                    dialogApp.totalRow = data.totalRow;
                  } else {
                  //   FullScreen.showError(dialogApp, data.error);
                  }
                }, 'json');
          },
          browse:function() {
            this.getData();
          },
          clickRow: function(row) {
            this.currentRow = row;
          },
          dbclickRow: function(row, event) {
            parent.browseInfo.browseComplete(row);
            parent.layer.close(parent.browseInfo._index);
          },
          closeDialog: function() {
            parent.layer.close(parent.browseInfo._index);
          },
          okClick:function(row) {
            if(this.currentRow!=null){
              parent.browseInfo.browseComplete(this.currentRow);
              parent.layer.close(parent.browseInfo._index);
            } else {
              parent.layer.close(parent.browseInfo._index);
            }
          },
          sort:function( column, prop, order ){
            if(column.order == "ascending"){
              this.prop = column.prop;
              this.order = "ASC";
              this.getData();
            }else{
              this.prop = column.prop;
              this.order = "DES";
              this.getData();
            }
          },
          // 设置表格高度
          setTableHeight() {
            var _this = this
            this.$nextTick(() => {
              var contentBox = document.querySelector('.layer-content-box').offsetHeight
              var tableBoxHeight = 40  // tableBoxHeight的高度
              _this.tableHeight = contentBox  - tableBoxHeight - 75
            })
          }
        }
      });
      $(document).ready(function() {
          dialogApp.browse();
      });
      </script>
</html>
