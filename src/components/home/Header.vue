<template>
  <div class="home-header">
    <div class="title">网上办公系统</div>
    <!-- 下拉菜单 -->
    <el-dropdown class="userInfo" @command="commandHandler">
      <span class="el-dropdown-link">
        {{ user.name }}
        <i><img :src="userFace"/></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
        <el-dropdown-item command="settings">设置</el-dropdown-item>
        <el-dropdown-item command="logout">注销登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Header",
  data() {
    return {
      userFace: '',
      user: JSON.parse(sessionStorage.getItem("user"))
    }
  },
  methods: {
    getUserFace() {
      axios({
        url: '/personalCenter/userFace',
        method: 'get',
        responseType: 'blob'
        }
      ).then(res => {
        if (res.status === 200 && res.data != null) {
          this.userFace = URL.createObjectURL(res.data);
        }
      })
    },
    commandHandler(command) {
      if (command === 'logout') {
        this.$confirm('是否注销登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.postRequest('/logout').then(res => {
            if (res.data.status === 200) {
              // 清空vuex中的菜单
              this.$store.commit("clearRoutes");
              // 清空用户数据
              this.$store.commit("clearTokenStr");
              sessionStorage.removeItem("user");
              this.$router.replace("/");
            }
          })
        })
      } else if (command === 'settings') {
        return;
      } else if (command === 'personalCenter') {
        return;
      }
    }
  },
 mounted() {
    this.getUserFace();
 }
}
</script>

<style scoped>
.home-header {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.home-header .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white;

}

.home-header .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.home-header .userInfo .el-dropdown-link .user-name{
  margin-top: 20px;
}
</style>
