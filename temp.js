export default {
  methods: {
    submitForm() {
      $refs.loginForm.validate(async valid => {
        if (!valid) return;
        loading = true;
        const res = await $api.login.login({
          username: loginData.username,
          password: SHA256.hmac(loginData.username, loginData.password)
        });
        loading = false;
        if (!!res && res.status === 200) {
          localStorage.setItem('token', res.data.token);
          $store.commit('setUserInfo', res.data);
          $store.commit('setTimeToGetToken', res.data);
          $router.push('/home');
        } else {
          msg = res.message;
        }
      });
    }
};
