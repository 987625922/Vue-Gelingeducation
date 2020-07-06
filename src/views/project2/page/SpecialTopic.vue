<template>
  <div class="container">
    <div class="hander"></div>
    <div class="content">
      <el-table border :data="subject.data">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="id" width="180"></el-table-column>
        <el-table-column prop="name" label="专题名称" width="180"></el-table-column>
        <el-table-column prop="price" label="专题售价" width="180"></el-table-column>
        <el-table-column prop="introction" label="专题简介" width="180"></el-table-column>
        <el-table-column label="专题封面" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.bigImg"
              :preview-src-list="[scope.row.coverImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="专题备注" width="180"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">{{ toTime( scope.row.createTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addDialog"></div>
    <div class="editDialog"></div>
  </div>
</template>

<script>
import { getSubjectList } from "@/api/subject";
import { timestampToTime } from "@/utils/timeUtils";

export default {
  name: "SpecialTopic",
  data() {
    return {
      subject: {
        data: []
      },
      table: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    getSubjectData() {
      var data = {
        currentPage: this.table.currentPage,
        pageSize: this.table.pageSize
      };
      getSubjectList(data).then(res => {
        this.subject.data = res.data.lists;
      });
    },
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    }
  },
  mounted() {
    this.getSubjectData();
  }
};
</script>

<style scoped>
.content{
  padding: 0 0;
}
</style>
