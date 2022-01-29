<template>
  <div>
    <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path !== '/hello'">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="home-welcome" v-if="this.$router.currentRoute.path === '/hello'">欢迎来到网上办公系统</div>
    <router-view class="main-view"/>
  </div>
</template>

<script>
export default {
  name: "Main"
}
</script>

<style scoped>
  .home-welcome {
    text-align: center;
    font-size: 30px;
    font-family: 黑体;
    color: #040404;
    padding-top: 50px;
  }
  .main-view {
    margin-top: 10px;
  }
</style>
