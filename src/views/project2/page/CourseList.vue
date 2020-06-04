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
          <el-select style="width: 70%" clearable v-model="select.statusSelId" placeholder="请选择">
            <el-option
              v-for="item in select.status"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="inputText" style="width: 30%;">
          价格：
          <el-input
            v-model="select.selStartPrice"
            style="width: 20%;display:inline-block;"
            placeholder
          ></el-input>
          <span>-</span>
          <el-input
            v-model="select.selEndPrice"
            style="width: 20%;display:inline-block"
            placeholder
          ></el-input>
        </div>
      </el-col>
      <el-col :span="6" style="text-align: right;">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addDialog.adddialogVisible = true"
          circle
          class="rightview"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="getCourseData"
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
            style="width: 70%"
            clearable
            　　　　　　v-model="select.teacherSelId"
            　　　　　　placeholder="请选择"
            　　　　　　v-loadmore="loadMoreTeacherListData"
          >
            <el-option
              v-for="item in teachers.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="courseTable.data"
      border
      class="table"
      ref="multipleSelection"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" width="85" align="center"></el-table-column>
      <el-table-column prop="name" label="课程名" align="center"></el-table-column>
      <el-table-column label="绑定老师" align="center" width="250">
        <template slot-scope="scope">
          <div v-for="item in scope.row.teachers" v-bind:key="item">
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
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleItemEdit(scope.$index, scope.row)"
          >编辑</el-button>
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
        :page-size="courseTable.pageSize"
        :current-page="courseTable.pageIndex"
        :total="courseTable.pageTotal"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrpageChange"
      ></el-pagination>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="eddDialog.editVisible" width="30%">
      <div style="width: 70%">
        <span>课程名：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="eddDialog.edName"></el-input>
      </div>
      <div style="with:70%">
        <span stype="float:right;">老师：</span>
        <el-select
          style="width: 70%"
          multiple
          collapse-tags
          clearable
          v-model="eddDialog.edteacherValue"
          placeholder="请选择"
          v-loadmore="loadMoreTeacherListData"
        >
          <el-option
            v-for="item in teachers.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div style="width: 70%">
        状态：
        <el-select style="width: 70%" clearable v-model="eddDialog.edStatusSelId" placeholder="请选择">
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
        <el-input style="width: 70%" placeholder="0为免费" v-model="eddDialog.edPrice"></el-input>
      </div>
      <div>
        <span>备注：</span>
        <el-input style="width: 70%" placeholder="备注" v-model="eddDialog.edRemark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eddDialog.editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!--   添加课程  -->
    <el-dialog title="添加课程" :visible.sync="addDialog.adddialogVisible" width="50%">
      <div style="width: 70%">
        <span>课程名：</span>
        <el-input style="width: 70%" placeholder="请输入内容" v-model="addDialog.addName"></el-input>
      </div>
      <div style="with:70%">
        <span stype="float:right;">老师：</span>
        <el-select
          style="width: 70%"
          multiple
          collapse-tags
          v-model="addDialog.addteacherValue"
          placeholder="请选择"
          v-loadmore="loadMoreTeacherListData"
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
        <el-input style="width: 70%" placeholder="请输入内容" v-model="addDialog.addBigUrl"></el-input>
      </div>
      <div>
        <span>价格：</span>
        <el-input style="width: 70%" placeholder="0和不填为免费" v-model="addDialog.addPrice"></el-input>
      </div>
      <div>
        <span>备注：</span>
        <el-input style="width: 70%" placeholder="备注" v-model="addDialog.addRemark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog.adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { warningDialog } from "@/utils/dialog";
import {
  getTeacherList,
  courseUpdate,
  selectCourse,
  delCourse,
  getCourseList,
  delMoreCourse,
  addCourse
} from "@/api/api";
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
        teacherSelId: "",
        statusSelId: "",
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
      teachers: {
        list: [],
        currentPage: 1,
        pageSize: 10
      },
      addDialog: {
        adddialogVisible: false,
        // 添加课程
        addName: "",
        addteacherValue: [],
        addteacherId: "",
        addBigUrl: "",
        addPrice: "",
        addRemark: "",
        selectItemIds: []
      },
      //编辑
      eddDialog: {
        edCourseId: -1,
        editVisible: false,
        edName: "",
        edteacherValue: [],
        edPrice: "",
        edRemark: "",
        edStatusSelId: ""
      }
    };
  },
  methods: {
    loadMoreTeacherListData() {
      this.teachers.currentPage++;
      this.handleGetTeacherList();
    },
    handleGetTeacherList() {
      var params = {
        currentPage: this.teachers.currentPage,
        pageSize: this.teachers.pageSize
      };
      getTeacherList(params).then(res => {
        if (res.data.currentPage == 1) {
          this.teachers.list = res.data.lists;
        } else {
          this.teachers.list = this.teachers.list.concat(res.data.lists);
        }
      });
    },
    editCourse() {
      this.eddDialog.editVisible = false;
      var teacherLists = [];
      for (let i = 0; i < this.teachers.list.length; i++) {
        for (let j = 0; j < this.eddDialog.edteacherValue.length; j++) {
          if (this.teachers.list[i].id == this.eddDialog.edteacherValue[j]) {
            teacherLists.push(this.teachers.list[i]);
          }
        }
      }
      var params = {
        id: this.eddDialog.edCourseId,
        name: this.eddDialog.edName,
        remark: this.eddDialog.edRemark,
        price: this.eddDialog.edPrice,
        status: this.eddDialog.edStatusSelId,
        teachers: _teacherLists
      };
      courseUpdate(params).then(res => {
        this.getCourseData();
      });
    },
    selectCourseList() {
      var data = {
        teacherId: this.select.teacherSelId,
        currentPage: this.courseTable.pageIndex,
        pageSize: this.courseTable.pageSize,
        name: this.select.name,
        startPrice: this.select.selStartPrice,
        endPrice: this.select.selEndPrice,
        status: this.select.statusSelId
      };
      selectCourse(data).then(res => {
        this.courseTable.data = res.data.lists;
        this.courseTable.pageTotal = res.data.totalRows;
      });
    },
    handleItemDelete(index, row) {
      warningDialog("确定要删除吗？").then(() => {
        //删除操作
        this.delCourse(index);
      });
    },
    //删除课程
    delCourse(index) {
      delCourse(this.courseTable.data[index].id).then(res => {
        this.getCourseData();
      });
    },
    handleItemEdit(index, row) {
      this.eddDialog.editVisible = true;
      this.eddDialog.edCourseId = this.courseTable.data[index].id;
    },
    //获取用户列表
    getCourseData() {
      var params = {
        currentPage: this.courseTable.pageIndex,
        pageSize: this.courseTable.pageSize
      };
      getCourseList(params).then(res => {
        this.courseTable.data = res.data.lists;
        this.courseTable.pageTotal = res.data.totalRows;
      });
    },
    delAllSelection() {
      var _this = this;
      warningDialog("确定要删除吗？").then(() => {
        _this.delSelectCourse();
      });
    },
    delSelectCourse() {
      var idsStr = "";
      for (let i = 0; i < this.addDialog.selectItemIds.length; i++) {
        if(i == 0){
        idsStr = this.addDialog.selectItemIds[i].id+""
        }else{
          idsStr += ","+this.addDialog.selectItemIds[i].id
        }
      }

      var data = {
        ids:idsStr
      }
      
      console.log(data);
      
      delMoreCourse(data).then(res => {
        this.getCourseData();
      });
    },

    handleSelectionChange(val) {
      this.addDialog.selectItemIds = val;
    },

    handlePageCurrpageChange(val) {
      this.courseTable.pageIndex = val
      console.log(this.select.name);
      console.log(this.select.teacherSelId);
      console.log(this.select.selStartPrice);
      console.log(this.select.selEndPrice);
      console.log(this.select.statusSelId);
      console.log(this.select.teacherSelId);
      
      if (
        this.select.name&&
        this.select.teacherSelId&&
        this.select.selStartPrice&&
        this.select.selEndPrice&&this.selec.statusSelId
      ) {
        this.selectCourseList();
        } else {
        this.getCourseData();
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
        this.getCourseData();
      } else {
        this.selectCourseList();
      }
    },

    handleAddCourse() {
      var _this = this;
      this.addDialog.adddialogVisible = false;
      
      let teacherLists = [];
      for (let i = 0; i < this.teachers.list.length; i++) {
        for (let j = 0; j < this.addDialog.addteacherValue.length; j++) {
          if (this.teachers.list[i].id == this.addDialog.addteacherValue[j]) {
            teacherLists.push(this.teachers.list[i]);
          }
        }
      }
          var data = {
            name: this.addDialog.addName,
            bigImg: this.addDialog.addBigUrl,
            remark: this.addDialog.addRemark,
            price: this.addDialog.addPrice,
            teachers: teacherLists
          }

        addCourse(data).then(res =>{
            _this.getCourseData()
        })

      this.addDialog.addName = "";
      this.addDialog.addBigUrl = "";
      this.addDialog.addPrice = "";
      this.addDialog.addteacherValue = [];
    }
  },
  mounted() {
    this.getCourseData(), this.handleGetTeacherList();
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
.table {
  margin-top: 10px;
  background: #ffffff;
}
</style>