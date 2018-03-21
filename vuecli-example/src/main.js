// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ECharts from 'vue-echarts/components/ECharts.vue'

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

// 注册组件后即可使用
Vue.component('chart', ECharts)

Vue.use(ElementUI)

/* 拖动组件 */
import VueDND from 'awe-dnd'
Vue.use(VueDND)

Vue.config.productionTip = false

Vue.prototype.$ajax = axios
Vue.prototype.$get = (sUrl, oParams) => axios.get(sUrl, {'params': oParams})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
