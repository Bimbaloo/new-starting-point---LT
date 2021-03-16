<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<jsp:include page="/com/sunny/jsp/common/pod-header.jsp" />
	</head>
	<body onload="init()">
    <div id="reg" v-cloak class='layer-content-box'>
			<div class="search-box">
				<el-row :gutter="24">
					<el-form  class="demo-ruleForm">	
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.order" />：' :label-width="lableWidth['detail_order']+'px'" id='detail_order'>
								<el-input v-model="SHOP_ORDER" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label='<core:text name = "paoliao.jsp.item" />：' :label-width="lableWidth['detail_item']+'px'" id='detail_item'>
								<el-input v-model="ITEM" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.item_desc" />：' :label-width="lableWidth['detail_item_desc']+'px'" id='detail_item_desc'>
								<el-input v-model="DESCRIPTION" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
        <el-row :gutter="24">
					<el-form class="demo-ruleForm">
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.period" />：' :label-width="lableWidth['detail_period']+'px'" id='detail_period'>
								<el-input v-model="DATE_TIME" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label='<core:text name = "paoliao.jsp.pl_sfc" />：' :label-width="lableWidth['detail_pl_sfc']+'px'" id='detail_pl_sfc'>
								<el-input v-model="SFC" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.sfc_qty" />：' :label-width="lableWidth['detail_sfc_qty']+'px'" id='detail_sfc_qty'>
								<el-input v-model="QTY" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-form>
        </el-row>
			</div>
			<div class="table-box">
				<el-table ref="table" :data="TABLE" height="400" border style="width: 100%" stripe>
					<el-table-column min-width="250" align="center" prop="SFC" label="<core:text name="paoliao.jsp.original_sfc" />">
					</el-table-column>
					<el-table-column min-width="250" align="center" prop="DESCRIPTION" label="<core:text name="paoliao.jsp.item_desc" />">
					</el-table-column>
					<el-table-column  min-width="130" align="center" prop="QTY" label="<core:text name="paoliao.jsp.sfc_qty" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="INV_QTY" label="<core:text name="paoliao.jsp.inv_qty" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="PL_QTY" label="<core:text name="paoliao.jsp.pl_qty" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="LEFT_QTY" label="<core:text name="paoliao.jsp.left_qty" />">
					</el-table-column>
				</el-table>
			</div>
    </div>
	</body>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/paoliao/paoliaoDetail.js?ver=${applicationScope.RE_VER}"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/browse.js?ver=${applicationScope.RE_VER}"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>
</html>