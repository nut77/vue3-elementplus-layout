<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <img :src="logoSrc" height="151" width="645" />
      </div>
      <el-form :model="loginData" label-width="0" :rules="loginDataRule" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            autofocus
            maxlength="20"
            placeholder="请输入用户名"
            v-model.trim="loginData.username"
            @keyup.enter="submitForm"
            clearable
            @focus="focusInput('username')"
            class="el-input--username"
            :class="{'active': focusType === 'username'}"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            maxlength="20"
            type="password"
            placeholder="请输入密码"
            v-model.trim="loginData.password"
            @keyup.enter="submitForm"
            clearable
            @focus="focusInput('password')"
            class="el-input--password"
            :class="{'active': focusType === 'password'}"
            onpaste="return false"
          />
        </el-form-item>
        <el-form-item class="mgt50">
          <p class="login-msg">{{msg}}</p>
          <el-button @click="submitForm" plain :loading="loading" type="primary">
            {{`${loading ? '登录中' : '登 录'}`}}
          </el-button>
        </el-form-item>
        <div class="login-tip">
          <p v-if="!isDeviceMatch.resolution">当前分辨率过低会影响体验，推荐使用分辨率1366*768及以上终端。</p>
          <p v-if="isDeviceMatch.resolution && !isDeviceMatch.viewport">浏览器可视区域过小会影响体验，建议将浏览器最大化。</p>
          <p v-if="!isDeviceMatch.browserVersion">当前浏览器版本过低会影响体验，请升级到最新版本。</p>
          <p v-if="!isDeviceMatch.browser">推荐使用火狐或谷歌浏览器最新版，效果更佳。</p>
        </div>
      </el-form>
    </div>
    <p class="login-footer">{{$store.state.systemInfo.name}} {{$store.state.systemInfo.version}}</p>
  </div>
</template>

<script setup>
  import SHA256 from 'js-sha256';
  import logoSrc from '@a/images/login/logo.png';
  import {getCurrentInstance, ref, reactive, onBeforeMount, onUnmounted} from 'vue';
  import {useStore} from 'vuex';
  import {useRouter} from 'vue-router';

  const [store, router] = [useStore(), useRouter()];
  const [loginForm] = [ref(null)];
  let [loading, focusType, msg] = [ref(false), ref(''), ref('')];
  const loginData = reactive({
    username: '',
    password: ''
  });
  const loginDataRule = reactive({
    username: [{required: true, message: ' * 请输入用户名'}],
    password: [{required: true, message: ' * 请输入密码'}]
  });
  const isDeviceMatch = reactive({
    viewport: false,
    browserVersion: false,
    browser: false,
    resolution: false
  });

  // 获取浏览器版本号
  const getVersion = browser => {
    const reg = new RegExp(`(${browser}\\/[.0-9]*)`, 'i');
    const agent = navigator.userAgent.match(reg);
    return agent ? parseInt(agent[0].split('/')[1].split('.')[0]) : 0;
  };
  // 检查浏览器版本
  const checkVersion = () => {
    const [MIN_VERSION_CHROME, MIN_VERSION_FIREFOX] = [60, 60];
    const chromeVersion = getVersion('chrome');
    const firefoxVersion = getVersion('firefox');
    if (chromeVersion) isDeviceMatch.browserVersion = chromeVersion >= MIN_VERSION_CHROME;
    if (firefoxVersion) isDeviceMatch.browserVersion = firefoxVersion >= MIN_VERSION_FIREFOX;
    isDeviceMatch.browser = chromeVersion || firefoxVersion;
  };
  // 检查分辨率
  const checkResolution = () => {
    const [MIN_WIDTH, MIN_HEIGHT] = [1366, 768];
    const [screenWidth, screenHeight] = [window.screen.width, window.screen.height];
    isDeviceMatch.resolution = screenWidth >= MIN_WIDTH && screenHeight >= MIN_HEIGHT;
  };
  // 检查视口
  const checkViewport = () => {
    const [MIN_WIDTH, MIN_HEIGHT] = [1300, 700];
    let [pageWidth, pageHeight] = [window.innerWidth, window.innerHeight];
    // IE
    if (typeof pageWidth !== 'number') {
      if (document.compactMode === 'CSS1Compat') {
        // 严格模式-CSS1Compat-strict mode
        [pageWidth, pageHeight] = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
        ];
      } else {
        // 怪异模式-BackCompat-quirks mode
        [pageWidth, pageHeight] = [document.body.clientWidth, document.body.clientHeight];
      }
    }
    isDeviceMatch.viewport = pageWidth >= MIN_WIDTH && pageHeight >= MIN_HEIGHT;
  };
  // 输入框聚焦处理
  const focusInput = type => {
    msg = '';
    focusType = type;
  };
  // 登录操作
  let {proxy} = getCurrentInstance();
  const submitForm = () => {
    loginForm.value.validate(async valid => {
      if (!valid) return;
      loading = true;
      const res = await proxy.$api.login.login({
        username: loginData.username,
        password: SHA256.hmac(loginData.username, loginData.password)
      });
      loading = false;
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        store.commit('setUserInfo', res.data);
        store.commit('setTimeToGetToken', res.data);
        router.push('/home');
      } else {
        msg = res.message;
      }
    });
  };

  // 钩子函数
  onBeforeMount(() => {
    store.commit('resetUserInfo');
    store.commit('setTimeToGetToken', 0);
    checkViewport();
    checkVersion();
    checkResolution();
    window.addEventListener('resize', checkViewport);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', checkViewport);
  });
</script>

<style lang="less" scoped>
  @footer-height: 50px;
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    height: 100%;
    padding-bottom: @footer-height;
    background-color: @background-color-light;
  }
  .login-box {
    width: 645px;
  }
  .el-form {
    width: 480px;
    height: 318px;
    padding:  30px 75px;
    margin: 30px auto;
    background: linear-gradient(to bottom, rgba(26, 26, 46, 1), rgba(26, 26, 46, 0));
    border-radius: 10px;
  }
  .el-form-item {
    margin-top: 30px;
    &::before {
      display: none !important;
    }
  }
  :deep(.el-input) {
    &::before {
      position: absolute;
      top: 50%;
      left: 20px;
      width: 30px;
      height: 30px;
      content: '';
      background-image: url("../../assets/images/login/icon.png");
      transform: translateY(-50%);
    }
    &.el-input--password::before {
      background-position: 30px 0;
    }
    &.el-input--username.active::before {
      background-position: 0 -35px;
    }
    &.el-input--password.active::before {
      background-position: 30px -35px;
    }
    .el-input__inner {
      height: 50px;
      padding-left: 55px;
      border: 0 none;
      background-color: #262e54;
      border-radius: 31px;
    }
  }
  .login-tip {
    line-height: 20px;
  }
  .login-msg {
    padding-bottom: 3px;
    color: @color-danger;
    line-height: 18px;
    text-align: center;
  }
  .el-button {
    width: 100%;
    height: 50px;
    border: 0 none;
    background-color: #41b2ff;
    color: white;
    border-radius: 25px;
  }
  .login-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: @background-color-darker;
    text-align: center;
    line-height: @footer-height;
  }
</style>
