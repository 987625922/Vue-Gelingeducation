<template>
  <el-table :data="video.data" style="width: 100%">
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
    <el-table-column prop="videoUrl" label="链接"></el-table-column>
     <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !== null">{{ toTime( scope.row.createTime) }}</div>
            <div v-else>空</div>
          </template>
        </el-table-column>
  </el-table>
</template>

<script>
import { getVideoList } from "@/api/video";
import { timestampToTime } from "@/utils/timeUtils";

export default {
  name: "Video",
  data() {
    return {
      video: {
        data: []
      },
      table: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    getVideoData() {
      var data = {
        currentPage: this.table.currentPage,
        pageSize: this.table.pageSize
      };
      getVideoList(data).then(res => {
          this.video.data = res.data.lists
      });
    },
    toTime(timeStr) {
      return timestampToTime(parseInt(timeStr));
    }
  },
  mounted(){
      this.getVideoData()
  }
};
</script>

<style scoped>
</style>
