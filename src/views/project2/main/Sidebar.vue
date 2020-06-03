<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '@/utils/bus';


  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'icon web widilanxianxingiconyihuifu_huabanfuben',
            index: 'main',
            title: '  系统首页'
          }, {
            icon: 'icon web wiziyuanguanli',
            index: '2',
            title: '  资源管理',
            subs: [
              {
                index: 'course',
                title: '课程'
              },
              {
                index: 'video',
                title: '视频'
              }, {
                index: 'teacher',
                title: '教师'
              }, {
                index: 'specialTopic',
                title: '专题'
              }]
          }
          , {
            icon: 'icon web wiyonghuguanli',
            index: '1',
            title: '  用户管理',
            subs: [
              {
                index: 'userlist',
                title: '用户管理'
              },
              {
                index: 'rolelist',
                title: '身份管理'
              }]
          }, {
            icon: 'icon web wiyonghuguanli',
            index: '3',
            title: '  系统管理',
            subs: [
              {
                index: 'log',
                title: '系统日志'
              }]
          }
          , {
            icon: 'icon web wiwebicon08',
            index: 'userinfo',
            title: '  个人中心'
          }

        ]
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
        bus.$emit('collapse-content', msg);
      });
    }
  };
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
