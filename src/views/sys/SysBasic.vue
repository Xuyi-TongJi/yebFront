<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepartmentManagement">
        <DepartmentManagement></DepartmentManagement>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="PositionManagement">
        <PositionManagement></PositionManagement>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelManagement">
        <JobLevelManagement></JobLevelManagement>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="RewardsAndPunishment">
        <RewardsAndPunishment></RewardsAndPunishment>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="AuthorizationGroup">
        <AuthorizationGroup></AuthorizationGroup>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepartmentManagement from "@/components/sysbasic/DepartmentManagement";
import JobLevelManagement from "@/components/sysbasic/JobLevelManagement";
import PositionManagement from "@/components/sysbasic/PositionManagement";
import RewardsAndPunishment from "@/components/sysbasic/RewardsAndPunishment";
import AuthorizationGroup from "@/components/sysbasic/AuthorizationGroup";

export default {
  name: "SysBasic",
  components: {DepartmentManagement, JobLevelManagement, PositionManagement, RewardsAndPunishment, AuthorizationGroup},
  data() {
    return {
      activeName: 'PositionManagement'
    }
  }
}
</script>

<style scoped>

</style>
