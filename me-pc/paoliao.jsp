<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<jsp:include page="/com/sunny/jsp/common/pod-header.jsp" />
	</head>
	<body>
		<div id="app" class="content-box">
			<div class="title-box">
				<i class="el-icon-menu"></i>
				<span><core:text name = "paoliao.jsp.title" /></span>
			</div>
			<div class="search-box">
				<el-row :gutter="24">
					<el-form class="demo-ruleForm">
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.order" />：' :label-width="lableWidth['order']+'px'" id='order'>
								<el-input v-model="SHOP_ORDER">
										<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.order" />','BROWSE_SHOP_ORDER_LHJ','SHOP_ORDER','SHOP_ORDER',app)"></el-button>
							</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label='<core:text name = "paoliao.jsp.item" />：' :label-width="lableWidth['item']+'px'" id='item'>
								<el-input v-model="ITEM">
										<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.item" />','BROWSE_ITEM_LHJ','ITEM','ITEM',app)"></el-button>
							</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.item_desc" />：' :label-width="lableWidth['item_desc']+'px'" id='item_desc'>
								<el-input v-model="DESCRIPTION">
										<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.item_desc" />','BROWSE_ITEM_DESCRIPTION_LHJ','DESCRIPTION','DESCRIPTION',app)"></el-button>
							</el-input>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
				<el-row :gutter="24">
					<el-form class="demo-ruleForm">		        	
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.id" />：' :label-width="lableWidth['id']+'px'"  id='id'>
								<el-input v-model="ID">
										<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.id" />','BROWSE_PAOLIAO_ID_LHJ','ID','ID',app)"></el-button>
							</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label='<core:text name = "paoliao.jsp.printer" />：'  :label-width="lableWidth['printer']+'px'"  id='printer'>
								<el-input v-model="PRINTER_NAME">
										<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.printer" />','BROWSE_PRINTER_NAME','PRINTER_NAME','PRINTER_NAME',app)"></el-button>
							</el-input>
							</el-form-item>
						</el-col>       		        	
						<el-col :span="8">
							<el-form-item label='<core:text name = "paoliao.jsp.period" />：' :label-width="lableWidth['period']+'px'" id='period'>
						<el-date-picker v-model="PERIOD" type="daterange" align="right" unlink-panels range-separator="<core:text name = "paoliao.jsp.zhi" />" start-placeholder="<core:text name = "paoliao.jsp.start_period" />" end-placeholder="<core:text name = "paoliao.jsp.end_period" />">
						</el-date-picker>
							</el-form-item>
						</el-col>		 
					</el-form>
				</el-row>
				<el-row type="flex" class="row-bg" justify="center">
					<el-form :inline="true" :model="formInline" class="demo-ruleForm">
						<el-form-item>
							<el-button type="primary" size="small" v-on:click="onAdd"><core:text name = "paoliao.jsp.add" /><i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
							<el-button type="primary" size="small" v-on:click="onSearch"><core:text name = "paoliao.jsp.search" /><i class="el-icon-search el-icon--right"></i></el-button>
						</el-form-item>
					</el-form>
				</el-row>
			</div>
			<div class="table-box">
				<el-table ref="table" :data="TABLE" height="400" border style="width: 100%" stripe>
					<el-table-column min-width="200" align="center" prop="ID" label="<core:text name="paoliao.jsp.id" />">
					</el-table-column>
					<el-table-column min-width="150" align="center" prop="SHOP_ORDER" label="<core:text name="paoliao.jsp.order" />">
					</el-table-column>
					<el-table-column min-width="100" align="center" prop="QTY" label="<core:text name="paoliao.jsp.qty" />">
					</el-table-column>
					<el-table-column min-width="250" align="center" prop="DATE_TIME" label="<core:text name="paoliao.jsp.period" />">
					</el-table-column>
					<el-table-column  min-width="130" align="center" prop="USER_ID" label="<core:text name="paoliao.jsp.creater" />">
					</el-table-column>
					<el-table-column min-width="250" align="center" prop="SFC" label="<core:text name="SFC" />">
					</el-table-column>
					<el-table-column min-width="150" align="center" prop="OPERATION" label="<core:text name="paoliao.jsp.operation" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="BUTTON" label="<core:text name="paoliao.jsp.op" />">
						<template slot-scope="scope">
							<el-button type="text" @click="detail(scope.$index)"><core:text name="paoliao.jsp.detail" /></el-button>
							<el-button type="text" @click="printSFC(scope.$index)"><core:text name="paoliao.jsp.print_sfc" /></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/paoliao/paoliao.js?ver=${applicationScope.RE_VER}"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/browse.js?ver=${applicationScope.RE_VER}"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>
</html>