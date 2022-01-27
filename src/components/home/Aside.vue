<template>
<div>
  <el-menu router>
    <!-- 循环routes 动态显示导航栏 -->
    <el-submenu index="1" v-for="(item, index) in businessComponent" :key="index">
        <template slot="title">
          <i class="el-icon-location">{{item.name}}</i>
        </template>
        <el-menu-item :index="children.path" v-for="(children, i) in item.children" :key="i">
          {{children.name}}
        </el-menu-item>
    </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  name: "Aside",
  computed: {
    businessComponent: function() {
      return this.$router.options.routes.filter(function (router) {
        return !router.hidden;
      });
    }
  }
}
</script>

<style scoped>

</style>
