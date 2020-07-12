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
    <el-table :data="teacherList.data"  @selection-change="handleSelectionChange" style="width: 100%;margin-top:10px">
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
      <el-table-column prop="modifyTime" label="修改时间" width="180">
         <template slot-scope="scope">
          <div v-if="scope.row.modifyTime !== null">{{ toTime(scope.row.modifyTime) }}</div>
          <div v-else>空</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" width="180" label="备注"></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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
    <div>
      <el-dialog title="提示" :visible.sync="addDialog.visible" width="50%">
        <el-form ref="form" label-width="100px">
          <el-form-item label="教师姓名：">
            <el-input v-model="addDialog.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="教师头像：">
            <el-input v-model="addDialog.img" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addDialog.note" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDialog.visible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddTeacher()">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="提示" :visible.sync="editDialog.visible" width="50%">
        <el-form ref="form" label-width="100px">
          <el-form-item label="教师姓名：">
            <el-input v-model="editDialog.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="教师头像：">
            <el-input v-model="editDialog.img" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="editDialog.note" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="editDialog.visible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditTeacher">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Vue from "vue";
import {
  searchTeacher,
  getTeacherList,
  deleteTeacher,
  addTeacher,
  updateTeacher,
  delMore
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
        pageTotal: 0,
        multipleSelection:""
      },
      addDialog: {
        visible: false,
        name: "",
        img: "",
        note: ""
      },
      editDialog: {
        id:"",
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
    //显示编辑dialog
    handleEdit(row) {
      this.editDialog.id = row.id;
      this.editDialog.name = row.name;
      this.editDialog.img = row.bigImg;
      this.editDialog.note = row.remark;
      this.editDialog.visible = true;
    },
    //编辑
    handleEditTeacher() {
      var params = {
        id:this.editDialog.id,
        name: this.editDialog.name,
        bigImg: this.editDialog.img,
        remark: this.editDialog.note
      };
      updateTeacher(params).then(res => {
        this.getListData()
        this.editDialog.visible = false
      });
    },
    //删除选择
    delAllSelection(){
         warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.teacherList.multipleSelection.length; i++) {
          if (i == 0) {
            select += this.teacherList.multipleSelection[i].id;
          } else {
            select += "," + this.teacherList.multipleSelection[i].id;
          }
        }
        this.HandledelMore(select);
      });
    },
    HandledelMore(select) {
      var params = {
        ids: select
      };
      delMore(params).then(res => {
          this.getListData()
      });
    },
    // 多选操作
    handleSelectionChange(sels) {
      this.teacherList.multipleSelection = sels;
    },
    //搜索教师
    searchTeacher() {
      var data = {
        name: encodeURIComponent(this.search.name),
        currentPage: this.teacherList.currentPage,
        pageSize: this.teacherList.pageSize
      };
      searchTeacher(data).then(res => {
        this.teacherList.data = res.data.lists;
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
