<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
  <%@ taglib uri="/WEB-INF/tlds/core.tld" prefix="core" %>
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <jsp:include page="/com/sunny/jsp/common/pod-header.jsp" />

    </head>

    <body>
      <div id="app" v-cloak class="content-box .podFrame-box">
        <div style="display:none" id='dialogTableVisible'>
          <el-row style="font-size: 18px;background-color:lightblue;font-style:inherit">
            <core:text name="podFrame.jsp.loadingList" />
          </el-row>
          <el-table :data="UPTABLE" border style="width: 100%">
            <el-table-column prop="ITEM" label="<core:text name = " podFrame.jsp.item" />">
            </el-table-column>
            <el-table-column prop="DESCRIPTION" label="<core:text name = " podFrame.jsp.item_desc" />">
            </el-table-column>
            <el-table-column prop="SHOPORDER" label="<core:text name = " podFrame.jsp.order" />">
            </el-table-column>
          </el-table>
          <el-row>
            <el-button v-on:click="confirm()">
              <core:text name="podFrame.jsp.confirm" />
            </el-button>
          </el-row>
        </div>
        <div style="display:none" id='dialogShopOrder'>
          <el-row style="font-size: 18px;background-color:lightblue;font-style:inherit;text-align:center">
            <core:text name="podFrame.jsp.if_switch_order" />
          </el-row>
          <el-row style="text-align:center">
            <el-button v-on:click="confirmSwitch()">
              <core:text name="podFrame.jsp.confirm" />
            </el-button>
            <el-button v-on:click="cancelSwitch()">
              <core:text name="podFrame.jsp.cancel" />
            </el-button>
          </el-row>
        </div>
        <title v-cloak>{{title}}</title>
        <div class="pod-title-box">
          <el-row>
            <el-col :span="8">
              <div class="title-box title-content">
                <i class="el-icon-menu"></i>
                <span>{{title}}</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="login-content-box">
                <div class="login-content" title='<core:text name = "podFrame.jsp.order" />'>
                  <i class="el-icon-tickets"></i>
                  <span id="SHOPORDER">{{SHOPORDER}}</span>
                </div>
                <div class="login-content" title='<core:text name = "podFrame.jsp.site" />'>
                  <i class="el-icon-location"></i>
                  <span id="SITE">{{site}}</span>
                </div>
                <div class="login-content" title='<core:text name = "podFrame.jsp.user" />'>
                  <i class="el-icon-service"></i>
                  <span id="USER_ID">{{userId}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="search-box pod-search-box">
          <el-row :gutter="24">
            <el-form class="demo-ruleForm">
              <el-col :span="12">
                <el-form-item label="<core:text name = " podFrame.jsp.operation" />:" required
                :label-width="lableWidth['jspPeriod']+'px'" id='jspPeriod'>
                <el-input v-model="OPERATION" id="OPERATION" v-uppercase :disabled="!CAN_CHANGE_OPERATION"
                  @keyup.enter.native="operationChangeEvent($event)">
                  <el-button slot="append" icon="el-icon-search" :disabled="!CAN_CHANGE_OPERATION"
                    onclick="browse('<core:text name = " podFrame.jsp.search_operation" />
                  ','BROWSE_OPERATION','OPERATION','OPERATION',app)"></el-button>
                </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="<core:text name = " podFrame.jsp.resource" />:" required
                :label-width="lableWidth['jspResource']+'px'" id='jspResource'>
                <el-input v-model="RESOURCE" id="RESOURCE" v-uppercase :disabled="!CAN_CHANGE_RESOURCE"
                  @keyup.enter.native="resourceChange($event)">
                  <el-button slot="append" icon="el-icon-search" :disabled="!CAN_CHANGE_RESOURCE"
                    onclick="browse('<core:text name = " podFrame.jsp.search_resource" />
                  ','BROWSE_RESOURCE1','RESOURCE','RESRCE',app)"></el-button>
                </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row :gutter="24">
            <el-form class="demo-ruleForm">
              <el-col :span="colLength" v-if="SHOW_CODE">
                <!-- 一般不显示,暂时不考虑 -->
                <el-form-item label="<core:text name = " podFrame.jsp.iqc" />:">
                <el-input v-model.trim="barcode" style="padding-bottom: 13px;" id="POD_CODE"
                  @keyup.enter.native="enterCode($event)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="colLength">
                <el-form-item label="SFC:" :label-width="lableWidth['SFC']+'px'" id='SFC'>
                  <el-input v-model.trim="SFC" v-uppercase @keyup.enter.native="enterSfc($event)" id="POD_SFC">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="<core:text name = " podFrame.jsp.qty" />:" :label-width="lableWidth['qty']+'px'"
                id='qty'>
                <el-input v-model.number="QTY" disabled v-number-only style="padding-bottom: 13px;" id="NUM"
                  v-on:focus="alterNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="<core:text name = " podFrame.jsp.queue_qty" />:"
                :label-width="lableWidth['queue']+'px'" id='queue'>
                <el-input v-model.number="QUEUE_QTY" v-number-only style="padding-bottom: 13px;" id="QUEUE_QTY"
                  readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="<core:text name = " podFrame.jsp.inwork_qty" />:"
                :label-width="lableWidth['inwork']+'px'" id='inwork'>
                <el-input v-model.number="IN_WORK_QTY" v-number-only style="padding-bottom: 13px;" id="IN_WORK_QTY"
                  readonly></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row :gutter="24">
            <el-form class="demo-ruleForm">
              <el-col :span="24" style="padding-bottom: 10px;">
                <el-form-item id="btnContents">
                  <el-button v-for="btn in podBtns" :key="btn.BUTTON_ID" type="primary" v-bind:id="btn.BUTTON_ID"
                    v-on:click="btnLogic(btn.BUTTON_ID)" v-cloak>{{btn.LABEL}}</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>

        <template v-if="frameBSrc == ''">
          <el-row type="flex">
            <el-col :span="24" style="border: 0px;">
              <iframe id="frameA" frameborder="0" style="width: 100%; height: 100%;" v-bind:src="frameASrc"
                onload="setIframeHeight(this)"></iframe>
            </el-col>
          </el-row>
        </template>
        <template v-if="frameBSrc != ''">

          <template v-if="frameASrc == ''">
            <el-row type="flex">
              <el-col :span="24" style="border: 0px;">
                <iframe id="frameB" frameborder="0" style="width: 100%; height: 60%;" v-bind:src="frameBSrc"></iframe>
              </el-col>
            </el-row>
          </template>
          <template v-if="frameASrc != ''">
            <el-col :xs="14" :sm="15" :md="16" :lg="17" style="border: 0px;">
              <iframe id="frameA" frameborder="0" style="width: 100%; height: 100%;" v-bind:src="frameASrc"
                onload="setIframeHeight(this)"></iframe>
            </el-col>
            <el-col :xs="10" :sm="9" :md="8" :lg="7" style="border: 0px;">
              <iframe id="frameB" frameborder="0" style="width: 100%; height: 100%;" v-bind:src="frameBSrc"
                onload="setIframeHeight(this)"></iframe>
            </el-col>
          </template>
        </template>
        <div style="text-align: center; margin: 0;width:250px; display:none" id='numDialog'>
          <el-row>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(1,1)">1</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(2,1)">2</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(3,1)">3</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(4,1)">4</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(5,1)">5</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(6,1)">6</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(7,1)">7</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(8,1)">8</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(9,1)">9</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(0,1)">0</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(0,2)">
                <core:text name="podFrame.jsp.clear" />
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button size='large' v-on:click="numSelect(0,3)">
                <core:text name="podFrame.jsp.delete" />
              </el-button>
            </el-col>
          </el-row>
        </div>

        <div style="text-align: center;  margin: 0; display:none" id='show'>
          <el-row justify="center">
            <el-table :data="showtableData" style="width: 100%;height:197px; color:red;font-size:30px ">
              <el-table-column prop="SLOGAN" label="<core:text name = " podFrame.jsp.gogogo" />" center="true"
              style="text-align: center; " ></el-table-column>
            </el-table>
          </el-row>

          <el-row justify="center">
            <el-table :data="detailTableData"
              style="width: 100%;color:blue;font-size:20px ;table-layout: fixed;word-break : normal">
              <el-table-column prop="CONTENT" label="<core:text name = " podFrame.jsp.tips" />" center="true" >
              </el-table-column>
            </el-table>
          </el-row>
        </div>

        <div style="text-align: center;  margin: 0; display:none" id='showduty'>
          <el-row justify="center">
            <el-table :data="showdutyData" style="width: 100%;height:197px; color:red;font-size:30px ">
              <el-table-column prop="CONTENT" label="<core:text name = " podFrame.jsp.gogogo" />" center="true"
              style="text-align: center; " ></el-table-column>
            </el-table>
          </el-row>
        </div>


      </div>
      <input type="hidden" name="ACTIVITY_ID" id="ACTIVITY_ID" value="${param.ACTIVITY_ID }" />
      <input type="hidden" name="workstation" id="workstation" value="${param.workstation }" />
      <input type="hidden" name="operation" id="operation" value="${param.operation }" />
      <input type="hidden" name="resource" id="resource" value="${param.resource }" />
    </body>
    <jsp:include page="/com/sunny/jsp/common/pod-footer.jsp"></jsp:include>
    <script type="text/javascript"
      src="<%=request.getContextPath() %>/resource/layer/layer.js?ver=${applicationScope.RE_VER}"></script>

    </html>