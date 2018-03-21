import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: [0, 1, 5, 9, 20],
    num: 1
  },
  getters: {
    maxCount: state => {
      return Math.max(...state.count)
    }
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count.push(Math.floor(Math.random() * 100))
    }
  },
  actions: {
    incrementAsync  ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  }
})
