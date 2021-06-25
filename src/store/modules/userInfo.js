// 用户相关数据信息存储
const state = {
  userInfo: {},
  isAdmin: false,
  isRoot: false
};

const getters = {
  getUserInfo: state => state.userInfo,
  getIsAdmin: state => state.isAdmin,
  getIsRoot: state => state.isRoot
};

const mutations = {
  mutationUserInfo(state, {data}) {
    state.userInfo = data;
  },
  mutationIsAdmin(state, {data}) {
    state.isAdmin = data;
  },
  mutationIsRoot(state, {data}) {
    state.isRoot = data;
  },
  mutationReset(state) {
    state.userInfo = {};
    state.isAdmin = false;
    state.isRoot = false;
  }
};

const actions = {
  setUserInfo({commit}, {data}) {
    commit('mutationUserInfo', {data});
  },
  setIsAdmin({commit}, {data}) {
    commit('mutationIsAdmin', {data});
  },
  setIsRoot({commit}, {data}) {
    commit('mutationIsRoot', {data});
  },
  reset({commit}) {
    commit('mutationReset');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
