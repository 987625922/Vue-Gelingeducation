<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
        >批量删除</el-button>
        <el-input v-model="select.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="selectName">搜索</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addUserData.addDialogVisible = true"
          circle
          class="add"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="getUserData"
          circle
          class="refresh"
        ></el-button>
      </div>
      <el-table
        :data="userTable.tableData"
        border
        class="table"
        ref="userTable.multipleSelection"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.coverImg"
              :preview-src-list="[scope.row.coverImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="role.name" label="身份" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'success':'danger'">
              <div v-if="scope.row.status==1">有效</div>
              <div v-else>禁止</div>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <div v-if="scope.row.sex==0">保密</div>
            <div v-else-if="scope.row.sex==1">男</div>
            <div v-else-if="scope.row.sex==2">女</div>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">{{ toTime( scope.row.createTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.modifyTime !== null">{{ toTime( scope.row.modifyTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="userTable.pageIndex"
          :page-size="userTable.pageSize"
          :total="userTable.pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editUser.editDialogVisiable" width="30%">
      <el-form ref="form" label-width="70px">
        <el-row class="editUserItem" style="margin-top: 50px">
          <el-col :span="5" class="editUserItemLeft">
            <span>身份：</span>
          </el-col>
          <el-col :span="19" style="margin-top: 5px">
            <el-radio-group v-model="roleEdOrAddId">
              <el-radio v-for="item in roleList" :label="item.id"
               :key="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="editUserItem" style="margin-top: 50px">
          <el-col :span="5" class="editUserItemLeft">
            <span>状态：</span>
          </el-col>
          <el-col :span="12" style="margin-top: 5px">
            <el-radio v-model="editUser.status" label="1">有效</el-radio>
            <el-radio v-model="editUser.status" label="0">禁用</el-radio>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUser.editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--   添加用户  -->
    <el-dialog title="添加用户" :visible.sync="addUserData.addDialogVisible" width="50%">
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>账号：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="accountEdOrAdd" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>密码：</span>
        </el-col>
        <el-col :span="12">
          <el-input size="small" v-model="addUserData.password" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="5" class="editUserItemLeft">
          <span>身份：</span>
        </el-col>
        <el-col :span="19" style="margin-top: 5px">
          <el-radio-group v-model="roleEdOrAddId">
            <el-radio v-for="item in roleList" :label="item.id" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="editUserItem">
        <el-col :span="3" class="editUserItemLeft">
          <span>备注：</span>
        </el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="usernoteEdOrAdd"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            clearable
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserData.addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="HandleAdduser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import {
  addUser,
  getUserList,
  delUser,
  delMoreUser,
  selByName,
  editUser
} from "@/api/userApi";
import { getRoleByUserId,getRoleList } from "@/api/roleApi";
import { timestampToTime } from "@/utils/timeUtils";
import { warningDialog } from "@/utils/dialog";

export default {
  name: "userlist",
  data() {
    return {
      userTable: {
        pageIndex: 1,
        pageTotal: 0,
        tableData: [],
        pageSize: 5,
        multipleSelection: []
      },
      select: {
        name: ""
      },
      roleList: [],
      roleEdOrAddId: -1,
      accountEdOrAdd: "",
      usernoteEdOrAdd: "",
      addUserData: {
        password: "",
        addDialogVisible: false
      },
      editUser: {
        id: -1,
        editDialogVisiable: false,
        status: '0'
      }
    };
  },
  methods: {
    //添加用户
    HandleAdduser() {
      this.addUserData.addDialogVisible = false;
      var _role;
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].id == this.roleEdOrAddId) {
          _role = this.roleList[i];
        }
      }
      var data = {
        account: this.accountEdOrAdd,
        password: this.addUserData.password,
        note: this.usernoteEdOrAdd,
        role: _role
      };
      addUser(data).then(res => {
        this.accountEdOrAdd = "";
        this.addUserData.password = "";
        this.usernoteEdOrAdd = "";
        this.roleEdOrAddId = this.roleList[0].id;
        this.getUserData();
      });
    },
    //获取用户列表
    getUserData() {
      var data = {
        currentPage: this.userTable.pageIndex,
        pageSize: this.userTable.pageSize
      };
      getUserList(data).then(res => {
        this.userTable.tableData = res.data.lists;
        this.userTable.pageTotal = res.data.totalRows;
      });
    },
    //删除用户
    handleDelUser(index) {
      var data = {
        id: this.userTable.tableData[index].id
      };
      delUser(data).then(res => {
        this.userTable.pageIndex = 1;
        this.getUserData();
      });
    },
    // 删除操作
    handleDelete(index, row) {
      warningDialog("确定要删除吗？")
        .then(() => {
          //删除操作
          this.handleDelUser(index);
        })
        .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.userTable.multipleSelection = val;
    },
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    },
    delAllSelection() {
      warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.userTable.multipleSelection.length; i++) {
          if (i == 0) {
            select += this.userTable.multipleSelection[i].id;
          } else {
            select += "," + this.userTable.multipleSelection[i].id;
          }
        }
        this.delSelectUser(select);
      });
    },
    //多选删除
    delSelectUser(_ids) {
      var data = {
        ids: _ids
      };
      delMoreUser(data).then(res => {
        this.getUserData();
      });
    },
    selectName() {
      this.userTable.pageIndex = 1;
      this.selbyname();
    },
    //搜索名字
    selbyname() {
      var data = {
        name: encodeURI(this.select.name),
        currentPage: this.userTable.pageIndex,
        pageSize: this.userTable.pageSize
      };
      selByName(data).then(res => {
        this.userTable.tableData = res.data.lists;
        this.userTable.pageTotal = res.data.totalRows;
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.getUserRole(this.userTable.tableData[index].id);      
      this.editUser.status = this.userTable.tableData[index].status.toString();
      this.editUser.id = this.userTable.tableData[index].id;
      this.editUser.editDialogVisiable = true;
    },
    // 保存编辑
    handleEditUser() {
      this.editUser.editDialogVisiable = false;
      var _role = {
        id:this.roleEdOrAddId
      }
      var data = {
        id: this.editUser.id,
        role: _role,
        status: this.editUser.status
      };
      editUser(data).then(res => {
        this.getUserData();
      });
    },
    //获取身份列表
    getUserRole(_userId) {
      var data = {
        userId: _userId
      };
      getRoleByUserId(data).then(res => {
        this.roleEdOrAddId = res.data.id;
      });
    },
    getAddUserRoles() {
        getRoleList()
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isDefault == 1) {
                this.roleEdOrAddId = res.data[i].id;
              }
            }
            if(this.roleEdOrAddId == -1){
                this.roleEdOrAddId = res.data[0].id;
            }
            this.roleList = res.data;
        })
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.userTable, "pageIndex", val);
      if (this.select.name == "") {
        this.getUserData();
      } else {
        this.selbyname();
      }
    }
  },
  mounted() {
    this.getUserData();
    this.getAddUserRoles();
  }
};
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
