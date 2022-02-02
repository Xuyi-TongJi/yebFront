<template>
  <div>
    <!-- 操作界面 -->
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input placeholder="通过用户名搜索用户" prefix-icon="el-icon-search" style="width: 400px;margin-right: 10px"
                v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="getAdminListByKeywords(keywords)">搜索</el-button>
    </div>
    <!-- 展示界面 -->
    <div class="admin-view-container">
      <el-card class="box-card" v-for="(admin, index) in adminList" :key="admin.id">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button style="float: right; padding: 3px 2px" type="danger" icon="el-icon-delete-solid"
                     @click="confirmDeleteAdmin(admin.id, index)"></el-button>
        </div>
        <div class="text item">
          <img :src="adminList[index].userFaceImg" alt="刷新以获取头像"/>
        </div>
        <div>姓名： {{ admin.name }}</div>
        <div>电话： {{ admin.telephone }}</div>
        <div>地址： {{ admin.address }}</div>
        <div>拥有权限：
          <span v-for="role in admin.roleList" :key="role.id">{{ role.nameZh }}  </span>
          <el-button icon="el-icon-edit" type="primary" style="float: right; padding: 3px 2px"
                     @click="openUpdateDialog(admin)"></el-button>
        </div>
        <div>是否启用：
          <el-switch v-model="admin.enabled" @change="enableAdmin(admin, admin.enabled)"></el-switch>
        </div>
      </el-card>
    </div>
    <!-- 添加角色编辑页 -->
    <el-dialog class="form-update-job-level" title="更新管理员角色" :visible.sync="dialogVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAdminRole(adminUpdate.id, ridListUpdate)">更 新</el-button>
      </div>
      <div>
        <el-transfer v-model="ridListUpdate" :data="roleList" :props="props"></el-transfer>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SysAdmin",
  data() {
    return {
      // 展示在页面上的adminList
      adminList: [],
      // 所有adminList
      allAdminList: [],
      keywords: '',
      isReady: 0,
      // 更新角色
      dialogVisible: false,
      adminUpdate: {},
      roleList: [],
      ridListUpdate: [],
      props: {
        label: 'nameZh',
        key: 'id',
      }
    }
  },
  methods: {
    getAdminList() {
      if (this.$store.state.adminList.length === 0) {
        this.getRequest("/system/admin/").then(res => {
          if (res.status === 200 && res.data != null && res.data.length > 0) {
            this.allAdminList = res.data;
            this.$store.commit("setAdminList", this.allAdminList);
            // 获取用户头像
            this.getUserFaceImg();
          }
        })
      } else {
        this.allAdminList = this.$store.state.adminList;
        this.adminList = this.allAdminList;
      }
    },
    getAdminListByKeywords(keywords) {
      // this.allAdminList 不可能为 null
      if (keywords != null && '' !== keywords) {
        // 前端实现关键字搜索
        this.adminList = [];
        for (let i = 0; i < this.allAdminList.length; i++) {
          if (this.allAdminList[i].name.includes(keywords)) {
            this.adminList.push(this.allAdminList[i]);
          }
        }
      } else if (this.allAdminList == null || this.allAdminList.length === 0) {
        this.getAdminList();
      } else {
        this.adminList = this.allAdminList;
      }
    },
    getUserFaceImg() {
      for (let i = 0; i < this.allAdminList.length; i++) {
        axios({
          url: '/system/admin/userFace/' + this.allAdminList[i].id,
          method: 'get',
          responseType: 'blob',
          async: false
        }).then(res => {
          if (res.status === 200 && res.data != null) {
            this.allAdminList[i].userFaceImg = URL.createObjectURL(res.data);
            this.$store.commit("setAdminListIndexUserFace", i, this.allAdminList[i].userFaceImg);
            this.isReady++;
            if (this.isReady === this.allAdminList.length) {
              this.adminList = this.allAdminList;
            }
          }
        })
      }
    },
    getRoleList() {
      this.getRequest("/system/basic/permission/").then(res => {
        if (res.status === 200 || res.data != null) {
          this.roleList = res.data;
          this.dialogVisible = true;
        }
      })
    },
    enableAdmin(admin, enabled) {
      if (admin != null && enabled != null) {
        admin.enabled = enabled;
        this.putRequest("/system/admin/", admin).then(res => {
          if (res.data.status === 200) {
            // 更新成功，更新vuex
            this.$store.commit("setAdminListIndexEnabled", enabled);
          } else {
            // 更新失败
            admin.enabled = !enabled;
          }
        });
      }
    },
    updateAdminRole(aid, rids) {
      // rids可以为null
      if (aid != null) {
        this.putRequest("/system/admin/" + aid, rids).then(res => {
          if (res.data.status === 200) {
            this.$store.commit("clearAdminList");
            this.refreshPage();
          }
          this.dialogVisible = false;
        });
      }
    },
    deleteAdmin(id, index) {
      if (id != null) {
        this.deleteRequest("/system/admin/" + id).then(res => {
          if (res.data.status === 200) {
            // 删除成功
            this.removeByIndex(index);
          }
        })
      }
    },
    confirmDeleteAdmin(id, index) {
      this.$confirm('此操作将永久删除该操作员, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAdmin(id, index);
      })
    },
    openUpdateDialog(admin) {
      if (admin != null) {
        this.ridListUpdate = [];
        this.adminUpdate = admin;
        for (let i = 0; i < this.adminUpdate.roleList.length; i++) {
          this.ridListUpdate.push(this.adminUpdate.roleList[i].id);
        }
        if (this.roleList == null || this.roleList.length === 0) {
          this.getRoleList();
        } else {
          this.dialogVisible = true;
        }
      }
    },
    refreshPage() {
      this.isReady = 0;
      this.$store.commit("clearAdminList");
      this.getAdminList();
    },
    removeByIndex(index) {
      let originLength = this.allAdminList.length;
      for (let i = index; i < originLength - 1; i++) {
        this.allAdminList[i] = this.allAdminList[i + 1];
      }
      this.allAdminList.pop();
      this.$store.commit("setAdminList", this.allAdminList);
      this.adminList = this.allAdminList;
    }
  },
  mounted() {
    this.refreshPage();
  }
}
</script>

<style scoped>
.admin-view-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 10px;
}

.box-card {
  margin-left: 10px;
  margin-top: 30px;
  width: 350px;
}

.admin-view-container img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}
</style>
