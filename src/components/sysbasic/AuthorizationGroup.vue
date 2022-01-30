<template>
  <div>
    <!-- 输入框和全局操作按钮 -->
    <div>
      <el-input placeholder="请输入角色英文名" v-model="role.name" class="add-role-input">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input v-model="role.nameZh" placeholder="请输入角色中文名" class="add-role-input"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole(role)">
        添加角色
      </el-button>
    </div>
    <!-- 展示界面 -->
    <div>
      <!-- 卡片控件展示角色 -->
      <div v-for="(item, index) in roleList" :key="item.id">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.nameZh }}</span>
            <el-button type="danger" icon="el-icon-delete" circle size="small" style="float: right;">
            </el-button>
          </div>
          <!-- 树形控件展示权限 -->
          <div class="text item" v-if="roleList[index].menus != null">
            <el-tree
              :data="roleList[index].menus"
              accordion
              show-checkbox
              node-key="id"
              :expand-on-click-node="true">
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">删除
                </el-button>
              </span>
            </span>
            </el-tree>
          </div>
          <!-- 当前角色没有权限时，展示以下内容 -->
          <div v-if="!roleList[index].menus">
            <span>{{ item.nameZh }}</span> 目前没有任何权限
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorizationGroup",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      englishRegex: new RegExp("^[A-Za-z]+$"),
      chineseRegex: new RegExp("^[\u4e00-\u9fa5]+$"),
      roleList: [],
    }
  },
  methods: {
    getRoleList() {
      this.getRequest("/system/basic/permission/").then(res => {
          if (res.status === 200 && res.data != null && [] !== res.data) {
            this.roleList = res.data;
            this.getRequest("/system/basic/permission/roles").then(res => {
              if (res.status === 200 && res.data != null && [] !== res.data) {
                for (let i = 0; i < this.roleList.length; i++) {
                  for (let j = 0; j < res.data.length; j++) {
                    if (this.roleList[i].id === res.data[j].id) {
                      this.roleList[i].menus = res.data[j].menus;
                      break;
                    }
                  }
                }
              }
            });
          }
        });
    },
    addRole(role) {
      if (this.validRole(role)) {
        this.postRequest("/system/basic/permission/", role).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    validRole(role) {
      if (role != null) {
        if (this.englishRegex.test(role.name)) {
          if (this.chineseRegex.test(role.nameZh)) {
            return true;
          } else {
            this.$message.warning("角色中文名称不可为空，且角色名称仅支持中文字符，不支持其他字符！");
            return false;
          }
        } else {
          this.$message.warning("角色名称不可为空，且角色名称仅支持英文字母，不支持其他字符！");
          return false;
        }
      }
    },
    refreshPage() {
      this.getRoleList();
    },
  },
  mounted() {
    this.refreshPage();
  }
}
</script>

<style scoped>
.add-role-input {
  width: 300px;
  margin-right: 8px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
