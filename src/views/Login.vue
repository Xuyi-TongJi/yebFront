<template>
  <div>
    <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username"> <!-- 对应校验规则 -->
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 250px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      </el-form-item>
      <el-button type="primary" class="loginButton" @click="submitLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import {postRequest} from "@/utils/api";

export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time=' + new Date(),
      // 表单数据
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      checked: true,
      // 校验规则
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    submitLogin() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          // 校验通过，提交表单(axios)
          postRequest('/login', this.loginForm).then(res => {
            if (res.data.status === 200) {
              // replace和push的区别： replace替换，不可通过后退按钮退回；push可以
              this.$router.replace("/home");
              // 将token存入Vuex
            }
          })
        } else {
          this.$message.error("请输入所有字段!");
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

.loginButton {
  text-align: center;
  margin-left: 140px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
