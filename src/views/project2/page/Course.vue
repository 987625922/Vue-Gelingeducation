<template>
  <el-table
    :data="tableCourse"
    border
    class="table"
    ref="multipleSelection"
    header-cell-class-name="table-header"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column prop="id" label="编号" width="85" align="center"></el-table-column>
    <el-table-column prop="account" label="课程名" align="center" width="270"></el-table-column>
    <el-table-column label="绑定老师" prop="userName" align="center" width="150"></el-table-column>
    <el-table-column label="缩略图" align="center" width="200">
      <template slot-scope="scope">
        <el-image
          class="table-td-thumb"
          :src="scope.row.coverImg"
          :preview-src-list="[scope.row.coverImg]"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="userName" width="120" align="center"></el-table-column>
    <el-table-column label="是否免费" prop="userName" width="120" align="center"></el-table-column>
    <el-table-column label="操作" align="center" fixed="right">
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
</template>

<script>
  export default {
    name: "course",
    data() {
      return {
        tableCourse:[]
      }
    }, methods: {}
  }
</script>

<style scoped>

</style>
