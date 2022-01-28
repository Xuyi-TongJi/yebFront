<template>
<div>
  <el-menu router unique-opened>
    <!-- 循环routes 动态显示导航栏 -->
    <el-submenu :index="index + ''" v-for="(item, index) in routes" :key="index">
        <template slot="title">
          <i :class="item.iconCls" id="item-icon">{{item.name}}</i>
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
    // 获取存储在Vuex重的路由列表
    routes() {
      return this.$store.state.routes;
    }
  }
}
</script>

<style scoped>
  #item-icon{
    color: #1accff;
    margin-right: 5px;
  }
</style>
