<template xmlns:>
  <div>
    <el-row class="radiusbg">
      <el-col :span="5">
        <div class="inputText">
          <span>课程名：</span>
          <el-input
            style="width: 70%"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="selName"
            clearable
          ></el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="inputText">
          状态：
          <el-select
            style="width: 70%"
            @change="selectStatus"
            clearable
            v-model="statusSelName"
            placeholder="请选择"
          >
            <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="inputText">
          价格：
          <el-input v-model="selStartPrice" style="width: 20%" placeholder></el-input>-
          <el-input v-model="selEndPrice" style="width: 20%" placeholder></el-input>
        </div>
      </el-col>

      <el-col :span="4">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="rightview"
          @click="delAllSelection"
        >批量删除</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-plus" @click="showAddUser" circle class="add"></el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          class="rightview"
          type="primary"
          icon="el-icon-search"
          @click="selectCourseList"
        >搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="getCourseList"
          circle
          class="refresh rightview"
        ></el-button>
      </el-col>
      <el-col :span="24" style="margin-top: 10px">
        <el-col :span="5">
          <div class="inputText">
            <span stype="float:right;">老师：</span>
            <el-select
              @change="selectTeacher"
              style="width: 70%"
              clearable
              　　　　　　v-model="teacherSelValue"
              　　　　　　placeholder="请选择"
              　　　　　　v-loadmore="loadMore"
            >
              <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5"></el-col>
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
      <el-table-column prop="name" label="课程名" align="center"></el-table-column>
      <el-table-column label="绑定老师" align="center" width="250">
        <template slot-scope="scope">
          <div v-for="item in scope.row.teachers">
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
        layout="sizes, prev, pager, next"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        :current-page="pageIndex"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
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
          　　　　　　v-loadmore="loadMore"
        >
          <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div style="width: 70%">
        状态：
        <el-select
          style="width: 70%"
          @change="edChagestatus"
          clearable
          v-model="statusSelName"
          placeholder="请选择"
        >
          <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item"></el-option>
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
          v-loadmore="loadMore"
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
  name: "course",
  data() {
    return {
      tableCourse: [],
      delList: [],
      selName: "",
      pageIndex: 1,
      pageSize: 5,
      teacherPageIndex: 1,
      pageTotal: 0,
      selName: "",
      teachers: [],
      selStartPrice: "",
      selEndPrice: "",
      teacherSelValue: "",
      teacherSelId: -1,
      statusSelName: "",
      statusSelId: -1,
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
    };
  },
  methods: {
    selectTeacher(selVal) {
      this.teacherSelId = selVal.id;
      this.teacherSelValue = selVal.name;
    },
    selectEdTeacher(selVal) {
      this.addteacherValue = selVal.name;
      this.addteacherId = selVal.id;
    },
    edChagestatus(selVal) {
      this.edChangeStatusValue = selVal.value;
    },
    selectStatus(selVal) {
      this.statusSelId = selVal.value;
    }, // 多选操作
    edSelectStatus(selVal) {
      this.edStatusSelId = selVal.value;
    },
    handleSelectionChange(val) {
      this.selectItemIds = val;
    },
    getTeacherList() {
      var _this = this;
      let formData = new FormData();
      formData.append("currentPage", _this.teacherPageIndex);
      formData.append("pageSize", 10);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(this.NET.BASE_URL + "/teacher/pagelists", formData, config)
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg);
            if (res.data.data.pageNum == 1) {
              _this.teachers = res.data.data.lists;
            } else {
              if (res.data.data.lists.length != 0) {
                _this.teachers.push(res.data.data.lists);
              }
            }
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    editCourse() {
      this.editVisible = false;
      // this.$set(this.query.tableData, this.idx, this.form)
      var _this = this;
      let config = {
        headers: {
          token: store.state.token
        }
      };

      let teacherLists = [];
      for (let i = 0; i < this.teachers.length; i++) {
        for (let j = 0; j < this.edteacherValue.length; j++) {
          if (this.teachers[i].id == this.edteacherValue[j]) {
            teacherLists.push(this.teachers[i]);
          }
        }
      }

      let formData = new FormData();
      formData.append("id", _this.edCourseId);
      formData.append("name", _this.edName);
      // formData.append("bigImg", _this.edBigUrl);
      // formData.append("remark", _this.edRemark);
      // formData.append("price", _this.edPrice);
      // formData.append("teachers", _this.teacherLists);

      this.$axios
        .post(
          this.NET.BASE_URL + "/course/update",
          formData,
          //  {
          //     id: _this.edCourseId,
          //     name: _this.edName,
          //     bingImg: _this.edBigUrl,
          //     remark: _this.edRemark,
          //     price: _this.edPrice,
          //     status:_this.edChangeStatusValue,
          //     teachers: teacherLists
          //   }
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
    },
    selectCourseList() {
      var _this = this;
      let formData = new FormData();
      // if (_this.teacherSelId != "" || _this.teacherSelId != undefined) {
      if (
        typeof _this.teacherSelId != "undefined" &&
        _this.teacherSelId != ""
      ) {
        formData.append("teacherId", _this.teacherSelId);
      }
      formData.append("currentPage", _this.pageIndex);
      formData.append("pageSize", _this.pageSize);
      if (_this.selName != "") {
        formData.append("name", _this.selName);
      }
      if (_this.selStartPrice != "") {
        formData.append("startPrice", _this.selStartPrice);
      }
      if (_this.selEndPrice != "") {
        formData.append("endPrice", _this.selEndPrice);
      }
      if (_this.statusSelId != -1) {
        formData.append("status", _this.statusSelId);
      }
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(
          this.NET.BASE_URL + "/course/sel_by_name_or_status_price_teacher",
          formData,
          config
        )
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg);
            _this.tableCourse = res.data.data.lists;
            _this.pageTotal = res.data.data.totalRows;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        //删除操作
        this.delCourse(index);
      });
    },
    //删除课程
    delCourse(index) {
      var _this = this;
      let formData = new FormData();
      formData.append("id", this.tableCourse[index].id);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(this.NET.BASE_URL + "/course/delect", formData, config)
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
    handleEdit(index, row) {
      this.editVisible = true;
      this.edCourseId = this.tableCourse[index].id;
    },
    //获取用户列表
    getCourseList() {
      var _this = this;
      let formData = new FormData();
      formData.append("currentPage", _this.pageIndex);
      formData.append("pageSize", _this.pageSize);
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: store.state.token
        }
      };
      this.$axios
        .post(this.NET.BASE_URL + "/course/lists", formData, config)
        .then(function(res) {
          if (res.data.code == 200) {
            _this.$message.success(res.data.msg);
            _this.tableCourse = res.data.data.lists;
            _this.pageTotal = res.data.data.totalRows;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          _this.$message.error(err.data);
        });
    },
    delAllSelection() {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          const length = this.selectItemIds.length;
          let str = "";
          this.delList = this.delList.concat(this.selectItemIds);
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
        .post(this.NET.BASE_URL + "/course/batches_deletes", formData, config)
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
    handlePageChange(val) {
      this.$set(this, "pageIndex", val);
      if (
        this.selName == "" &&
        this.teacherSelId == -1 &&
        this.selName == "" &&
        this.selStartPrice == "" &&
        this.selEndPrice == "" &&
        this.statusSelId == -1
      ) {
        this.getCourseList();
      } else {
        this.selectCourseList();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (
        this.selName == "" &&
        this.teacherSelId == -1 &&
        this.selName == "" &&
        this.selStartPrice == "" &&
        this.selEndPrice == "" &&
        this.statusSelId == -1
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
      for (let i = 0; i < this.teachers.length; i++) {
        for (let j = 0; j < this.addteacherValue.length; j++) {
          if (this.teachers[i].id == this.addteacherValue[j]) {
            teacherLists.push(this.teachers[i]);
          }
        }
      }
      this.$axios
        .post(
          this.NET.BASE_URL + "/course/add",
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
    this.getCourseList(), this.getTeacherList();
  }
};
</script>

<style scoped>
.red {
  color: #ff0000;
}

.inputText {
  position: relative;
  text-align: right;
}

.radiusbg {
  margin-bottom: 10px;
  border-radius: 2px;
  background-color: #ffffff;
  padding: 10px 10px 10px 10px;
}

.rightview {
  float: right;
}
</style>
