<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
        >批量删除
        </el-button>
        <!--        <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
        <!--          <el-option key="1" label="广东省" value="广东省"></el-option>-->
        <!--          <el-option key="2" label="湖南省" value="湖南省"></el-option>-->
        <!--        </el-select>-->
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="selectName">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="adddialogVisible = true" circle class="add"></el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getUserList" circle class="refresh"></el-button>
      </div>
      <el-table
        :data="query.tableData"
        border
        class="table"
        ref="multipleSelection"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column label="用户名" prop="userName">
        </el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.coverImg"
              :preview-src-list="[scope.row.coverImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="role.name" label="身份" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status=='1'?'success':'danger'"
            >
              <div v-if="scope.row.status=='1'">
                有效
              </div>
              <div v-else>
                禁止
              </div>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <div v-if="scope.row.sex==0">
              保密
            </div>
            <div v-else-if="scope.row.sex==1">
              男
            </div>
            <div v-else-if="scope.row.sex==2">
              女
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">
              {{ timestampToTime( parseInt(scope.row.createTime)) }}
            </div>
            <div v-else>
              空
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.modifyTime !== null">
              {{ timestampToTime( parseInt(scope.row.modifyTime)) }}
            </div>
            <div v-else>
              空
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
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
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="query.pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-row class="editUserItem" style="margin-top: 50px">
          <el-col :span="5" class="editUserItemLeft"><span>身份：</span></el-col>
          <el-col :span="19" style="margin-top: 5px">
            <el-radio-group v-model="roleIndex">
              <el-radio
                v-for="(item,i) in roleList"
                :label="item.id"
                :key="item.id">{{item.name}}
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="editUserItem" style="margin-top: 50px">
          <el-col :span="5" class="editUserItemLeft"><span>状态：</span></el-col>
          <el-col :span="12" style="margin-top: 5px">
            <el-radio v-model="status" label="1">有效</el-radio>
            <el-radio v-model="status" label="0">禁用</el-radio>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
    </el-dialog>
    <!--   添加用户  -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogVisible"
      width="50%">
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft"><span>账号：</span></el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="account"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft"><span>密码：</span></el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="password"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem" style="margin-top: 50px">
        <el-col :span="3" class="editUserItemLeft"><span>身份：</span></el-col>
        <el-col :span="12">
          <!--          <el-radio v-model="identity" label="2">访客</el-radio>-->
          <!--          <el-radio v-model="identity" label="1">管理员</el-radio>-->
          <!--          <el-radio v-model="identity" label="0">超级管理员</el-radio>-->
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft"><span>备注：</span></el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="usernote"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'userlist',
    data () {
      return {
        query: {
          address: '',
          name: '',
          pageIndex: 1,
          pageTotal: 0,
          tableData: [],
          pageSize: 3
        },
        roleList: [],
        roleIndex: 1,
        account: '',
        password: '',
        usernote: '',
        adddialogVisible: false,
        multipleSelection: [],
        delList: [],
        editVisible: false,
        form: {},
        status: '0',
        idx: -1,
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      //添加用户
      adduser () {
        var _this = this
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/user/adduser', {
          account: _this.account,
          password: _this.password,
          // isAdaim: _this.identity,
          note: _this.usernote
        }, config).then(function (res) {
          if (res.data.code == 200) {
            _this.getUserList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
        _this.adddialogVisible = false
      },
      //时间转换
      timestampToTime (row, column) {
        var date = new Date(row)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      },
      //获取用户列表
      getUserList () {
        var _this = this
        let formData = new FormData()
        formData.append('currentPage', _this.query.pageIndex)
        formData.append('pageSize', _this.query.pageSize)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/user/lists', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.query.tableData = res.data.data.lists
            _this.query.pageTotal = res.data.data.totalRows
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      //删除用户
      delUser (index) {
        var _this = this
        let formData = new FormData()
        formData.append('id', this.query.tableData[index].id)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/user/deluser', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success('删除成功')
            this.query.pageIndex = 1
            _this.getUserList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      // 删除操作
      handleDelete (index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            //删除操作
            this.delUser(index)
          })
          .catch(() => {
          })
      },
      // 多选操作
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      delAllSelection () {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            const length = this.multipleSelection.length
            let str = ''
            this.delList = this.delList.concat(this.multipleSelection)
            var select = new Array()
            for (let i = 0; i < length; i++) {
              str += this.multipleSelection[i].userName + ' '
              select[i] = this.multipleSelection[i].id
            }
            this.delSelectUser(select)
            this.$message.error(`删除了${str}`)
          })
          .catch(() => {
          })

      },
      //多选删除
      delSelectUser (ids) {
        var _this = this
        let formData = new FormData()
        formData.append('ids', ids)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/user/delsmoreuser', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success('删除成功')
            this.query.pageIndex = 1
            _this.getUserList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      }
      , selectName () {
        this.query.pageIndex = 1
        this.selbyname()
      },
      //搜索名字
      selbyname () {
        var _this = this
        let formData = new FormData()
        formData.append('name', this.query.name)
        formData.append('currentPage', _this.query.pageIndex)
        formData.append('pageSize', _this.query.pageSize)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post('http://localhost:8081/user/selbyname', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.query.tableData = res.data.data.lists
            _this.query.pageTotal = res.data.data.totalRows
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      // 编辑操作
      handleEdit (index, row) {
        this.getRoles(index)
        this.status = this.query.tableData[index].status.toString()
        this.idx = index
        this.form = row
        this.editVisible = true
      },
      // 保存编辑
      editUser () {
        this.editVisible = false
        // this.$set(this.query.tableData, this.idx, this.form)
        var _this = this
        let config = {
          headers: {
            'token': store.state.token
          }
        }

        let formData = new FormData()
        formData.append('userId', _this.query.tableData[_this.idx].id)
        formData.append('roleId', _this.roleIndex)

        this.$axios.post(store.state.url + '/user/addRoles', formData,
          config).then(function (res) {
          if (res.data.code == 200) {
            _this.editStatus()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })

      },editStatus(){
        var _this = this
        let config = {
          headers: {
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/user/editinfo', {
          id: _this.query.tableData[_this.idx].id,
          status: parseInt(_this.status)
        }, config).then(function (res) {
          if (res.data.code == 200) {
            _this.getUserList()
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      //获取身份列表
      getRoles (index) {
        var _this = this
        // _this.roleIndex = _this.query.tableData[index].roleid
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.get(store.state.url + '/role/lists', config).then(function (res) {
          if (res.data.code == 200) {
            _this.roleIndex = _this.query.tableData[index].role.id
            _this.roleList = res.data.data
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      // 分页导航
      handlePageChange (val) {
        this.$set(this.query, 'pageIndex', val)
        console.log('this.query.name')
        console.log(this.query.name)
        if (this.query.name == '') {
          this.getUserList()
        } else {
          this.selbyname()
        }
      }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }

  .add {
    position: fixed;
    /*align-self: flex-end;*/
    right: 130px;
  }

  .refresh {
    position: fixed;
    /*align-self: flex-end;*/
    right: 80px;
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
