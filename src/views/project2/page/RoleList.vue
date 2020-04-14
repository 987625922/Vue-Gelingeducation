<template>
  <div>
    <el-row>
      <el-col :span="14">
        <div class="">
          <div>
            <el-input v-model="input" placeholder="角色名称" class="searchInput">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" icon="el-icon-refresh" @click="" circle class="refresh"></el-button>
          </div>
          <el-table
            :data="tableData"
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
      <el-col :span="10">
        <div class="addRoleBox">
          <div class="addRoleName">
            角色名称：
            <el-input v-model="input" class="inputRoleName"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          <div class="addRoleName">
            角色备注：
            <el-input v-model="textarea" class="inputRoleName" type="textarea" :rows="5"></el-input>
          </div>
        </div>
        <div class="addRoleBox">
          角色权限：
          <el-checkbox-group v-model="permissionList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
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
  export default {
    name: 'rolelist',
    data () {
      return {
        tableData: [],
        permissionList:[]
      }
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
    background: #ffffff;
    border-radius: 5px;
  }

  .inputRoleName {
    width: 200px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .addRoleName {
    margin-left: 55px;
  }

  .tvRoleBox {
    float: top;
  }
</style>
