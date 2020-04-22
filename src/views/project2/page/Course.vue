<template>
  <div>
    <el-row>
      <el-col :span="12" push="5">
        <el-button type="primary" icon="el-icon-refresh" @click="getUserList" circle class="refresh"></el-button>
      </el-col>
    </el-row>
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
      <el-table-column prop="name" label="课程名" align="center" width="270"></el-table-column>
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
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status=='1'?'success':'danger'"
          >
            <div v-if="scope.row.status=='1'">
              正常
            </div>
            <div v-else>
              禁止
            </div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否免费" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isFree=='0'?'success':'warning'"
          >
            <div v-if="scope.row.isFree=='1'">
              付费
            </div>
            <div v-else>
              免费
            </div>
          </el-tag>
        </template>
      </el-table-column>
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
    <div class="pagination">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        :current-page="pageIndex"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: "course",
    data() {
      return {
        tableCourse: [],
        pageIndex: 1,
        pageSize: 5,
        pageTotal: 0,
        selName: ''
      }
    }, methods: {
      //获取用户列表
      getCourseList() {
        var _this = this
        let formData = new FormData()
        formData.append('currentPage', _this.pageIndex)
        formData.append('pageSize', _this.pageSize)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': store.state.token
          }
        }
        this.$axios.post(store.state.url + '/course/lists', formData, config
        ).then(function (res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg)
            _this.tableCourse = res.data.data.lists
            _this.pageTotal = res.data.data.totalRows
          } else {
            _this.$message.error(res.data.msg)
          }
        }).catch(function (err) {
          _this.$message.error(err.data)
        })
      },
      // 分页导航
      handlePageChange(val) {
        this.$set(this, 'pageIndex', val)
        if (this.selName == '') {
          this.getCourseList()
        } else {
          this.selbyname()
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCourseList()
      }
    },
    created() {
      this.getCourseList()
    }
  }
</script>

<style scoped>
  .red {
    color: #ff0000;
  }

</style>
