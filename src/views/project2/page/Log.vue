<template>
  <div>
    <div class="handle-box">
      <el-button
        type="primary"
        icon="el-icon-delete"
        class="handle-del mr10"
        @click="delAllSelection"
      >批量删除</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="getData" circle class="refresh"></el-button>
    </div>
    <el-table :data="logData.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="username" label="操作用户" width="180"></el-table-column>
      <el-table-column prop="requestIp" label="IP"></el-table-column>
      <el-table-column label="是否解决">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSolve==1?'success':'danger'">
            <div v-if="scope.row.isSolve==1">解决</div>
            <div v-else>未解决</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="IP来源">
        <template slot-scope="scope">
          <div v-if="scope.row.address">{{scope.row.address}}</div>
          <div v-else>空</div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="browser" label="浏览器"></el-table-column>
      <el-table-column prop="createTime" label="创建日期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看详情</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <div v-show="scope.row.isSolve==1">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleSolve(scope.row)"
            >标志为未解决</el-button>
          </div>
          <div v-show="scope.row.isSolve!=1">
            <el-button type="text" class="red" @click="handleNoSolve(scope.row)">标志为解决</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" :visible.sync="detailDialog.detailDialogVisible" width="30%" height="50%">
      <span>${{detailDialog.detailDialogexceptionDetail}}</span>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="logData.pageIndex"
        :page-size="logData.pageSize"
        :total="logData.pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import store from "@/store";

import Vue from "vue";
import { getLogList, delOneLog, delMore,solve,recurrent } from "@/api/log";
import { warningDialog } from "@/utils/dialog";

export default {
  name: "log",
  data() {
    return {
      logData: {
        list: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        multipleSelection: 0 //多选
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
        currentPage: this.logData.currentPage,
        pageSize: this.logData.pageSize
      };
      getLogList(params).then(res => {
        this.logData.list = res.data.lists;
        this.logData.pageTotal = res.data.totalRows;
      });
    },
    detail(data) {
      this.detailDialog.detailDialogVisible = true;
      this.detailDialog.detailDialogexceptionDetail = data.exceptionDetail;
    },
    // 删除操作
    handleDelete(row) {
      warningDialog("确定要删除吗？").then(() => {
        //删除操作
        this.delOneLog(row);
      });
    },
    delOneLog(data) {
      var params = {
        id: data.id
      };
      delOneLog(params).then(res => {
        this.getData();
      });
    },
    // 分页导航
    handlePageChange(pageIndex) {
      this.logData.currentPage = pageIndex;
      this.getData();
    },
    // 多选操作
    handleSelectionChange(sels) {
      this.logData.multipleSelection = sels;
    },
    delAllSelection() {
      warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.logData.multipleSelection.length; i++) {
          if (i == 0) {
            select += this.logData.multipleSelection[i].id;
          } else {
            select += "," + this.logData.multipleSelection[i].id;
          }
        }
        this.delMoreLog(select);
      });
    },
    //多选删除
    delMoreLog(_ids) {
      var data = {
        ids: _ids
      };
      delMore(data).then(res => {
        this.getData();
      });
    },
    //标志为解决
    handleSolve(data) {
      var params = {
        id:data.id
      }
      solve(params).then(res => {
        this.getData();
      });
    },
    //标志为解决
    handleNoSolve(data) {
      var params = {
        id:data.id
      }
      recurrent(params).then(res => {
        this.getData();
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.red {
  color: #ff0000;
}
.handle-box {
  margin-bottom: 20px;
}
.refresh {
  position: fixed;
  /*align-self: flex-end;*/
  right: 30px;
}
</style>
