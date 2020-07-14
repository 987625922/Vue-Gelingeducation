<template>
  <div class="container">
    <div class="s-header">
      <div class="t-left">
        <el-button
          class="t-left-button"
          type="primary"
          icon="el-icon-delete"
          @click="delAllSelection"
        >批量删除</el-button>
        <span class="t-left-item">专题名：</span>
        <el-input
          style="width: 18%"
          v-model="select.name"
          placeholder="搜索的专题名称"
          prefix-icon="el-icon-search"
          clearable
          class="t-left-item"
        ></el-input>
        <span class="t-left-item">课程：</span>
        <el-select
          clearable
          multiple
          v-model="select.courseIds"
          placeholder="请选择"
          v-loadmore="loadMoreCourseListData"
        >
          <el-option v-for="item in course.data" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="selectCriteria"
          style="margin-left:10px;width: 10%"
          icon="el-icon-search"
          class="t-left-item"
        >搜索</el-button>
      </div>
      <div class="t-right">
        <el-button
          type="primary"
          class="t-right-item"
          icon="el-icon-refresh"
          @click="refresh"
          circle
        ></el-button>
        <el-button
          type="primary"
          @click="dataAdd.dialogVisiable = true"
          class="t-right-item"
          icon="el-icon-plus"
          circle
        ></el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="subject.data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" align="center" label="id" width="50"></el-table-column>
        <el-table-column prop="name" label="专题名称" align="center" width="150"></el-table-column>
        <el-table-column prop="price" label="专题售价" align="center" width="100"></el-table-column>
        <el-table-column prop="introduction" label="专题简介" align="center" width="180"></el-table-column>
        <el-table-column label="专题封面" align="center" width="180">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.bigImg"
              :preview-src-list="[scope.row.coverImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="专题备注" align="center" width="180"></el-table-column>
        <el-table-column label="创建时间" align="center" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">{{ toTime( scope.row.createTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red-button"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="table.pageSize"
          :current-page="table.currentPage"
          :total="table.totalRows"
          @current-change="handlePageCurrpageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- ================================  -->
    <div class="addDialog">
      <el-dialog title="添加专题" :visible.sync="dataAdd.dialogVisiable" width="50%">
        <el-form :label-position="dataAdd.labelPosition" label-width="80px">
          <el-form-item label="专题名称">
            <el-input v-model="dataAdd.name"></el-input>
          </el-form-item>
          <el-form-item label="专题售价">
            <el-input v-model="dataAdd.price"></el-input>
          </el-form-item>
          <el-form-item label="专题简介">
            <el-input v-model="dataAdd.introduction"></el-input>
          </el-form-item>
          <el-form-item label="专题包含的课程">
            <el-select
              clearable
              multiple
              v-model="dataAdd.courseIds"
              placeholder="请选择"
              v-loadmore="loadMoreCourseListData"
            >
              <el-option
                v-for="item in course.data"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专题备注">
            <el-input v-model="dataAdd.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataAddCreate">创建</el-button>
            <el-button @click="dataAdd.dialogVisiable = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="editDialog">
      <el-dialog title="编辑专题" :visible.sync="dataEdit.dialogVisiable" width="50%">
        <el-form :label-position="dataEdit.labelPosition" label-width="80px">
          <el-form-item label="专题名称">
            <el-input v-model="dataEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="专题售价">
            <el-input v-model="dataEdit.price"></el-input>
          </el-form-item>
          <el-form-item label="专题简介">
            <el-input v-model="dataEdit.introduction"></el-input>
          </el-form-item>
          <el-form-item label="专题包含的课程">
            <el-select
              clearable
              multiple
              v-model="dataEdit.courseIds"
              placeholder="请选择"
              v-loadmore="loadMoreCourseListData"
            >
              <el-option
                v-for="item in course.data"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专题备注">
            <el-input v-model="dataEdit.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDataEdit">更新</el-button>
            <el-button @click="dataEdit.dialogVisiable = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getSubjectList,
  addsubject,
  updateSubject,
  delMoreSubject,
  delSubject,
  searchCriteria
} from "@/api/subject";
import { getCourseListBySubjectId,getCourseList } from "@/api/courseApi";
import { timestampToTime } from "@/utils/timeUtils";
import { warningDialog } from "@/utils/dialog";

export default {
  name: "SpecialTopic",
  data() {
    return {
      subject: {
        data: [],
        multipleSelection: []
      },
      course: {
        data: [],
        currentPage: 1,
        pageSize: 10
      },
      table: {
        currentPage: 1,
        pageSize: 5,
        totalRows: 0
      },
      select: {
        courseIds: [],
        name: ""
      },
      dataAdd: {
        labelPosition: "left",
        name: "",
        dialogVisiable: false,
        price: "",
        introduction: "",
        bingImg: "",
        remark: "",
        courseIds: []
      },
      dataEdit: {
        id: -1,
        labelPosition: "left",
        name: "",
        dialogVisiable: false,
        price: "",
        introduction: "",
        bingImg: "",
        remark: "",
        courseIds: []
      }
    };
  },
  methods: {
    //获取专题
    getSubjectData() {
      var data = {
        currentPage: this.table.currentPage,
        pageSize: this.table.pageSize
      };
      getSubjectList(data).then(res => {
        this.subject.data = res.data.lists;
        this.table.totalRows = res.data.totalRows;
      });
    },
    //获取课程
    getCourseData() {
      var params = {
        currentPage: this.course.currentPage,
        pageSize: this.course.pageSize
      };
      getCourseList(params).then(res => {
        this.course.data = res.data.lists;
      });
    },
    // 加载更多的课程
    loadMoreCourseListData() {},
    // table选择改变
    handleSelectionChange(sels) {
      this.subject.multipleSelection = sels;
    }, // 分页导航
    handlePageCurrpageChange(pageIndex) {
      this.table.currentPage = pageIndex;
      this.getSubjectData();
    },
    delAllSelection() {
      warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.subject.multipleSelection.length; i++) {
          if (i == 0) {
            select += this.subject.multipleSelection[i].id;
          } else {
            select += "," + this.subject.multipleSelection[i].id;
          }
        }
        this._delAllSelection(select);
      });
    },
    // 批量删除
    _delAllSelection(_ids) {
      var params = {
        ids: _ids
      };
      delMoreSubject(params).then(res => {
        this.getSubjectData();
      });
    },
    showEditDialog(row) {
      var params = {
        subjectId: row.id
      };
      this.dataEdit.courseIds = [];
      getCourseListBySubjectId(params).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.dataEdit.courseIds.push(res.data[i].id);
          console.log(this.dataEdit.courseIds);
        }
        this.dataEdit.id = row.id;
        this.dataEdit.name = row.name;
        this.dataEdit.price = row.price;
        this.dataEdit.introduction = row.introduction;
        this.dataEdit.remark = row.remark;
        this.dataEdit.bingImg = row.bingImg;
        this.dataEdit.dialogVisiable = true;
      });
    },
    //修改专题
    handleDataEdit() {
      var params = {
        id: this.dataEdit.id,
        name: this.dataEdit.name,
        bingImg: this.dataEdit.bingImg,
        remark: this.dataEdit.remark,
        price: this.dataEdit.price,
        introduction: this.dataEdit.introduction,
        courses: []
      };
      for (let i = 0; i < this.dataEdit.courseIds.length; i++) {
        for (let j = 0; j < this.course.data.length; j++) {
          if (this.course.data[j].id == this.dataEdit.courseIds[i]) {
            params.courses.push(this.course.data[j]);
          }
        }
      }
      updateSubject(params).then(res => {
        this.dataEdit.dialogVisiable = false;
        this.getSubjectData();
      });
    },
    // 删除专题item
    handleDelete(row) {
      var params = {
        id: row.id
      };
      delSubject(params).then(res => {
        this.getSubjectData();
      });
    },
    //刷新
    refresh() {
      this.getSubjectData();
      this.getCourseData();
    },
    // 条件搜索
    selectCriteria() {
      var params = {
        name: this.select.name,
        courseIds: null,
        currentPage: 1,
        pageSize: 5
      };
      var _courseIds = "";
      for (let i = 0; i < this.select.courseIds.length; i++) {
        if (i == 0) {
          _courseIds += this.select.courseIds[i];
        } else {
          _courseIds += "," + this.select.courseIds[i];
        }
      }
      params.courseIds = _courseIds;
      searchCriteria(params).then(res => {
        this.subject.data = res.data.lists;
      });
    },
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    },
    //添加专题
    dataAddCreate() {
      var params = {
        name: this.dataAdd.name,
        bingImg: this.dataAdd.bingImg,
        remark: this.dataAdd.remark,
        price: this.dataAdd.price,
        introduction: this.dataAdd.introduction,
        courses: null
      };
      var _courseArray = [];
      for (let i = 0; i < this.dataAdd.courseIds.length; i++) {
        for (let j = 0; j < this.course.data.length; j++) {
          if (this.dataAdd.courseIds[i] == this.course.data[j].id)
            _courseArray.push(this.course.data[j]);
        }
      }
      params.courses = _courseArray;
      addsubject(params).then(res => {
        this.dataAdd.dialogVisiable = false;
        this.getSubjectData();
      });
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style scoped>
.content {
  padding: 0 0;
}
.s-header {
  margin-bottom: 10px;
}
.t-left {
  display: inline-block;
  width: 80%;
}
.t-left-item {
  margin-left: 10px;
}
.t-right {
  display: inline-block;
  width: 20%;
}
.t-right-item {
  float: right;
  display: inline-block;
  margin-left: 10px;
}
.t-left-button {
  display: inline-block;
  width: 15%;
}
.red-button {
  color: red;
}
</style>
