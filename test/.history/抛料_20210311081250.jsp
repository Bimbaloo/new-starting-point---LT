<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core"%>
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <jsp:include page="/com/sunny/jsp/common/pod-header.jsp" />
  <style type="text/css">
    body {
      font-family: "Microsoft YaHei"
    }

    .el-col {
      border: 0px;
    }

    .el-row {
      padding-bottom: 5px;
    }

    .el-form-item__label {}
  </style>
</head>

<body>
  <div id="app" v-cloak>
    <el-row type="flex">
      <el-tag type="primary" style="width: 100%; text-align: center; font-family: arial;">
        <core:text name="paoliao.jsp.title" />
      </el-tag>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-form class="demo-ruleForm">
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.order" />：' :label-width=`${lableWidth.paoliaoDefault.order}px`>
            <el-input v-model="SHOP_ORDER">
              <el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = " paoliao.jsp.order" />
              ','BROWSE_SHOP_ORDER_LHJ','SHOP_ORDER','SHOP_ORDER',app)"></el-button>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.item" />：' :label-width=`${lableWidth.paoliaoDefault.item}px`>
            <el-input v-model="ITEM">
              <el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = " paoliao.jsp.item" />
              ','BROWSE_ITEM_LHJ','ITEM','ITEM',app)"></el-button>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.item_desc" />：' :label-width=`${lableWidth.paoliaoDefault.item_desc}px`>
            <el-input v-model="DESCRIPTION">
              <el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "
                paoliao.jsp.item_desc" />','BROWSE_ITEM_DESCRIPTION_LHJ','DESCRIPTION','DESCRIPTION',app)"></el-button>
            </el-input>
            </el-form-item>
          </el-col>

        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-form class="demo-ruleForm">
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.id" />：' :label-width=`${lableWidth.paoliaoDefault.id}px`>
            <el-input v-model="ID">
              <el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = " paoliao.jsp.id" />
              ','BROWSE_PAOLIAO_ID_LHJ','ID','ID',app)"></el-button>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.printer" />：' :label-width=`${lableWidth.paoliaoDefault.printer}px`>
            <el-input v-model="PRINTER_NAME">
              <el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "
                paoliao.jsp.printer" />','BROWSE_PRINTER_NAME','PRINTER_NAME','PRINTER_NAME',app)"></el-button>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label='<core:text name = " paoliao.jsp.period" />：' :label-width=`${lableWidth.paoliaoDefault.printer}px`>
            <el-date-picker v-model="PERIOD" type="daterange" align="right" unlink-panels
              range-separator="<core:text name = " paoliao.jsp.zhi" />" start-placeholder="
            <core:text name="paoliao.jsp.start_period" />" end-placeholder="
            <core:text name="paoliao.jsp.end_period" />">
            </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="2">
        <el-button type="primary" v-on:click="onAdd">
          <core:text name="paoliao.jsp.add" />
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" v-on:click="onSearch">
          <core:text name="paoliao.jsp.search" />
        </el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-table ref="table" :data="TABLE" height="400" border style="width: 100%">
          <el-table-column min-width="200" align="center" prop="ID" label="<core:text name=" paoliao.jsp.id" />">
          </el-table-column>
          <el-table-column min-width="150" align="center" prop="SHOP_ORDER" label="<core:text name="
            paoliao.jsp.order" />">
          </el-table-column>
          <el-table-column min-width="100" align="center" prop="QTY" label="<core:text name=" paoliao.jsp.qty" />">
          </el-table-column>
          <el-table-column min-width="250" align="center" prop="DATE_TIME" label="<core:text name="
            paoliao.jsp.period" />">
          </el-table-column>
          <el-table-column min-width="130" align="center" prop="USER_ID" label="<core:text name="
            paoliao.jsp.creater" />">
          </el-table-column>
          <el-table-column min-width="250" align="center" prop="SFC" label="<core:text name=" SFC" />">
          </el-table-column>
          <el-table-column min-width="150" align="center" prop="OPERATION" label="<core:text name="
            paoliao.jsp.operation" />">
          </el-table-column>
          <el-table-column min-width="130" align="center" prop="BUTTON" label="<core:text name=" paoliao.jsp.op" />">
          <template scope="scope">
            <el-button type="text" @click="detail(scope.$index)">
              <core:text name="paoliao.jsp.detail" />
            </el-button>
            <el-button type="text" @click="printSFC(scope.$index)">
              <core:text name="paoliao.jsp.print_sfc" />
            </el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</body>
<script type="text/javascript"
  src="<%=request.getContextPath() %>/resource/js/paoliao/paoliao.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript"
  src="<%=request.getContextPath() %>/resource/js/browse.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript"
  src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>

</html>