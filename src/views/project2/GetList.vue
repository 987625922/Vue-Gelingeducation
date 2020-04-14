<template>
  <div>
    {{getList()}}
    <el-table
      :data="lists"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="coverImg"
        label="图片地址">
      </el-table-column>
    </el-table>
  </div>
  <!--  <div>-->
  <!--    <button type="button" @click="getList()">获取列表</button>-->
  <!--    <ul>-->
  <!--      <li v-for="(item,index) in lists"-->
  <!--          :key="index"-->
  <!--      >-->
  <!--        {{item.id}}-{{item.title}}-->
  <!--      </li>-->
  <!--    </ul>-->
  <!--  </div>-->
</template>

<script>
  export default {
    name: 'GetList',
    data () {
      return {
        lists: []
      }
    },
    methods: {
      getList () {
        this.$axios
          .get('http://122.51.177.223:8080/api/video/page?size=30&page=1')
          .then((response) => {
            // console.log(response.data)
            this.lists = response.data.data
          })
      }
    }
  }
</script>

<style scoped>

</style>
