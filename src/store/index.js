import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    userId: '1',
    lists: [],
    username: '用户名',
    token: '',
    url:'http://localhost:8081'
  },
  mutations: {
    increate1 () {
      this.state.count++
    },
    addItem (state, value) {
      state.lists.push(value)
    },
    setUserId (state, id) {
      this.state.userId = id
    },
    setToken(state, token){
      this.state.token = token
    },
    setUserName (state, username) {
      this.state.username = username
    }
  },
  getters: {},
  actions: {},
  modules: {}
})
