<template>
  <div>
    <el-table :data="teacherList" style="width: 100%">
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="name" label="用户名" width="180"></el-table-column>
      <el-table-column label="头像(查看大图)" align="center">
        <template slot-scope="scope">
          <el-image
            class="table-td-thumb"
            :src="scope.row.big_img"
            :preview-src-list="[scope.row.big_img]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
           <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">
              {{ timestampToTime( parseInt(scope.row.createTime)) }}
            </div>
            <div v-else>
              空
            </div>
          </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>

import store from "@/store";

import Vue from "vue";

export default {
  name: "Teacher",
  data() {
    return {
      teacherList: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    getTeacherList() {
      var _this = this;
      let config = {
        headers: {
          token: store.state.token
        }
      };
      let url =
        "/api/teacher/lists?currentPage=" +
        this.currentPage +
        "&pageSize=" +
        this.pageSize;

      this.$axios
        .get(this.NET.BASE_URL + url, config)
        .then(function(res) {
          console.log(res);
          if (res.data.code == 200) {
            _this.$message.success("获取成功");
            _this.teacherList = res.data.data.lists;
          } else {
            _this.$message(res.data.cdoe);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    }
  },created(){
    this.getTeacherList()
  }
};
</script>

<style scoped>
</style>
