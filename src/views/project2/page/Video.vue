<template>
  <div>
    <div class="handle-box">
      <div class="t-sort">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10 t-sort-item"
          @click="delAllSelection"
        >批量删除</el-button>
        <div class="t-sort-item">
          <span>课程名：</span>
          <el-input style="width: 70%" placeholder="请输入内容" prefix-icon="el-icon-search" clearable></el-input>
        </div>
      </div>

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
        @click="refreshData()"
        circle
        class="refresh"
      ></el-button>
    </div>
    <el-table :data="video.data" style="width: 100%" @selection-change="handleSelectionChange">
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
      <el-table-column label="老师" align="center" width="250">
        <template slot-scope="scope">
          <div v-for="item in scope.row.teachers" v-bind:key="item">
            <span v-if="scope.row.teachers.length > 1">{{item.name}}</span>
            <span v-else>{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
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
  updateData
} from "@/api/video";
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
        selTeacherId: -1
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
        this.video.pageTotal = res.data.totalRows;
        this.video.data = res.data.lists;
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
    // 获取教师list
    handleGetTeacherList() {
      var params = {
        currentPage: this.teachers.currentPage,
        pageSize: this.teachers.pageSize
      };
      getTeacherList(params).then(res => {
        if (res.data.currentPage == 1) {
          this.add.selTeacherId = res.data.lists[0].id;
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
      var data = {
        name: this.add.vidoeName,
        bigImg: this.add.bigImg,
        remark: this.add.remark,
        videoUrl: this.add.videoUrl,
        teacher: teacherLists
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

      var params = {
        id: this.edit.id,
        name: this.edit.vidoeName,
        bigImg: this.edit.bigImg,
        videoUrl: this.edit.videoUrl,
        remark: this.edit.remark,
        teacher: _teacher
      };
      updateData(params).then(res => {
        this.getVideoData();
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
  /* margin-bottom: 20px; */
}
.add {
  position: fixed;
  /*align-self: flex-end;*/
  right: 80px;
}
.refresh {
  position: fixed;
  /*align-self: flex-end;*/
  right: 30px;
}
.t-sort{
  display: block;
  float: left;
  margin-left: 30px;
}
.t-sort-item{
  display: block;
}
</style>
