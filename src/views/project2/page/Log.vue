<template xmlns:>
  <div>
    <el-table :data="logData.list" style="width: 100%">
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
      :visible.sync="detailDialog.detailDialogVisible"
      width="30%"
      height="50%"
    >
      <span>${{detailDialog.detailDialogexceptionDetail}}</span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";

import Vue from "vue";
import {
  getLogList
} from "@/api/api";

export default {
  name: "log",
  data() {
    return {
      logData: {
        list: [],
        currentPage: 1,
        pageSize: 10
      },
      detailDialog: {
        detailDialogVisible: false, //查看详情dialog
        detailDialogexceptionDetail: "" //查看详情dialog的内容
      }
    };
  },
  methods: {
    getData() {
      var params = {
          currentPage:this.logData.currentPage,
          pageSize:this.logData.pageSize
      }

      getLogList(params).then(res => {
            this.logData.list = res.data.lists;
        })
    },
    detail(data) {
      this.detailDialog.detailDialogVisible = true;
      this.detailDialog.detailDialogexceptionDetail = data.exceptionDetail;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>
