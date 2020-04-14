<template>
  <div id="login_main">
    <div style="margin-top: 10px">
      <h2 class="logoText">
        <span>格灵课堂管理后台</span>
      </h2>
    </div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="60px" class="login-box">
        <h3 class="login-title">欢迎注册</h3>
        <el-form-item label="账号" prop="username">
          <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请再次输入密码" v-model="form.againPassword"/>
        </el-form-item>
        <el-button id="register-btn" type="primary" v-on:click="register()">注册</el-button>
      </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        form: {
          username: '',
          password: '',
          againPassword: ''
        },
        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        rules: {
          username: [
            {required: true, message: '账号不可为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      register() {
        var _this = this;
        if (this.form.password == null || this.form.againPassword != this.form.password) {
          _this.$message.error("密码不一致")
          return
        }
        this.$axios.post("http://localhost:8081/admin/register", {
          phone: this.form.username,
          password: this.form.password
        }).then(function (res) {
          //此处的this指向的不是当前vue实例
          // self.items = res.data.data
          if (res.data.code == 200) {
            _this.$message.success("创建成功")
          } else {
            _this.$message.error(res.data.msg);
          }
        })
          .catch(function (err) {
            _this.$message.error(err.data)
          })
      }
    }
  }
</script>

<style scoped>
  #login_main {
    /*background-image: url(../../assets/img/bg_gihub_windows.jpg);*/
    background-image: -webkit-radial-gradient(rgba(107, 191, 242, 0.8), #2fa5ed);
    background-image: radial-gradient(rgba(107, 191, 242, 0.8), #2fa5ed);
    background: rgba(107, 191, 242, 0.9);
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
  }

  .login-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
    background-color: #ecf9ff;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }

  #register-btn {
    width: 80%;
    margin-left: 15%;
  }

  .logoText {
    color: #fff;
    font-size: 36px;
    line-height: 40px;
    display: flex;
    justify-content: center;
  }

  .logoText span {
    margin-left: 20px;
  }
</style>
