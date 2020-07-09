<template>
  <div class="container">
    <el-row>
      <el-col :span="18">
        <el-row>
          <el-col :span="5">
            <el-input
              v-model="search.name"
              class="input-style"
              placeholder="搜索的教师名"
              prefix-icon="el-icon-search"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="5" style="margin-left:10px;">
            <el-button type="primary" @click="searchTeacher" icon="el-icon-search">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <div style="float:right;">
          <el-button type="primary" icon="el-icon-delete" @click="delAllSelection">批量删除</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addDialog.visible = true"
            circle
            class="add"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="getListData"
            circle
            class="refresh"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="teacherList.data" style="width: 100%;margin-top:10px">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="id" width="90" align="center"></el-table-column>
      <el-table-column prop="name" label="用户名" width="180" align="center"></el-table-column>
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
          <div v-if="scope.row.createTime !== null">{{ toTime(scope.row.createTime) }}</div>
          <div v-else>空</div>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="remark" width="180" label="备注"></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        :current-page="teacherList.currentPage"
        :page-size="teacherList.pageSize"
        :total="teacherList.pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="addDialog.visible" width="30%">
      <div>
        <el-row>
          <el-col :span="3">
            <span>教师姓名：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="addDialog.name" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="3">
            <span>教师头像：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="addDialog.img" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="3">
            <span>备注：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="addDialog.note" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddTeacher()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import Vue from "vue";
import {
  searchTeacher,
  getTeacherList,
  deleteTeacher,
  addTeacher
} from "@/api/teacher";
import { timestampToTime } from "@/utils/timeUtils";
import { warningDialog } from "@/utils/dialog";

export default {
  name: "Teacher",
  data() {
    return {
      teacherList: {
        data: [],
        currentPage: 1,
        pageSize: 5,
        pageTotal: 0
      },
      addDialog: {
        visible: false,
        name: "",
        img: "",
        note: ""
      },
      search: {
        name: ""
      }
    };
  },
  methods: {
    getListData() {
      var params = {
        currentPage: this.teacherList.currentPage,
        pageSize: this.teacherList.pageSize
      };
      getTeacherList(params).then(res => {
        this.teacherList.data = res.data.lists;
        this.teacherList.pageTotal = res.data.totalRows;
      });
    }, //时间转换
    toTime(row) {
      return timestampToTime(parseInt(row));
    },
    // 分页导航
    handlePageChange(val) {
      this.teacherList.currentPage = val;
      this.getListData();
    },
    // 删除操作
    handleDelete(index, row) {
      warningDialog("确定要删除吗？").then(() => {
        this.delTeacherById(index);
      });
    },
    delTeacherById(index) {
      var data = {
        id: this.teacherList.data[index].id
      };
      deleteTeacher(data).then(res => {
        this.getListData();
      });
    },
    handleAddTeacher() {
      this.addDialog.visible = false;
      var body = {
        name: this.addDialog.name,
        bigImg: this.addDialog.img,
        remark: this.addDialog.note
      };
      addTeacher(body).then(res => {
        this.getListData();
      });
      this.addDialog.name = "";
      this.addDialog.img = "";
      this.addDialog.note = "";
    },
    //搜索教师
    searchTeacher() {
      var data = {
        name: encodeURIComponent(this.search.name),
        currentPage: this.teacherList.currentPage,
        pageSize: this.teacherList.pageSize
      };
      searchTeacher(data).then(res => {
        if (res.data.lists && res.data.totalRows > 0) {
          this.teacherList.currentPage = 1;
          this.searchTeacher();
        } else {
          this.teacherList.data = res.data.lists;
        }
      });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style scoped>
.red {
  color: #ff0000;
}
.input-title {
  font-size: 15px;
  line-height: 40px;
  text-align: right;
}
</style>
