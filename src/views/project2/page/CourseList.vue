<template xmlns:>
  <div>
    <el-row style="background-color:#ffffff;padding:10px;">
      <el-col :span="18">
        <div class="inputText">
          <span>课程名：</span>
          <el-input
            style="width: 70%"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="select.name"
            clearable
          ></el-input>
        </div>
        <div class="inputText">
          状态：
          <el-select
            style="width: 70%"
            @change="selectStatus"
            clearable
            v-model="select.statusselect"
            placeholder="请选择"
          >
            <el-option v-for="item in select.status" :key="item.value" :label="item.name" :value="item"></el-option>
          </el-select>
        </div>
        <div class="inputText" style="width: 30%;">
          价格：
          <el-input v-model="select.selStartPrice" style="width: 20%;display:inline-block;" placeholder></el-input>
          <span>-</span>
          <el-input v-model="select.selEndPrice" style="width: 20%;display:inline-block" placeholder></el-input>
        </div>
      </el-col>
      <el-col :span="6" style="text-align: right;">
        <el-button type="primary" icon="el-icon-plus" @click="showAddUser" circle class="rightview"></el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="getCourseList"
          circle
          class="rightview"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="rightview"
          @click="delAllSelection"
        >批量删除</el-button>
        <el-button
          class="rightview"
          type="primary"
          icon="el-icon-search"
          @click="selectCourseList"
        >搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="radiusbg">
      <el-col :span="5">
        <div class="inputText">
          <span stype="float:right;">老师：</span>
          <el-select
            @change="selectTeacher"
            style="width: 70%"
            clearable
            　　　　　　v-model="select.teacherSelValue"
            　　　　　　placeholder="请选择"
            　　　　　　v-loadmore="loadMoreData"
          >
            <el-option v-for="item in teachers.list" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="courseTable.data"
      border
      class="table"
      ref="multipleSelection">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" width="85" align="center"></el-table-column>
      <el-table-column prop="name" label="课程名" align="center"></el-table-column>
      <el-table-column label="绑定老师" align="center" width="250">
        <template slot-scope="scope">
          <div v-for="item in scope.row.teachers"  v-bind:key="item">
            <span v-if="scope.row.teachers.length > 1">{{item.name}}</span>
            <span v-else>{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" align="center" width="250">
        <template slot-scope="scope">
          <el-image
            class="table-td-thumb"
            :src="scope.row.coverImg"
            :preview-src-list="[scope.row.coverImg]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='1'?'success':'danger'">
            <div v-if="scope.row.status=='1'">正常</div>
            <div v-else>禁止</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否免费" align="center" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.price=='0'?'success':'warning'">
            <div v-if="scope.row.price > 0">付费</div>
            <div v-else>免费</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" 
          @click="handleItemEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleItemDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        :current-page="courseTable.pageIndex"
        :total="courseTable.pageTotal"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrpageChange"
      ></el-pagination>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <div style="width: 70%">
        <span>课程名：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="edName"></el-input>
      </div>
      <div style="with:70%">
        <span stype="float:right;">老师：</span>
        <el-select
          style="width: 70%"
          multiple
          collapse-tags
          clearable
          　　　　　　v-model="edteacherValue"
          　　　　　　placeholder="请选择"
          　　　　　　v-loadmore="loadMoreData"
        >
          <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div style="width: 70%">
        状态：
        <el-select style="width: 70%" clearable v-model="edStatusSelId" placeholder="请选择">
          <el-option
            v-for="item in select.status"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>价格：</span>
        <el-input style="width: 70%" placeholder="0为免费" v-model="edPrice"></el-input>
      </div>
      <div>
        <span>备注：</span>
        <el-input style="width: 70%" placeholder="备注" v-model="edRemark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!--   添加课程  -->
    <el-dialog title="添加课程" :visible.sync="adddialogVisible" width="50%">
      <div style="width: 70%">
        <span>课程名：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="addName"></el-input>
      </div>
      <div style="with:70%">
        <span stype="float:right;">老师：</span>
        <el-select
          style="width: 70%"
          multiple
          collapse-tags
          v-model="addteacherValue"
          placeholder="请选择"
          v-loadmore="loadMoreData"
        >
          <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <!-- <div style="width: 70%">
        <span>封面：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="addBigUrl"></el-input>
      </div>-->
      <div style="width: 70%">
        <span>封面：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="addBigUrl"></el-input>
      </div>
      <div>
        <span>价格：</span>
        <el-input style="width: 70%" placeholder="0和不填为免费" v-model="addPrice"></el-input>
      </div>
      <div>
        <span>备注：</span>
        <el-input style="width: 70%" placeholder="备注" v-model="addRemark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { warningDialog } from "@/utils/dialog";
import { getTeacherList, courseUpdate } from "@/api/api";

export default {
  name: "course",
  data() {
    return {
      courseTable: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
        data: []
      },
      select: {
        name: "",
      selStartPrice: "",
      selEndPrice: "",
      teacherSelValue: "",
      teacherSelId: -1,
      statusselect: "",
      statusSelId: -1,
        status: [
        {
          value: 1,
          name: "正常"
        },
        {
          value: 0,
          name: "禁止"
        }
      ]
      },
      teachers:{
        list:[]
      },
      adddialogVisible: false,
      // 添加课程
      addName: "",
      addteacherValue: [],
      addteacherId: "",
      addBigUrl: "",
      addPrice: "",
      addRemark: "",
      selectItemIds: [],
      //编辑
      edCourseId: -1,
      editVisible: false,
      edName: "",
      edteacherValue: [],
      edteacherId: "",
      edBigUrl: "",
      edPrice: "",
      edRemark: "",
      edselectItemIds: [],
      edChangeStatusValue: "",
      edStatusSelId: "",
      
    };
  },
  methods: {
    selectTeacher(selVal) {
      this.select.teacherSelId = selVal.id;
      this.select.teacherSelValue = selVal.name;
    },
    loadMoreData() {

    },
    selectEdTeacher(selVal) {
      this.addteacherValue = selVal.name;
      this.addteacherId = selVal.id;
    },
    edChagestatus(selVal) {
      this.edChangeStatusValue = selVal.value;
    },
    selectStatus(selVal) {
      this.select.statusSelId = selVal.value;
    }, // 多选操作
    edSelectStatus(selVal) {
      this.edStatusSelId = selVal.value;
    },
    handleGetTeacherList() {
      var params = {
        currentPage: this.courseTable.pageIndex,
        pageSize: this.courseTable.pageSize
      };
      getTeacherList(params).then(res => {
        this.teachers.list = res.data.lists;
      });
    },
    editCourse() {
      this.editVisible = false;      
      var _teacherLists = [];
      for (let i = 0; i < this.teachers.list.length; i++) {
        for (let j = 0; j < this.edteacherValue.length; j++) {
          if (this.teachers.list[i].id == this.edteacherValue[j]) {
            _teacherLists.push(this.teachers.list[i]);
          }
        }
      }

      var params = {
        id: this.edCourseId,
        name: this.edName,
        bingImg: this.edBigUrl,
        remark: this.edRemark,
        price: this.edPrice,
        status: this.edStatusSelId,
        teachers: _teacherLists
      };
      
      courseUpdate(params).then(res => {
         this.getCourseList();
      });

     
    },
    selectCourseList() {
      var _this = this;
      let formData = new FormData();
      if (
        typeof _this.select.teacherSelId != "undefined" &&
        _this.select.teacherSelId != ""
      ) {
        formData.append("teacherId", _this.select.teacherSelId);
      }
      formData.append("currentPage", _this.courseTable.pageIndex);
      formData.append("pageSize", _this.courseTable.pageSize);
      if (_this.select.name != "") {
        formData.append("name", _this.select.name);
      }
      if (_this.selStartPrice != "") {
        formData.append("startPrice", _this.select.selStartPrice);
      }
      if (_this.selEndPrice != "") {
        formData.append("endPrice", _this.select.selEndPrice);
      }
      if (_this.select.statusSelId != -1) {
        formData.append("status", _this.select.statusSelId);
      }
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(
          this.NET.BASE_URL + "/api/course/sel_by_name_or_status_price_teacher",
          formData,
          config
        )
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg);
            _this.courseTable.data = res.data.data.lists;
            _this.courseTable.pageTotal = res.data.data.totalRows;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    // 删除操作
    handleItemDelete(index, row) {
      // 二次确认删除
      warningDialog("11").then(() => {
        //删除操作
        this.delCourse(index);
      });
    },
    //删除课程
    delCourse(index) {
      var _this = this;
      let formData = new FormData();
      formData.append("id", this.courseTable.data[index].id);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(this.NET.BASE_URL + "/api/course/delect", formData, config)
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success("删除成功");
            _this.getCourseList();
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    handleItemEdit(index, row) {
      this.editVisible = true;
      this.edCourseId = this.courseTable.data[index].id;
    },
    //获取用户列表
    getCourseList() {
      var _this = this;
      let formData = new FormData();
      formData.append("currentPage", _this.courseTable.pageIndex);
      formData.append("pageSize", _this.courseTable.pageSize);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(this.NET.BASE_URL + "/api/course/lists", formData, config)
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg);
            _this.courseTable.data = res.data.data.lists;
            _this.courseTable.pageTotal = res.data.data.totalRows;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    delAllSelection() {
      warningDialog("确定要删1除吗？")
        .then(() => {
          const length = this.selectItemIds.length;
          let str = "";
          var select = new Array();
          for (let i = 0; i < length; i++) {
            str += this.selectItemIds[i].name + " ";
            select[i] = this.selectItemIds[i].id;
          }
          this.delSelectCourse(select);
          // this.$message.error(`删除了${str}`)
        })
        .catch(() => {});
    },
    delSelectCourse(ids) {
      var _this = this;
      let formData = new FormData();
      formData.append("ids", ids);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(
          this.NET.BASE_URL + "/api/course/batches_deletes",
          formData,
          config
        )
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success("删除成功");
            _this.getCourseList();
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    showAddUser() {
      this.adddialogVisible = true;
    },
    // 分页导航
    handlePageCurrpageChange(val) {
      this.$set(this, "courseTable.pageIndex", val);
      if (
        this.select.name == "" &&
        this.select.teacherSelId == -1 &&
        this.select.name == "" &&
        this.select.selStartPrice == "" &&
        this.select.selEndPrice == "" &&
        this.selec.statusSelId == -1
      ) {
        this.getCourseList();
      } else {
        this.selectCourseList();
      }
    },
    handlePageSizeChange(val) {
      this.courseTable.pageSize = val;
      if (
        this.select.name == "" &&
        this.select.teacherSelId == -1 &&
        this.select.name == "" &&
        this.select.selStartPrice == "" &&
        this.select.selEndPrice == "" &&
        this.select.statusSelId == -1
      ) {
        this.getCourseList();
      } else {
        this.selectCourseList();
      }
    },
    addCourse() {
      var _this = this;
      let config = {
        headers: {
          token: store.state.token
        }
      };
      let teacherLists = [];
      for (let i = 0; i < this.teachers.list.length; i++) {
        for (let j = 0; j < this.addteacherValue.length; j++) {
          if (this.teachers.list[i].id == this.addteacherValue[j]) {
            teacherLists.push(this.teachers.list[i]);
          }
        }
      }
      this.$axios
        .post(
          this.NET.BASE_URL + "/api/course/add",
          {
            name: _this.addName,
            bigImg: _this.addBigUrl,
            remark: _this.addRemark,
            price: _this.addPrice,
            teachers: teacherLists
          },
          config
        )
        .then(function(res) {
          if (res.data.code == 200) {
            _this.getCourseList();
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
      _this.adddialogVisible = false;
      _this.addName = "";
      _this.addBigUrl = "";
      _this.addPrice = "";
      _this.addteacherValue = [];
    }
  },
  created() {
    this.getCourseList(), this.handleGetTeacherList();
  }
};
</script>

<style scoped>
.red {
  color: #ff0000;
}

.inputText {
  position: relative;
  display: inline-block;
}

.radiusbg {
  border-radius: 2px;
  background-color: #ffffff;
  padding: 0px 10px 10px 10px;
}

.rightview {
  display: inline-block;
}
.table{
  margin-top: 10px;
  background: #ffffff;
}
</style>
