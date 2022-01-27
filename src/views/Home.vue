<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <Aside></Aside>
        </el-aside>
        <el-main>
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/components/home/Aside";
import Main from "@/components/home/Main";
export default {
  name: "Home",
  components: {Aside, Main}
}
</script>

<style scoped>

</style>
