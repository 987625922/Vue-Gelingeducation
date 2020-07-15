<template>
  <div class="container">
    <el-row>
      <el-col :span="13" style="margin-right: 20px">
        <div>
          <div>
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
            >批量删除</el-button>
            <el-input v-model="select.name" placeholder="角色名称" class="searchInput">
              <el-button slot="append" icon="el-icon-search" @click="selRoleByName"></el-button>
            </el-input>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="refresh"
              circle
              class="refresh"
            ></el-button>
          </div>
          <el-table
            :data="role.data"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
            <el-table-column prop="name" label="名称" width="120"></el-table-column>
            <el-table-column label="创建日期" align="left">
              <template slot-scope="scope">
                <div v-if="scope.row.createDate !== null">{{ toTime(scope.row.createDate) }}</div>
                <div v-else>空</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="130" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  class="edit"
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
        </div>
      </el-col>

      <el-col :span="10" style="background: #ffffff">
        <div class="top_add_role">{{edit.editBoxTitle}}</div>
        <div class="addRoleBox">
          <div class="addRoleName">
            角色名称：
            <el-input v-model="addRole.name" class="addRole.note"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            <label class="labelRoleName">角色备注：</label>
            <el-input v-model="addRole.note" class="inputRoleNote" type="textarea" :rows="5"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            <label class="labelRoleName">角色权限：</label>
            <div style="margin-left: 110px">
              <el-checkbox-group v-model="permission.selected">
                <el-checkbox
                  style="display: block;margin-bottom: 10px;"
                  v-for="item in permission.data"
                  :label="item.id"
                  :key="item"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button type="primary" class="saveRole" @click="addOrUpdate()">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from "@/store";
import {
  addRole,
  getRoleList,
  selByName,
  getRoleByIdForPermission,
  delRole,
  batchesDeletesRole,
  updateRole
} from "@/api/roleApi";
import { getPermissionList } from "@/api/perMission";
import { warningDialog } from "@/utils/dialog";
import { timestampToTime } from "@/utils/timeUtils";

export default {
  name: "rolelist",
  data() {
    return {
      role: {
        data: []
      },
      permission: {
        data: [],
        selected: []
      },
      addRole: {
        name: "",
        note: ""
      },
      select: {
        name: ""
      },
      moreSelect: {
        data: []
      },
      edit: {
        id: -1,
        editBoxTitle: "新增角色"
      }
    };
  },
  methods: {
    getData() {
      this.edit.id = -1;
      this.edit.editBoxTitle = "新增角色";
      getRoleList().then(res => {
        this.role.data = res.data;
      });
    },
    selRoleByName() {
      var params = {
        name: this.select.name
      };
      selByName(params).then(res => {
        this.select.name = "";
        this.role.data = res.data;
      });
    },
    getPermissionData() {
      getPermissionList().then(res => {
        this.permission.data = res.data;
        this.addRole.name = "";
        this.addRole.note = "";
      });
    }, //时间转换
    toTime(data) {
      return timestampToTime(parseInt(data));
    },
    // 多选操作
    handleSelectionChange(val) {
      this.moreSelect = val;
    },
    delAllSelection() {
      warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.moreSelect.length; i++) {
          if (i == 0) {
            select += this.moreSelect[i].id;
          } else {
            select += "," + this.moreSelect[i].id;
          }
        }
        this.delSelectRole(select);
      });
    },
    refresh() {
      this.getData();
      this.getPermissionData();
    },
    addOrUpdataClick() {
      if (this.edit.id == -1) {
      } else {
        this.addRoleData();
      }
    },
    handleUpdateRole() {
      var data = {
        id: this.edit.id,
        name: null,
        remark: null,
        permissions: null
      };
      if (this.addRole.name) {
        data.name = this.addRole.name;
      }
      if (this.addRole.note) {
        data.remark = this.addRole.note;
      }
      if (this.permission.selected) {
        for (let i = 0; i < permission.data.length; i++) {
          // for(let j = 0;j < )
        }
        data.permissions = this.permission.selected;
      }
      updateRole(data).then(res => {
        this.getData();
        this.clearEditData();
      });
    },
    addOrUpdate() {
      if (this.edit.editBoxTitle == "编辑角色") {
        this.handleUpdateRole();
      } else {
        var data = {
          name: null,
          remark: null,
          permissions: null
        };
        if (this.addRole.name) {
          data.name = name;
        }
        if (this.addRole.note) {
          data.remark = this.addRole.note;
        }
        if (this.permission.selected) {
          data.permissions = this.permission.selected;
        }
        addRole(data).then(res => {
          this.getData();
          this.clearEditData();
        });
      }
    },
    clearEditData() {
      this.addRole.name = null;
      this.addRole.note = null;
      this.permission.selected = null;
    },
    handleDelete(index, row) {
      // 二次确认删除
      warningDialog("确定要删除吗？").then(() => {
        //删除操作
        this.handleDelRole(index);
      });
    },
    handleEdit(index, row) {
      var params = {
        id: this.role.data[index].id
      };
      getRoleByIdForPermission(params).then(res => {
        let list = new Array();
        for (let i = 0; i < res.data.length; i++) {
          list.push(res.data[i].id);
        }
        this.permission.selected = list;
        this.edit.editBoxTitle = "编辑角色";
        this.edit.id = this.role.data[index].id;
        this.addRole.name = this.role.data[index].name;
        this.addRole.note = this.role.data[index].remark;
      });
    },
    handleDelRole(index) {
      var params = {
        id: this.role.data[index].id
      };
      delRole(params).then(res => {
        this.getData();
      });
    },
    delSelectRole(selectIds) {
      var params = {
        ids: selectIds
      };
      batchesDeletesRole(params).then(function(res) {
        this.getData();
      });
    }
  },
  mounted() {
    this.getData();
    this.getPermissionData();
  }
};
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
