<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../../assets/img/default.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{this.$store.state.username}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            账号：
            <span>{{account}}</span>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span v-if="lastLoginTime">{{ toTime(lastLoginTime) }}</span>
            <span v-else>空</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb21">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{allLoginMun}}</div>
                  <div>用户总访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="icon web wifangwen grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{todayLoginMun}}</div>
                  <div>今日访问</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="icon web wiip grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{todayLoginIpMun}}</div>
                  <div>今日ip</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>视频数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from "@/store";
import { timestampToTime } from "@/utils/timeUtils";

export default {
  name: "main",
  data() {
    return {
      account: "",
      lastLoginTime: "",
      role: "",
      allLoginMun: "",
      todayLoginMun: "",
      todayLoginIpMun: ""
    };
  },
  mounted() {
    //vue的生命周期，每次打开都调用
    this.getUername(),
     this.getIndex();
  },
  methods: {
    getUername() {
      var _this = this;
      this.$axios
        .get(this.NET.BASE_URL + "/api/user/get_info", {
          headers: {
            token: store.state.token
          },
          params: {
            id: store.state.userId
          }
        })
        .then(function(res) {
          if (res.data.code == 200) {
            store.commit("setUserName", res.data.data.userName);
            _this.account = res.data.data.account;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    getIndex() {
      var _this = this;
      this.$axios
        .get(this.NET.BASE_URL + "/web/index", {
          headers: {
            token: store.state.token
          },
          params: {
            id: store.state.userId
          }
        })
        .then(function(res) {
          if (res.data.code == 200) {
            _this.lastLoginTime = res.data.data.lastLoginTime;
            _this.allLoginMun = res.data.data.allLoginMun;
            _this.todayLoginMun = res.data.data.todayLoginMun;
            _this.todayLoginIpMun = res.data.data.todayLoginIpMun;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    }
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 10px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 120px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 15px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 10px;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
