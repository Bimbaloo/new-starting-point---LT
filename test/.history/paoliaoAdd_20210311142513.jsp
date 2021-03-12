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
            padding-bottom: 15px;
        }
        .el-form-item__label {
        }
     </style>
</head>
<body onload="init()">
    <div id="reg" v-cloak>
		<el-row>
    	</el-row>
        <el-row type="flex" justify="center">
        	<el-col :span="21">
		        <el-form class="demo-ruleForm">
		        	<el-col :span="7">
			        	<el-form-item label='<core:text name = "paoliao.jsp.order" />：' :label-width="lableWidth['order']+'px'" id='order'>
									<el-input v-model="SHOP_ORDER" :disabled="true"></el-input>
			        	</el-form-item>
		        	</el-col>
		        	<el-col :span="7">
			        	<el-form-item label='<core:text name = "paoliao.jsp.item" />：'  :label-width="lableWidth['order']+'px'" id='order'>
									<el-input v-model="ITEM" :disabled="true"></el-input>	
			        	</el-form-item>
		        	</el-col>
		        	<el-col :span="7">
			        	<el-form-item label='<core:text name = "paoliao.jsp.item_desc" />：'  :label-width="lableWidth['order']+'px'" id='order'>
									<el-input v-model="DESCRIPTION" :disabled="true"></el-input>
			        	</el-form-item>
		        	</el-col>
		        </el-form>
	        </el-col>
        </el-row>
        
        <el-row type="flex" justify="center">
        	<el-col :span="21">
		        <el-form class="demo-ruleForm">		        	
	        		<el-col :span="7">
			        	<el-form-item label='<core:text name = "paoliao.jsp.operation" />：'  :label-width="lableWidth['order']+'px'" id='order'>
			        		<el-input v-model="OPERATION" readonly>
				           		<el-button slot="append" icon="el-icon-search" onclick="browse('<core:text name = "paoliao.jsp.operation" />','BROWSE_ROUTER_OPERATION_LHJ','OPERATION','OPERATION',reg)"></el-button>
						    </el-input>
			        	</el-form-item>
		        	</el-col>
		        	<el-col :span="7" :offset='7' style='float:right'>
								<el-button type="primary" v-on:click="onSave"><core:text name = "paoliao.jsp.save" /></el-button>
								<el-button type="primary" v-on:click="onCancel"><core:text name = "paoliao.jsp.cancel" /></el-button>
		        	</el-col>       		        	 
		        </el-form>
	        </el-col>
        </el-row>
        
        
        <el-row type="flex" justify="center">
        	<el-col :span="24">
				<el-table ref="table" :data="TABLE" @selection-change="handleSelectionChange" height="400" border style="width: 100%">
					<el-table-column type="selection" />
					</el-table-column>
					<el-table-column min-width="250" align="center" prop="SFC" label="<core:text name="paoliao.jsp.original_sfc" />">
					</el-table-column>
					<el-table-column min-width="250" align="center" prop="DESCRIPTION" label="<core:text name="paoliao.jsp.item_desc" />">
					</el-table-column>
					<el-table-column  min-width="130" align="center" prop="QTY" label="<core:text name="paoliao.jsp.sfc_qty" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="INV_QTY" label="<core:text name="paoliao.jsp.inv_qty" />">
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="" label="<core:text name="paoliao.jsp.pl_qty" />">
						<template scope="scope" >
				    		<el-input v-model="scope.row.PL_QTY" v-on:input="autoToggleRow(scope.$index)">
				    		</el-input>
				    	</template>
					</el-table-column>
					<el-table-column min-width="130" align="center" prop="LEFT_QTY" label="<core:text name="paoliao.jsp.left_qty" />">
					</el-table-column>
				</el-table>
			</el-col>
        </el-row>
	    
    </div>
    
</body>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/paoliao/paoliaoAdd.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/browse.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>
</html>