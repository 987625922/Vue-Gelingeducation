<template>
  <div id="bg">
    <div style="margin-top: 50px">
      <h2 class="logoText">
        <img src="../../assets/logo.png" alt="logo" />
        <span>管理后台</span>
      </h2>
    </div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <el-form-item>
        <h3 class="login-title">欢迎登录</h3>
      </el-form-item>
      <el-form-item label="账号：">
        <el-input type="text" placeholder="请输入账号" v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码：">
        <el-input type="password" placeholder="请输入密码" v-model="form.password" />
      </el-form-item>
      <el-form-item style="color:red;" label="验证码：">
        <el-input style="width:45%" type="password" placeholder="请输入验证码" v-model="form.code" />
        <img
          style="width:45%;margin-left:10%;vertical-align: middle;"
          :src="form.url"
          :fit="contain"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="register-btn" type="primary" v-on:click="handleLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from "@/store";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, getCaptcha } from "@/api/api";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        againPassword: "",
        url: "",
        code: ""
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleLogin() {
      var params = {
        account: this.form.username,
        password: this.form.password,
        code: this.form.code
      };
      login(params).then(res => {
        this.$message.success("登录成功");
        store.commit("setUserId", res.data.id);
        setToken(res.data.token);
        store.commit("setToken", res.data.token);
        this.$router.push("Main");
      });
    },
    //获取验证码
    getCode() {
      // var params = {}
      // getCaptcha(params).then(res =>{
      //   this.form.url = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      //   console.log(this.form.url);
      // })
      var _this = this;
      var url = "http://localhost:8081/web/captcha";
      this.$axios
        .get(url, { responseType: "arraybuffer" })
        .then(function(data) {
          _this.form.url =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getCode();
  }
};
</script>

<style scoped>
.login-box {
  width: 25%;
  margin: 150px auto;
  padding: 35px 55px 35px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.el-form-item__label {
  color: red;
}
.login-title {
  text-align: center;
  margin: 0 auto 30px auto;
  color: #fff;
  font-size: 25px;
}

.register-btn {
  width: 100%;
  margin: 0 auto;
  background-color: #2061f6;
}

.logoText {
  color: #fff;
  font-size: 36px;
  line-height: 40px;
  display: flex;
  justify-content: center;
}

.logoText span {
  margin-left: 30px;
}

#bg {
  width: 100%;
  height: 100vh; /* 重点一 */
  margin: 0 auto;
  background-image: url(../../assets/img/bg_main.jpg);
  background-repeat: no-repeat;
  background-size: cover; /* 重点二 */
  overflow: auto;
}
</style>
