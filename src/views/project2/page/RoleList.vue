<template>
  <div>
    <el-row>
      <el-col :span="13" style="margin-right: 20px">
        <div class="">
          <div>
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
            >批量删除
            </el-button>
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
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="120">
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
            <el-table-column label="操作" width="130" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  class="edit"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="red"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10" style="background: #ffffff">
        <div class="top_add_role">{{editBoxTitle}}</div>
        <div class="addRoleBox">
          <div class="addRoleName">
            角色名称：
            <el-input v-model="inputName" class="inputRoleNote"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            <label class="labelRoleName">角色备注：</label>
            <el-input v-model="inputRoleNote" class="inputRoleNote" type="textarea" :rows="5"></el-input>
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
        inputRoleNote: "",
        inputSelectName: "",
        multipleSelection: [],
        editRoleId: -1,
        editBoxTitle: "新增角色"
      }
    }, methods: {
      getRoleList() {
        this.editRoleId = -1
        this.editBoxTitle = '新增角色'
        var _this = this
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.get(this.NET.BASE_URL + '/role/lists', config
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
        this.$axios.post(this.NET.BASE_URL + '/role/sel_by_name', formData, config
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
        this.$axios.get(this.NET.BASE_URL + '/permission/lists', config
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
      },// 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      delAllSelection() {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            const length = this.multipleSelection.length
            let str = ''
            var select = new Array()
            for (let i = 0; i < length; i++) {
              str += this.multipleSelection[i].userName + ' '
              select[i] = this.multipleSelection[i].id
            }
            this.delSelectRole(select)
            // this.$message.error(`删除了${str}`)
          })
          .catch(() => {
          })

      },
      refresh() {
        this.getRoleList()
        this.getPermissionList()
      }, addRole() {
        var _this = this
        if (_this.editRoleId == -1) {
          let formData = new FormData()
          formData.append('name', this.inputName)
          formData.append('remark', this.inputRoleNote)
          formData.append('permissionIds', _this.permissionCheckList)
          let config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': store.state.token
            }
          }
          this.$axios.post(this.NET.BASE_URL + '/role/add_role_and_permissionids', formData, config
          ).then(function (res) {
            if (res.data.code == 200) {
              _this.$message.success(res.data.msg)
              _this.inputName = ''
              _this.inputRoleNote = ''
              _this.permissionCheckList = []
              _this.getRoleList()
            } else {
              _this.$message.error(res.data.msg)
            }
          }).catch(function (err) {
            console.log('==>' + err)
            _this.$message.error("错误")
          })
        } else {
          let formData = new FormData()
          formData.append('id', _this.editRoleId)
          formData.append('name', this.inputName)
          formData.append('remark', this.inputRoleNote)
          formData.append('permissionIds', _this.permissionCheckList)
          let config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': store.state.token
            }
          }
          this.$axios.post(this.NET.BASE_URL + '/role/update_role_and_permission', formData, config
          ).then(function (res) {
            if (res.data.code == 200) {
              _this.$message.success(res.data.msg)
              _this.inputName = ''
              _this.inputRoleNote = ''
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
      }, handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            //删除操作
            this.delRole(index)
          })
          .catch(() => {
          })
      }, handleEdit(index, row) {

        var _this = this
        let formData = new FormData()
        formData.append('id', this.roleList[index].id)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(this.NET.BASE_URL + '/role/get_role_by_id_for_permission', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            var permissionIds = new Array()
            for (let i = 0; i < res.data.data.length; i++) {
              permissionIds[i] = res.data.data[i].id
            }
            _this.permissionCheckList = permissionIds
            _this.editBoxTitle = '编辑角色'
            _this.editRoleId = _this.roleList[index].id
            _this.inputName = _this.roleList[index].name
            _this.inputRoleNote = _this.roleList[index].remark
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })


      }, delRole(index) {
        var _this = this
        let formData = new FormData()
        formData.append('id', this.roleList[index].id)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(this.NET.BASE_URL + '/role/del_role', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success('删除成功')
            _this.getRoleList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      }, delSelectRole(selectIds) {
        var _this = this
        let formData = new FormData()
        formData.append('roleIds', selectIds)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(this.NET.BASE_URL + '/role/batches_deletes', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
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

  .inputRoleNote {
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
    background: #ffffff;
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

  .red {
    color: #ff0000;
  }

  .edit {
    color: #1e93ff;
  }

  .mr10 {
    margin-right: 10px;
  }
</style>
