<template>
  <div class="handle-box container">
    <div class="handle-line">
      <div class="t-left">
        <el-button
          style="width: 15%"
          type="primary"
          icon="el-icon-delete"
          @click="delAllSelection"
        >批量删除</el-button>
        <span style="margin-left:10px">课程名：</span>
        <el-input
          style="width: 18%"
          v-model="select.name"
          placeholder="搜索的视频名称"
          prefix-icon="el-icon-search"
          clearable
        ></el-input>
        <span style="margin-left:10px">老师：</span>
        <el-select
          style="width: 13%"
          v-model="select.teacherId"
          placeholder="搜索的老师"
          v-loadmore="loadMoreTeacherListData"
        >
          <el-option
            style="width:100%"
            v-for="item in teachers.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span style="margin-left:10px">课程：</span>
        <el-select
          style="width: 13%"
          multiple
          v-model="select.coursesIds"
          placeholder="搜索的课程"
          v-loadmore="loadMoreCourseListData"
        >
          <el-option
            v-for="item in courses.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="selectVideoCriteria"
          style="margin-left:10px;width: 10%"
          icon="el-icon-search"
        >搜索</el-button>
      </div>
      <div class="t-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add.dialogVisiable = true"
          circle
          class="add"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="refreshData"
          circle
          class="refresh"
        ></el-button>
      </div>
    </div>

    <div class="table-content">
      <el-table :data="video.data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="id" width="180"></el-table-column>
        <el-table-column prop="name" label="视频名称" width="180"></el-table-column>
        <el-table-column label="封面" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.bigImg"
              :preview-src-list="[scope.row.coverImg]"
            ></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column label="老师" align="center" width="250">
          <template slot-scope="scope">
              <span v-if="scope.row.teacher.length > 1">{{scope.row.teacher.name}}</span>
              <span v-else>空</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="videoUrl" label="链接"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">{{ toTime( scope.row.createTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.lastUpdateTime !== null">{{ toTime( scope.row.lastUpdateTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleItemEdit(scope.row)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="video.currentPage"
          :page-size="video.pageSize"
          :total="video.pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加新视频的dialog -->
    <div>
      <el-dialog title="添加" :visible.sync="add.dialogVisiable" width="30%">
        <el-form ref="form" label-width="70px">
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频名称：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="add.vidoeName"
              ></el-input>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频封面：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="add.bigImg"
              ></el-input>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频链接：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="add.videoUrl"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span style="line-height:50px">老师：</span>
            </el-col>
            <el-col :span="20">
              <el-select
                style="height:50px;line-height:50px;width:100%"
                collapse-tags
                v-model="add.selTeacherId"
                placeholder="请选择"
                v-loadmore="loadMoreTeacherListData"
              >
                <el-option
                  v-for="item in teachers.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span style="line-height:50px">课程：</span>
            </el-col>
            <el-col :span="20">
              <el-select
                style="height:50px;line-height:50px;width:100%"
                collapse-tags
                multiple
                v-model="add.coursesIds"
                placeholder="请选择"
                v-loadmore="loadMoreTeacherListData"
              >
                <el-option
                  v-for="item in courses.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频备注：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="add.remark"
              ></el-input>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add.dialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="handleAddVideo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑视频的dialog -->
    <div>
      <el-dialog title="编辑" :visible.sync="edit.dialogVisiable" width="30%">
        <el-form ref="form" label-width="70px">
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频名称：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="edit.vidoeName"
              ></el-input>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频封面：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="edit.bigImg"
              ></el-input>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频链接：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="edit.videoUrl"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span style="line-height:50px">老师：</span>
            </el-col>
            <el-col :span="20">
              <el-select
                style="height:50px;line-height:50px;width:100%"
                collapse-tags
                v-model="edit.selTeacherId"
                placeholder="请选择"
                v-loadmore="loadMoreTeacherListData"
              >
                <el-option
                  v-for="item in teachers.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span style="line-height:50px">课程：</span>
            </el-col>
            <el-col :span="20">
              <el-select
                style="height:50px;line-height:50px;width:100%"
                collapse-tags
                v-model="add.coursesIds"
                placeholder="请选择"
                multiple
                v-loadmore="loadMoreTeacherListData"
              >
                <el-option
                  v-for="item in courses.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="editUserItem" style="margin-top: 50px">
            <el-col :span="5" class="editUserItemLeft">
              <span>视频备注：</span>
            </el-col>
            <el-col :span="19">
              <el-input
                style="height:50px;line-height:50px"
                placeholder="请输入内容"
                v-model="edit.remark"
              ></el-input>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit.dialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="handleEditVideo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getVideoList,
  addData,
  delOne,
  delMore,
  updateData,
  searchByCriteria
} from "@/api/video";
import { getCourseList } from "@/api/api";
import { timestampToTime } from "@/utils/timeUtils";
import { getTeacherList } from "@/api/teacher";
import { warningDialog } from "@/utils/dialog";

export default {
  name: "Video",
  data() {
    return {
      video: {
        data: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        multipleSelection: []
      },
      add: {
        dialogVisiable: false,
        vidoeName: "",
        bigImg: "",
        remark: "",
        videoUrl: "",
        // 添加视频选择的老师id
        selTeacherId: "",
        coursesIds: []
      },
      teachers: {
        data: [],
        currentPage: 1,
        pageSize: 10
      },
      edit: {
        id: -1,
        dialogVisiable: false,
        vidoeName: "",
        bigImg: "",
        remark: "",
        videoUrl: "",
        // 视频的老师id
        selTeacherId: -1
      },
      courses: {
        data: [],
        currentPage: 1,
        pageSize: 10
      },
      select: {
        teacherId: null,
        coursesIds: [],
        currentPage: 1,
        pageSize: 10,
        name: ""
      }
    };
  },
  methods: {
    // 获取视频lists
    getVideoData() {
      var data = {
        currentPage: this.video.currentPage,
        pageSize: this.video.pageSize
      };
      getVideoList(data).then(res => {
        this.video.data = res.data.lists;
      });
    },
    getCourseList() {
      var data = {
        currentPage: this.courses.currentPage,
        pageSize: this.courses.pageSize
      };
      getCourseList(data).then(res => {
        if (res.data.currentPage == 1) {
          this.courses.data = res.data.lists;
        } else {
          this.courses.data = this.courses.data.concat(res.data.lists);
        }
      });
    },
    // 转换时间
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    },
    // 教师lists的下拉刷新
    loadMoreTeacherListData() {
      this.teachers.currentPage++;
      this.handleGetTeacherList();
    },
    // 教师lists的下拉刷新
    loadMoreCourseListData() {
      this.courses.currentPage++;
      this.getCourseList();
    },
    // 获取教师list
    handleGetTeacherList() {
      var params = {
        currentPage: this.teachers.currentPage,
        pageSize: this.teachers.pageSize
      };
      getTeacherList(params).then(res => {
        if (res.data.currentPage == 1) {
          this.teachers.data = res.data.lists;
        } else {
          this.teachers.data = this.teachers.data.concat(res.data.lists);
        }
      });
    },
    // 刷新
    refreshData() {
      this.getVideoData();
      this.handleGetTeacherList();
      this.getCourseList();
    },
    // 添加视频
    handleAddVideo() {
      this.add.dialogVisiable = false;
      let teacherLists;
      for (let i = 0; i < this.teachers.data.length; i++) {
        if (this.teachers.data[i].id == this.add.selTeacherId) {
          teacherLists = this.teachers.data[i];
        }
      }
      let courseList = [];
      for (let i = 0; i < this.courses.data.length; i++) {
        for (let j = 0; j < this.add.coursesIds.length; j++) {
          if(this.courses.data[i].id == this.add.coursesIds[j]){
              courseList.push(this.courses.data[i])
          }
        }
      }
      var data = {
        name: this.add.vidoeName,
        bigImg: this.add.bigImg,
        remark: this.add.remark,
        videoUrl: this.add.videoUrl,
        teacher: teacherLists,
        courses: courseList
      };
      addData(data).then(res => {
        this.refreshData();
      });
    },
    // 分页导航
    handlePageChange(pageIndex) {
      this.video.currentPage = pageIndex;
      this.getVideoData();
    },
    delOneVideo(row) {
      var params = {
        id: row.id
      };
      delOne(params).then(res => {
        this.getVideoData();
      });
    },
    // 删除操作
    handleDelete(row) {
      warningDialog("确定要删除吗？").then(() => {
        //删除操作
        this.delOneVideo(row);
      });
    },
    // 多选操作
    handleSelectionChange(sels) {
      this.video.multipleSelection = sels;
    },
    // 是否删除所选
    delAllSelection() {
      warningDialog("确定要删除吗？").then(() => {
        var select = "";
        for (let i = 0; i < this.video.multipleSelection.length; i++) {
          if (i == 0) {
            select += this.video.multipleSelection[i].id;
          } else {
            select += "," + this.video.multipleSelection[i].id;
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
        this.getVideoData();
      });
    },
    handleItemEdit(row) {
      this.edit.id = row.id;
      this.edit.vidoeName = row.name;
      this.edit.bigImg = row.bigImg;
      this.edit.vidoeUrl = row.videoUrl;
      this.edit.remark = row.remark;
      if (row.teacher) {
        this.edit.selTeacherId = row.teacher.id;
      }
      this.edit.dialogVisiable = true;
    },
    handleEditVideo() {
      this.edit.dialogVisiable = false;
      let _teacher;
      for (let i = 0; i < this.teachers.data.length; i++) {
        if (this.teachers.data[i].id == this.edit.selTeacherId) {
          _teacher = this.teachers.data[i];
        }
      }
      let courseList = [];
      for (let i = 0; i < this.courses.data.length; i++) {
        for (let j = 0; j < this.add.coursesIds.length; j++) {
          if(this.courses.data[i].id == this.add.coursesIds[j]){
              courseList.push(this.courses.data[i])
          }
        }
      }
      var params = {
        id: this.edit.id,
        name: this.edit.vidoeName,
        bigImg: this.edit.bigImg,
        videoUrl: this.edit.videoUrl,
        remark: this.edit.remark,
        teacher: _teacher,
        courses: courseList
      };
      updateData(params).then(res => {
        this.getVideoData();
      });
    },
    selectVideoCriteria() {
      var data = {
        currentPage: this.select.currentPage,
        pageSize: this.select.pageSize,
        teacherId: this.select.teacherId,
        courseIds: null,
        name:null
      };
      for (let i = 0; i < this.select.coursesIds.length; i++) {
        if (i == 0) {
          data.courseIds += this.select.coursesIds[i];
        } else {
          data.courseIds += "," + this.select.coursesIds[i];
        }
      }
      if(this.select.name){
        data.name = encodeURIComponent(this.select.name)
      }
       searchByCriteria(data).then(res => {
        this.video.data = res.data.lists;
      });
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.handle-box {
}
.handle-line {
  margin-bottom: 20px;
}
.add {
  right: 80px;
}
.refresh {
  right: 30px;
}
.t-left {
  display: inline-block;
  width: 90%;
}
.t-left-item {
  display: block;
}
.t-right {
  display: inline-block;
  width: 10%;
}
.t-right-item {
  display: block;
}
.table-content {
  display: inline-block;
  width: 100%;
}
</style>
