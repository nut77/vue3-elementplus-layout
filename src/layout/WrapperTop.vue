<template>
  <el-header>
    <div class="el-header-title">
      <img class="el-header-logo" :src="logoSrc" height="35" width="147"/>
    </div>
    <el-menu
      v-if="!isOnlyNavLeft"
      @select="$emit('setEnableSetMenuLeft', true)"
      :router="true"
      :default-active="activePath"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <wrapper-menu-item :navList="navList" :isRecursive="isOnlyNavTop"></wrapper-menu-item>
    </el-menu>
    <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start" class="el-header-user">
      <div class="el-dropdown-link">
        <img class="mgr5" :src="userSrc" height="24" width="24"/>
        {{username}}
      </div>
      <el-dropdown-menu class="el-header-dropdown-menu" #default>
        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!--修改密码弹框-->
    <base-dialog
      ref="dialog"
      title="修改密码"
      :dialogId="dialogId"
      @dialogConfirm="handleChangePassword"
      @dialogClose="hideDialog">
      <div class="base-dialog-container">
        <el-form :model="formData" :rules="formRules" ref="form" label-width="80px">
          <el-form-item label="原始密码" prop="password">
            <el-input maxlength=20 type="password" placeholder="请输入原始密码" v-model.trim="formData.password" clearable onpaste="return false"/>
          </el-form-item>
          <el-form-item label="新密码" prop="modifyPassword">
            <el-input maxlength=20 type="password" placeholder="请输入新密码" v-model.trim="formData.modifyPassword" clearable onpaste="return false"/>
          </el-form-item>
          <el-form-item label="确认密码" prop="modifyPasswordRepeat">
            <el-input maxlength=20 type="password" placeholder="请再次输入新密码" v-model.trim="formData.modifyPasswordRepeat" clearable onpaste="return false"/>
          </el-form-item>
        </el-form>
      </div>
    </base-dialog>
  </el-header>
</template>

<script>
import SHA256 from 'js-sha256';
import mixins from '@/mixins';
import WrapperMenuItem from './WrapperMenuItem';
export default {
  name: 'WrapperTop',
  props: ['navList', 'path'],
  components: {WrapperMenuItem},
  mixins: [mixins.userInfo, mixins.dialog],
  data() {
    return {
      activePath: this.$store.state.isOnlyNavTop ? this.path[this.path.length - 1] : this.path[0],
      logoSrc: require('@a/images/layout/logo.png'),
      userSrc: require('@a/images/layout/user.png'),
      formData: {
        password: '',
        modifyPassword: '',
        modifyPasswordRepeat: ''
      },
      formRules: {
        password: [{required: true, trigger: 'blur', fieldType: '原始密码', validator: this.$validator.password}],
        modifyPassword: [{required: true, trigger: 'blur', fieldType: '新密码', validator: this.$validator.password}],
        modifyPasswordRepeat: [{
          required: true,
          trigger: 'blur',
          fieldType: '确认密码',
          validator: (rule, value, callback) => {
            rule.newPassword = this.formData.modifyPassword;
            this.$validator.password(rule, value, callback);
          }
        }]
      }
    };
  },
  computed: {
    isOnlyNavTop() {
      return this.$store.state.isOnlyNavTop;
    },
    isOnlyNavLeft() {
      return !this.$store.state.isOnlyNavTop && this.$store.state.isOnlyNavLeft;
    }
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse');
    },
    handleCommand(command) {
      if (command === 'logout') this.handleLogout();
      if (command === 'changePassword') (this.dialogId = Date.now());
    },
    // 退出登录
    async handleLogout() {
      const res = await this.$api.login.loginOut();
      if (res.status === 200) {
        this.logout('注销成功', 'success');
      } else {
        this.$message.error('注销失败');
      }
    },
    // 确认修改密码
    handleChangePassword() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.$refs.dialog.loadingOpen();
        const params = {
          username: this.username,
          id: this.userId,
          password: SHA256.hmac(this.username, this.formData.password),
          modifyPassword: SHA256.hmac(this.username, this.formData.modifyPassword)
        };
        const res = await this.$api.login.changePassword(params);
        this.$refs.dialog.loadingClose();
        if (res.status === 200) {
          this.hideDialog();
          this.logout('密码修改成功，需要重新登录。', 'success');
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .el-header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    background-color: @background-color-darker;
    line-height: 60px;
  }
  .el-header-title {
    display: inline-block;
    width: 220px;
  }
  .el-header-logo {
    vertical-align: middle;
  }
  .el-menu {
    flex: 1;
    background-color: @background-color-darker !important;
  }
  .el-menu--horizontal .el-menu-item-box {
    display: flex;
  }
  /deep/ .el-menu-item,
  /deep/ .el-submenu__title {
    width: 130px;
    height: 60px;
    background-color: @background-color-darker !important;
    color: @color-text-regular !important;
    font-size: 16px;
    text-align: center;
    line-height: 60px !important;
    &:hover {
      background-color: rgba(65, 178, 255, 0.8) !important;
    }
  }
  /deep/ .el-submenu.is-opened .el-submenu__title {
    background-color: rgba(65, 178, 255, 0.8) !important;
  }
  /deep/ .el-menu-item.is-active,
  /deep/ .el-submenu.is-active .el-submenu__title {
    background-color: @color-primary !important;
    color: @color-text-primary !important;
  }
  .el-header-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 15px;
    background: url("../assets/images/layout/top-nav-icon.png") no-repeat;
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .el-header-dropdown-menu {
    top: 50px !important;
    left: auto !important;
    right: 0 !important;
    .popper__arrow {
      display: none !important;
    }
  }
  .el-dropdown-menu {
    width: 140px;
    .tc;
    .el-dropdown-menu__item {
      line-height: 35px;
    }
  }
</style>
