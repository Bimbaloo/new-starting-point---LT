<%@page import="com.sunny.service.plugin.impl.ExportAbstractPlugin"%>
<%@page import="com.sunny.service.plugin.impl.ViewPodPlugin"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/css/reset.css?ver=${applicationScope.RE_VER}" />
<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/element-ui2.0/theme-chalk/index.css?ver=${applicationScope.RE_VER}" />
<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/css/pod.css?ver=${applicationScope.RE_VER}" />
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/vue.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-1.7.1.min.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery.timers-1.2.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/element-ui2.0/index.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/element-ui2.0/umd/locale/en.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/dateFormat.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/i18n/jquery.i18n.properties-min.js"></script>
<script type="text/javascript">
var path = '<%=request.getContextPath() %>';
var mobileDataPath = "/mobile-data";
var sunnyPath = "/sunny";
var PAGE_PREFIX = '<%=ViewPodPlugin.PAGE_PREFIX %>';
var EXPORT_PREFIX = '<%=ExportAbstractPlugin.EXPORT_PREFIX %>';
var USER_ID = '<%=request.getSession().getAttribute("USER_ID") %>';
var SITE_V = '<%=request.getSession().getAttribute("SITE") %>';
var activityId = '<%=request.getParameter("ACTIVITY_ID") %>';
var RE_VER = '${applicationScope.RE_VER}';
var ST_RE_VER = '${applicationScope.ST_RE_VER}';
var durationShowTime = (10 * 1000);
var jsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
if(jsSrc.indexOf('zh')>=0)
{
	jQuery.i18n.js({//加载资浏览器语言对应的资源文件
	    name : 'cn', //资源文件名称
	    path : path + '/resource/international/', 
	    mode : 'map' //用Map的方式使用资源文件中的值
	});
}else if(jsSrc.indexOf('vi')>=0) {
	ELEMENT.locale(ELEMENT.lang.en);
	jQuery.i18n.js({//加载资浏览器语言对应的资源文件
	    name : 'vi', //资源文件名称
	    path : path + '/resource/international/', 
	    mode : 'map' //用Map的方式使用资源文件中的值
	});
}else {
	ELEMENT.locale(ELEMENT.lang.en);
	jQuery.i18n.js({//加载资浏览器语言对应的资源文件
	    name : 'en', //资源文件名称
	    path : path + '/resource/international/', 
	    mode : 'map' //用Map的方式使用资源文件中的值
	});
}
</script>
<script type="text/javascript">
var loadingFullScreen = true;
var loadingIndex;
var getLoadingIndex = function(){
	if(loadingFullScreen != false && parent!= null && pApp!=null){	//pod內使用
    	return parent.loadingIndex;
    }else{
    	return loadingIndex;
    }
}

var setLoadingIndex = function(_loadingIndex){
	if(loadingFullScreen != false && parent!= null && pApp!=null){	//pod內使用
    	parent.loadingIndex = _loadingIndex;
    }else{
    	loadingIndex = _loadingIndex;
    }
}

var clearLoadingIndex = function(){
	if(loadingFullScreen != false && parent!= null && pApp!=null){	//pod內使用
    	parent.loadingIndex = null;
    }else{
    	loadingIndex = null;
    }
}

var getLayer = function(){
	if(loadingFullScreen != false && parent!= null && pApp!=null){	//pod內使用
    	return parent.layer;
    }else{
    	return layer;
    }
}
//设置AJAX的全局默认选项
$.ajaxSetup( {
  error: function(jqXHR, textStatus, errorMsg) {
      if ("error" === textStatus || jqXHR.status != 200) {
          var erroText = jqXHR.responseText;
          if (jqXHR.status == 404) {
              handle404(jqXHR.statusText, erroText);
          } else if (jqXHR.status == 500) {
              handle500(jqXHR.statusText, erroText);
          } else {
              FullScreen.showAppError(jqXHR.statusText + ": " + erroText);
          }
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
var getParentApp = function() {
    if (self.parent && self.parent.app) {
        return self.parent.app;
    } else if (self.opener && self.opener.app) {
        return self.opener.app;
    }
    return null;
}
/**
 * 如果POD子页面需要获取页面的作业ID则调用该方法; 
 * 如果不需要则使用代码: pApp.getPostData()
 */
var getPostDataWithActivityId = function() {
    var data = {};
    var p = pApp || app;
    if (p) {
        data = p.getPostData();
        data.pageActivityId = activityId;
    }
    data.logActivityId = activityId;
    return data;
}
var pApp = getParentApp();
Date.prototype.Format = function(fmt)
{ 

    var o = {
            "M+" : this.getMonth() + 1, //月份  
            "d+" : this.getDate(), //日  
            "h+" : this.getHours(), //小时  
            "m+" : this.getMinutes(), //分  
            "s+" : this.getSeconds(), //秒  
            "q+" : Math.floor((this.getMonth() + 3) / 3),
            "S" : this.getMilliseconds()
       //毫秒  
       };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                       : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.toJSON = function(a) {
    if (this.getHours() == 0 && this.getMinutes() == 0 && this.getSeconds() == 0) {
        return this.Format("yyyy-MM-dd");
    } else {
        return this.Format("yyyy-MM-dd hh:mm:ss");
    }
}

/**
 * 克隆提交的参数, 这是为了不影响界面显示的数据;
 */
var clonePostData = function($data, setEmpty, callback) {
    var param = $.extend(true, {}, $data);
    if (setEmpty === true) {
        param.data = [];
    }
    var postData = {};
    if (callback && typeof(callback) === 'function') {
        postData = JSON.parse(JSON.stringify(param, callback));
    } else {
    	postData = JSON.parse(JSON.stringify(param));
    }
    postData.rd = Math.random();
    return postData;
}
var baseDownloadExcel = function(fileName) {
    var url = path + "/downloadFile/standard?fileName=" + encodeURIComponent(fileName) + "&rd=" + Math.random();
    window.open(url);
}
function setIframeHeight(frm) {
    $(frm).height($(frm).contents().find("body").height()+15);
};

/**
 * 自定义指令，自动转大写
 */
Vue.directive('uppercase', {
    update: function (el, binding, vnode) {
        if (vnode.data.model.value) {
             app[vnode.data.model.expression] = vnode.data.model.value.toUpperCase();
        }
    }
/*     bind: function (el) {
        el.handler = function () {
            $(el).children()[0].value = $(el).children()[0].value.toUpperCase();
        }
        el.addEventListener('keyup', el.handler);
    },
    unbind: function (el) {
        el.removeEventListener('keyup', el.handler);
    } */
});

//限制输入数字
//<input v-model="num" v-number-only />
Vue.directive('numberOnly', {
    bind: function (el) {
        el.handler = function () {
            $(el).children()[0].value = $(el).children()[0].value.replace(/\D+/, '');
        }
        el.addEventListener('input', el.handler);
    },
    unbind: function (el) {
        el.removeEventListener('input', el.handler);
    }
}) 

function playSound() {
    var borswer = window.navigator.userAgent.toLowerCase();
    if(borswer.indexOf("ie") >= 0) {
        //IE内核浏览器
        var strEmbed = '<embed name="embedPlay" src="/sunny/resource/sound/error.mp3" autostart="true" hidden="true" loop="false"></embed>';
        if($("body").find("embed").length <= 0)
            $("body").append(strEmbed);
        var embed = document.embedPlay;
        //浏览器不支持 audion，则使用 embed 播放
        embed.volume = 100;
        //embed.play();这个不需要
    } else {
        //非IE内核浏览器
        var strAudio = "<audio id='audioPlay' src='/sunny/resource/sound/error.mp3' hidden='true'>";
        if($("body").find("audio").length <= 0)
            $("body").append(strAudio);
        var audio = document.getElementById("audioPlay");
        //浏览器支持 audion
        audio.play();
    }
}
var disabledStartDate = function(endDateTime, currentDate) {
    if (endDateTime) {
        return currentDate.getTime() > endDateTime.getTime();
    }
}
var disableEndDate = function(startDateTime, currentDate) {
    if (startDateTime) {
        return currentDate.getTime() < startDateTime.getTime();
    }
}
var clearFormParameterValue = function(data) {
    if (data) {
        for (var prop in data) {
            if (typeof(data[prop]) === 'string') {
                data[prop] = '';
            } if (data[prop] && typeof(data[prop]) === 'object') {
                if (data[prop].getYear && typeof(data[prop].getYear) === 'function') {
                    data[prop] = '';
                }
            }
        }
    }
}
var gb_getUserInfo = function(currentApp, id, name, dept) {
    if (currentApp[id]) {
        var url = mobileDataPath + "/browse/getUserInfoById";
        var fData = {};
        fData.userId = currentApp[id];
        fData.rd = Math.random();
        $.post(url, fData, function(data) {
            if (data.isSuccess) {
                if (data.USER_INFO) {
                    currentApp[name] = data.USER_INFO.USER_NAME;
                    currentApp[dept] = data.USER_INFO.DEPT;
                }
            } else {
                app.showError(data.error);
            }
        }, 'json');
    }
}
var trimRight = function(msg) {
    var rtMsg = msg;
    if (msg.length > 500) {
        rtMsg = msg.substr(0, 500);
    }
    return rtMsg;
}
var hiddenFullscreenLoading = function(fApp) {
    setTimeout(function() {
        if (fApp.fullscreenLoading) {
            fApp.fullscreenLoading = false;
        }
    }, 200);
}
var FullScreen = (function() {
    var loading = null;
    var _openFullscreenLoading = function(fApp) {
        if (loading && loading.visible) {
            return loading;
        }
        fApp = fApp || frameApp;
        if (fApp) {
	        loading = fApp.$loading({
	            lock: true,
	            text: $.i18n.prop('loading'),
	            spinner: 'el-icon-loading'
	        });
        }
        return loading;
    }
    
    var _closeFullscreenLoading = function() {
        if (loading) {
            if (loading.visible === true)
            {
                loading.close();
            }
            //setTimeout(function() {
            //    if (loading.visible === true)
            //    {
            //        loading.close();
            //    }
            //}, 200);
        }
    }
    var _showSuccess = function(fApp, msg, type) {
        var t = _isVueType(fApp) || _isVueType(app) || _isVueType(pApp) || _isVueType(frameApp);
        t.$message({
            showClose: true,
            message: trimRight(msg),
            duration: durationShowTime,
            type: type || 'success'
        });
    }
    
    var _isVueType = function(app) {
        return (app instanceof Vue) ? app : null;
    }
    var _showError = function(fApp, msg) {
       // _showSuccess(fApp, msg, "error");
        fApp.$alert(msg, $.i18n.prop('error'), {
        	type: 'error',
    		dangerouslyUseHTMLString: true,
    		closeOnClickModal : true
        });
    }
    var _showWarning = function(fApp, msg) {
        _showSuccess(fApp, msg, "warning");
    }
    return {
        openFullscreenLoading: function(fApp) {
            return _openFullscreenLoading(fApp);
        },
        closeFullscreenLoading: function() {
            _closeFullscreenLoading();
        },
        showSuccess: function(fApp, msg) {
            _showSuccess(fApp, msg);
        },
        showPAppSuccess: function(msg) {
            _showSuccess(pApp, msg);
        },
        showAppSuccess: function(msg) {
            _showSuccess(app, msg);
        },
        showError: function(fApp, msg) {
            _showError(fApp, msg);
        },
        showPAppError: function(msg) {
            _showError(pApp, msg);
        },
        showAppError: function(msg) {
            _showError(app, msg);
        },
        showPAppWarning: function(msg) {
            _showWarning(pApp, msg);
        },
        showAppWarning: function(msg) {
            _showWarning(app, msg);
        },
        clearAllMsg: function() {
            $(".el-message").hide();
        }
    };
})($);
var handle404 = function(statusText, errorText) {
    FullScreen.showAppError(statusText);
}

var handle500 = function(statusText, errorText) {
    FullScreen.showAppError(statusText);
}
</script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/common.js?ver=${applicationScope.RE_VER}"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/layer/layer.js"></script>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />