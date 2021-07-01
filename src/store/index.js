import {createStore} from 'vuex';
import userInfo from '@/store/modules/userInfo';
// 解决刷新浏览器，数据消失问题
import createPersistedState from 'vuex-persistedstate';

const userInfoInit = {
  id: '',
  username: '',
  role: '',
  token: ''
};
// isOnlyNavTop、isOnlyNavLeft不能都为true
const state = {
  // 是否只有顶部导航
  isOnlyNavTop: false,
  // 是否只有左侧导航
  isOnlyNavLeft: false,
  userInfo: {...userInfoInit},
  timeToGetToken: 0,
  systemInfo: {
    name: import.meta.env.VITE_SYSTEM_NAME,
    version: import.meta.env.VITE_SYSTEM_VERSION
  }
};

const getters = {
  username: state => state.userInfo.username,
  isAdmin: state => state.userInfo.role === '管理员',
  role: state => state.userInfo.role || '普通用户',
  token: state => state.userInfo.token
};

const mutations = {
  setUserInfo(state, data) {
    Object.assign(state.userInfo, data);
  },
  setToken(state, data) {
    state.userInfo.token = data;
  },
  setTimeToGetToken(state, data) {
    state.timeToGetToken = data === undefined ? Date.now() : data;
  },
  resetUserInfo(state) {
    Object.assign(state.userInfo, userInfoInit);
  }
};

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState()],
  state,
  getters,
  mutations,
  modules: {
    userInfo
  }
});
