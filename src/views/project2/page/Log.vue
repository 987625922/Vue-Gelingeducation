<template xmlns:>
  <div>
    <el-table :data="logList" style="width: 100%">
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="username" label="操作用户" width="180"></el-table-column>
      <el-table-column prop="requestIp" label="IP"></el-table-column>
      <el-table-column prop="address" label="IP来源"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="browser" label="浏览器"></el-table-column>
      <el-table-column prop="createTime" label="创建日期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      width="30%"
      height="50%"
      :before-close="handleClose"
    >
      <span>${{detailDialogexceptionDetail}}</span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";

import Vue from "vue";

Vue.directive("loadmore", {
  bind(el, binding) {
    const SELECTWRAP_DOM = el.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    SELECTWRAP_DOM.addEventListener("scroll", function() {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  }
});

export default {
  name: "log",
  data() {
    return {
      logList: [],
      currentPage: 1,
      pageSize: 10,
      detailDialogVisible: false, //查看详情dialog
      detailDialogexceptionDetail: "" //查看详情dialog的内容
    };
  },
  methods: {
    getLogList() {
      var _this = this;
      let config = {
        headers: {
          token: store.state.token
        }
      };
      let url =
        "/api/logs/list?currentPage=" +
        this.currentPage +
        "&pageSize=" +
        this.pageSize;

      this.$axios
        .get(this.NET.BASE_URL + url, config)
        .then(function(res) {
          console.log(res);
          if (res.data.code == 200) {
            _this.$message.success("获取成功");
            _this.logList = res.data.data.lists;
          } else {
            _this.$message(res.data.cdoe);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    detail(data) {
      this.detailDialogVisible = true
      this.detailDialogexceptionDetail = data.exceptionDetail
    }
  },
  created() {
    this.getLogList();
  }
};
</script>

<style scoped>
</style>
