<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core" %>
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <jsp:include page="/com/sunny/jsp/common/pod-header.jsp" />
      <link rel="stylesheet"
        href="<%=request.getContextPath() %>/resource/css/reset.css?ver=${applicationScope.RE_VER}" />
      <link rel="stylesheet"
        href="<%=request.getContextPath() %>/resource/css/ncCodeCSHBAddOnly.css?ver=${applicationScope.RE_VER}" />
    </head>

    <body onload="init()">
      <div id="app" v-cloak class="content-box">
        <div class="title-box">
          <i class="el-icon-menu"></i>
          <span>
            <core:text name="ncCodeCSHBAddOnly.jsp.title" />
          </span>
        </div>

        <div class="message-box">
          <div class="message-list">
            <el-table ref="group" highlight-current-row :data="nc_group" @current-change="ncGroupClick" height="180"
              border style="width: 100%">
              <el-table-column prop="NC_GROUP" label='<core:text name="ncCodeCSHBAddOnly.jsp.nc_group" />'>
              </el-table-column>
              <el-table-column prop="DESCRIPTION" label='<core:text name="ncCodeCSHBAddOnly.jsp.desc" />'>
              </el-table-column>
            </el-table>
          </div>
          <div class="message-list">
            <el-table ref="member" highlight-current-row :data="nc_code" @current-change="ncCodeClick" height="180"
              border style="width: 100%">
              <el-table-column prop="NC_CODE" label='<core:text name="ncCodeCSHBAddOnly.jsp.nc_code" />'>
              </el-table-column>
              <el-table-column prop="DESCRIPTION" label='<core:text name="ncCodeCSHBAddOnly.jsp.desc" />'>
              </el-table-column>
            </el-table>
          </div>
          <div class="message-list operate-number-box">
            <el-table ref="table_prd_codes" :data="table_prd_codes" highlight-current-row height="180" border
              style="width: 100%">
              <el-table-column prop="SFC" label='<core:text name="ncCodeCSHBAddOnly.jsp.sfc" />'>
              </el-table-column>
              <el-table-column prop="PRD_QRCODE" label='<core:text name="ncCodeCSHBAddOnly.jsp.barcode" />'>
              </el-table-column>
              <el-table-column prop="OPERATION" label='<core:text name="ncCodeCSHBAddOnly.jsp.operation" />'>
                <template slot-scope="scope">
                  <el-button @click.native.prevent="deleteRow(scope.$index, table_prd_codes)" type="text" size="small">
                    <core:text name="ncCodeCSHBAddOnly.jsp.delete" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="number">
              <core:text name="ncCodeCSHBAddOnly.jsp.barcode_sum" />：{{ table_prd_codes.length }}
            </div>
          </div>
          <div class="barcode-list">
            <template v-if="data_tag.length > 0">
              <el-form ref="form">
                <el-form-item :label="data.DATA_TAG+'：'" v-for="(data,index) in data_tag">
                  <el-input
                    v-if="data.DATA_TYPE != 'C' && data.DATA_FIELD != 'PRD_QRCODE' && data.DATA_FIELD != 'NCGROUP_QRCODE'"
                    v-model="data.DATA_VALUE" :disabled="nc_data_disable" :id="data.DATA_FIELD"
                    onkeyup="toUpperCase();">
                  </el-input>
                  <el-input v-if="data.DATA_TYPE != 'C' && data.DATA_FIELD == 'PRD_QRCODE'" v-model="data.DATA_VALUE"
                    :id="data.DATA_FIELD" @keyup.enter.native="confirmSubmit($event)" onkeyup="toUpperCase();"
                    onpaste="return false;" ondrop="return false;" oninput="cutManualInput()">
                  </el-input>
                  <el-input v-if="data.DATA_TYPE != 'C' && data.DATA_FIELD == 'NCGROUP_QRCODE'"
                    v-model="data.DATA_VALUE" :id="data.DATA_FIELD" @keyup.enter.native="confirmSubmit2($event)"
                    onkeyup="toUpperCase();">
                  </el-input>
                </el-form-item>
                <el-form-item v-if="NC_ITEM_FLAG" label='<core:text name="ncCodeCSHBAddOnly.jsp.nc_item" />'>
                  <el-input v-model="NC_ITEM" readonly>
                    <el-button slot="append" icon="el-icon-search" @click="browse2('<core:text name="
                      ncCodeCSHBAddOnly.jsp.nc_item" />','BROWSE_NC_ITEM_BY_SFC','NC_ITEM','NC_ITEM',app)"></el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
          </div>

        </div>
        <div class="operate-box">
          <el-button type="primary" size="small" v-on:click="add">
            <core:text name="ncCodeCSHBAddOnly.jsp.add" /><i class="el-icon-circle-plus-outline el-icon--right"></i>
          </el-button>
          <el-button type="primary" size="small" v-on:click="clearInput">
            <core:text name="ncCodeCSHBAddOnly.jsp.clear" /><i class="el-icon-delete el-icon--right"></i>
          </el-button>
        </div>
      </div>

    </body>
    <script type="text/javascript"
      src="<%=request.getContextPath() %>/resource/js/pod/ncCode/ncCodeCSHBAddOnly.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript"
      src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>
    <script type="text/javascript"
      src="<%=request.getContextPath() %>/resource/js/browse.js?ver=${applicationScope.RE_VER}"></script>

    </html>