<template>
  <div>
    <el-row>
      <el-col :span="13" style="margin-right: 20px">
        <div class="">
          <div>
            <el-input v-model="inputSelectName" placeholder="角色名称" class="searchInput">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" icon="el-icon-refresh" @click="" circle class="refresh"></el-button>
          </div>
          <el-table
            :data="roleList"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="创建日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10" style="background: #ffffff">
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
          角色权限：
          <el-checkbox-group v-model="permissionCheckList">
            <el-checkbox
            v-for="(item,i) in permissionList"
            :label="item.id"
            :key="item.id">{{item.name}}
          </el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <el-button type="primary">保存</el-button>
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
        inputSelectName:""
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
          console.log('==>'+err)
          _this.$message.error("错误")
        })
      },getPermissionList(){
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
  }

  .inputRoleName {
    width: 370px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .inputRoleNote {
    width: 370px;
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
</style>
