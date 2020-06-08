<template>
  <div>
    <el-card shadow="hover" :body-style="{padding: '0px'}" id="cardbg">
      <el-row>
        <el-col :span="6">
          <div class="crop-demo">
            <div class="crop-demo-btn">
              <img :src="cropImg" class="pre-img" />
              <input
                class="crop-input"
                type="file"
                name="image"
                accept="image/*"
                @change="setImage"
                multiple="multiplt"
              />
            </div>
          </div>
          <el-button v-on:click="editdialogVisible = true" class="edit">编辑资料</el-button>
        </el-col>
        <el-col :span="12">
          <div class="userInfo">
            <div>
              <i class="el-icon-user userFont">账号：{{account}}</i>
            </div>
            <div>
              <i class="el-icon-s-custom userFont">用户名：{{username}}</i>
            </div>
            <div>
              <i class="el-icon-male userFont">性别：{{sexText}}</i>
            </div>
            <div>
              <i class="el-icon-printer userFont">邮箱：{{email}}</i>
            </div>
            <div>
              <i class="el-icon-tickets userFont">简介：{{usernote}}</i>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="裁剪图片" :visible.sync="cropImgDialogVisible" width="30%">
      <vue-cropper
        ref="cropper"
        :src="imgSrc"
        :ready="cropImage"
        :zoom="cropImage"
        :cropmove="cropImage"
        style="width:100%;height:300px;"
      ></vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCrop">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="个人信息修改" :visible.sync="editdialogVisible" width="50%">
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>用户名：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="username" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>邮箱：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="email" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>性别：</span>
        </el-col>
        <el-col :span="12">
          <el-radio v-model="sex" label="1">男</el-radio>
          <el-radio v-model="sex" label="2">女</el-radio>
          <el-radio v-model="sex" label="0">保密</el-radio>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>备注：</span>
        </el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="usernote"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            clearable
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePassword">修改密码</el-button>
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="enterEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="changPasswordDialog" width="50%">
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>老密码：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="oldpassword" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>新密码：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="newpassword" clearable></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="enterChangePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import store from "@/store";
import { updatePassword, getInfo,editUser } from "@/api/userApi";

export default {
  name: "UserInfo",
  data: function() {
    return {
      defaultSrc: require("../../../assets/img/default.jpg"),
      fileList: [],
      imgSrc: "",
      cropImg: "",
      cropImgDialogVisible: false,
      editdialogVisible: false,
      changPasswordDialog: false,
      file: "",
      account: "",
      username: "",
      sex: "",
      sexText: "",
      email: "",
      usernote: "",
      oldpassword: "",
      newpassword: ""
    };
  },
  components: {
    VueCropper
  },
  methods: {
    setImage(_img) {
      var _this = this;
      const file = _img.target.files[0];
      this.file = _img.target.files[0];
      if (!file.type.includes("image/")) {
        _this.$message.error("不是图片");
        return;
      }
      if (file.size > 1024 * 500) {
        _this.$message.error("图片过大");
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        this.cropImgDialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    cancelCrop() {
      this.cropImgDialogVisible = false;
      this.cropImg = this.defaultSrc;
    },
    update() {
      this.cropImgDialogVisible = false;
      this.submitAddFile();
    },
    submitAddFile() {
      let formData = new FormData();
      formData.append("img", this.file, this.file.name);
      formData.append("userId", this.$store.state.userId);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      }; //添加请求头
      this.$axios
        .post(this.NET.BASE_URL + "/api/user/upload_icon", formData, config)
        .then(response => {
          console.log(response.data);
        });
    },
    getUername() {
      getInfo().then(res => {
        this.account = res.data.account;
        this.username = res.data.userName;
        this.sex = res.data.sex.toString();
        if (res.data.sex == 1) {
          this.sexText = "男";
        } else if (res.data.sex == 2) {
          this.sexText = "女";
        } else {
          this.sexText = "保密";
        }
        this.email = res.data.email;
        this.note = res.data.note;
      });
    },
    enterEdit() {
      this.editdialogVisible = false;
      var data = {
        userName: this.username,
        email: this.email,
        sex: this.sex,
        note: this.usernote
      };
      editUser(data).then(res => {
        this.getUername();
      });
    },
    cancelEdit() {
      this.editdialogVisible = false;
      this.getUername();
    },
    changePassword() {
      this.changPasswordDialog = true;
      this.editdialogVisible = false;
    },
    enterChangePassword() {
      this.changPasswordDialog = false;
      var data = {
        oldPass: this.oldpassword,
        newPass: this.newpassword
      };
      updatePassword(data).then(res => {});
    }
  },
  mounted() {
    //vue的生命周期，每次打开都调用
    this.getUername();
  },
  created() {
    this.cropImg = this.defaultSrc;
  }
};
</script>

<style scoped>
.pre-img {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}

.crop-demo {
  display: flex;
  align-items: flex-end;
}

.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 100px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  margin-top: 30px;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 100px;
  left: 17px;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

#cardbg {
  width: 800px;
  height: 300px;
}

.userInfo {
  margin-top: 50px;
}

.userFont {
  font-size: 17px;
  font-style: normal;
  color: #afb3bf;
  margin-bottom: 15px;
}

.edit {
  margin-left: 50px;
  width: 100px;
  margin-top: 30px;
}

.editUserItemLeft {
  padding-left: 15px;
  margin-top: 5px;
}

.editUserItem {
  margin-bottom: 10px;
  padding-left: 15px;
}
</style>
