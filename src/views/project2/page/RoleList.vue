<template>
  <div>
    <el-row>
      <el-col :span="13" style="margin-right: 20px">
        <div class="">
          <div>
            <el-input v-model="inputSelectName" placeholder="角色名称" class="searchInput">
              <el-button slot="append" icon="el-icon-search" @click="selRoleByName"></el-button>
            </el-input>
            <el-button type="primary" icon="el-icon-refresh" @click="refresh" circle class="refresh"></el-button>
          </div>
          <el-table
            :data="roleList"
            border
            height="550px"
            class="table"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column label="创建日期" align="left">
              <template slot-scope="scope">
                <div v-if="scope.row.createDate !== null">
                  {{ timestampToTime( parseInt(scope.row.createDate)) }}
                </div>
                <div v-else>
                  空
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10" style="background: #ffffff">
        <div class="top_add_role">新增角色</div>
        <div class="addRoleBox">
          <div class="addRoleName">
            角色名称：
            <el-input v-model="inputName" class="inputRoleName"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            <label class="labelRoleName">角色备注：</label>
            <el-input v-model="inputRoleName" class="inputRoleNote" type="textarea" :rows="5"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            <label class="labelRoleName">角色权限：</label>
            <div style="margin-left: 110px">
              <el-checkbox-group v-model="permissionCheckList">
                <el-checkbox
                  style="display: block;margin-bottom: 10px;"
                  v-for="(item,i) in permissionList"
                  :label="item.id"
                  :key="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button type="primary" class="saveRole" @click="addRole">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import store from '@/store'

  export default {
    name: 'rolelist',
    data() {
      return {
        roleList: [],
        permissionList: [],
        permissionCheckList: [],
        inputName: "",
        inputRoleName: "",
        inputSelectName: ""
      }
    }, methods: {
      getRoleList() {
        var _this = this
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.get(store.state.url + '/role/lists', config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.roleList = res.data.data
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          console.log('==>' + err)
          _this.$message.error("错误")
        })
      }, selRoleByName() {
        var _this = this
        let formData = new FormData()
        formData.append('name', this.inputSelectName)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/role/sel_by_name', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.roleList = res.data.data
            _this.inputSelectName = ""
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          console.log('==>' + err)
          _this.$message.error("错误")
        })
      }, getPermissionList() {
        var _this = this
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.get(store.state.url + '/permission/lists', config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.permissionList = res.data.data
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error("错误")
        })
      }, //时间转换
      timestampToTime(row) {
        var date = new Date(row)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      },
      refresh() {
        this.getRoleList()
        this.getPermissionList()
      }, addRole() {
        var _this = this
        let formData = new FormData()
        formData.append('name', this.inputName)
        formData.append('remark', this.inputRoleName)
        formData.append('permissionIds', _this.permissionCheckList)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/role/add_role_and_permissionids', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.inputName = ''
            _this.inputRoleName = ''
            _this.permissionCheckList = []
            _this.getRoleList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          console.log('==>' + err)
          _this.$message.error("错误")
        })
      }
    },
    created() {
      this.getRoleList()
      this.getPermissionList()
    }
  }
</script>

<style scoped>
  .searchInput {
    width: 250px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .refresh {
    /*align-self: flex-end;*/
    float: right;
    margin-right: 20px;
  }

  .addRoleBox {
    border-radius: 5px;
    margin-top: 10px;
  }

  .inputRoleName {
    width: 70%;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .inputRoleNote {
    width: 70%;
    margin-top: 5px;
    margin-bottom: 5px;

  }

  .addRoleName {
    margin-left: 55px;
    position: relative;
  }

  .labelRoleName {
    float: left;
    display: block;
    width: 80px;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    margin-right: 5px;
  }

  .saveRole {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    background-color: #00809d;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    margin-right: 30px;
  }

  .footer {
    padding: 10px;
    line-height: 36px;
    text-align: right;
    background: #f9f9f9;
  }

  .top_add_role {
    position: relative;
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
  }
</style>
