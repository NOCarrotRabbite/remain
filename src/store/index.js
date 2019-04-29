import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  token: '',
  account: '',
  series: []
};

const mutations = {
  LOGIN(a, token) {
    localStorage.setItem('currentUser_token', token);
  },
  LOGOUT(a) {
    localStorage.clear();
  },
  SET_USER(a, name) {
    localStorage.setItem('currentUser_name', name);
  },
  SET_SERIES(a, name) {
    state.series = name;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
