<template>
  <div>
    <!-- 输入框和全局操作按钮 -->
    <div class="role-operation-view">
      <el-input placeholder="请输入角色英文名" v-model="role.name" class="add-role-input">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input v-model="role.nameZh" placeholder="请输入角色中文名" class="add-role-input"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole(role)">
        添加角色
      </el-button>
    </div>
    <!-- 展示界面 -->
    <div class="role-menu-view">
      <!-- 卡片控件展示角色 -->
      <div v-for="(item, index) in roleList" :key="item.id">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.nameZh }}</span>
            <div style="float: right;">
              <el-button type="danger" icon="el-icon-delete" circle size="small"
                         @click="confirmDeleteRole(index)">
              </el-button>
              <el-button type="primary" icon="el-icon-edit" circle size="small"
                         @click="openUpdateDialog(index)">
              </el-button>
            </div>
          </div>
          <el-card class="box-card-inner">
            <div slot="header" class="clearfix">
              <span>拥有权限</span>
              <el-button type="primary" icon="el-icon-plus" circle size="small" style="float: right;"
                         @click="openAddDialog(index)">
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
                        <el-button type="text" size="mini"
                                   @click="confirmDeleteMenu(roleList[index].id, data.id)"
                                   v-if="data.children == null">
                          删除
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
        </el-card>
        <div><br/><br/></div>
      </div>
    </div>
    <!-- 新增编辑界面对话框 -->
    <div>
      <el-dialog class="form-update-job-level" title="更新职称信息" :visible.sync="addDialogVisible">
        <el-form :model="roleEdit">
          <el-form-item label="角色英文名称" :label-width="formLabelWidth">
            <el-input class="input-update-role-menu" v-model="roleEdit.name" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色中文名称" :label-width="formLabelWidth">
            <el-input class="input-update-role-menu" v-model="roleEdit.nameZh" autocomplete="off" disabled></el-input>
          </el-form-item>
          <!-- 菜单列表 -->
          <el-form-item label="新增权限" :label-width="formLabelWidth">
            <el-cascader :options="menuList" clearable :props="props" v-model="roleEdit.mid"></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleMenu(roleEdit.id, roleEdit.mid)">添 加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 更新编辑界面对话框 -->
    <div>
      <el-dialog class="form-update-job-level" title="更新角色信息" :visible.sync="updateDialogVisible">
        <el-form :model="roleUpdate">
          <el-form-item label="角色英文名称" :label-width="formLabelWidth">
            <el-input class="input-update-role-menu" v-model="roleUpdate.roleName" autocomplete="off">
              <template slot="prepend">ROLE_</template>
            </el-input>
          </el-form-item>
          <el-form-item label="角色中文名称" :label-width="formLabelWidth">
            <el-input class="input-update-role-menu" v-model="roleUpdate.nameZh" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole(roleUpdate)">更 新</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  name: "AuthorizationGroup",
  data() {
    return {
      // 添加角色
      role: {
        name: '',
        nameZh: ''
      },
      englishRegex: new RegExp("^[A-Za-z]+$"),
      chineseRegex: new RegExp("^[\u4e00-\u9fa5]+$"),
      // 角色数据
      roleList: [],
      // 添加角色对应的菜单
      menuList: [],
      roleEdit: {
        id: '',
        name: '',
        nameZh: '',
        mid: ''
      },
      props: {
        label: 'name',
        value: 'id',
      },
      addDialogVisible: false,
      formLabelWidth: '80px',
      // 更新角色信息
      updateDialogVisible: false,
      roleUpdate: {
        id: '',
        name: '',
        nameZh: '',
        // name去掉前缀
        roleName: ''
      },
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
    deleteRole(index) {
      let id = this.roleList[index].id;
      if (id != null) {
        if (this.roleList[index].menus == null) {
          this.deleteRequest("/system/basic/permission/" + id).then(res => {
            if (res.data.status === 200) {
              this.refreshPage();
            }
          });
        } else {
          this.$message.warning("当前角色尚具有权限，请先清除所有权限再删除角色");
        }
      }
    },
    updateRole(role) {
      if (role != null) {
        role.name = role.roleName;
        if (this.validRole(role)) {
          this.putRequest("/system/basic/permission/", role).then(res => {
            if (res.data.status === 200) {
              this.refreshPage();
              this.updateDialogVisible = false;
            }
          })
        }
      }
    },
    confirmDeleteRole(index) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole(index);
      })
    },
    deleteMenu(rid, mid) {
      if (rid != null && mid != null) {
        this.deleteRequest("/system/basic/permission/" + rid + "/" + mid).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    confirmDeleteMenu(rid, mid) {
      this.$confirm('此操作将永久删除该角色拥有的该菜单的权限, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMenu(rid, mid);
      })
    },
    openUpdateDialog(index) {
      if (this.roleList[index] != null) {
        this.roleUpdate.id = this.roleList[index].id;
        this.roleUpdate.nameZh = this.roleList[index].nameZh;
        this.roleUpdate.roleName = this.roleList[index].name.split("_")[1];
        this.updateDialogVisible = true;
      }
    },
    openAddDialog(index) {
      if (this.roleList[index] != null) {
        this.roleEdit = this.roleList[index];
        // 获取所有级联菜单
        if (this.$store.state.menuList.length === 0) {
          this.getRequest("/system/basic/permission/menus").then(res => {
            if (res.data != null) {
              this.menuList = res.data;
              this.$store.commit("setMenuList", res.data);
              // 初始化菜单
              this.initMenuListDisabled(this.menuList);
              this.initRoleMenuList(this.roleList[index].menus, this.menuList);
              this.addDialogVisible = true;
            } else {
              this.$message.error("服务器无法响应菜单数据，请稍后再试");
              this.addDialogVisible = false;
            }
          })
        } else {
          this.menuList = this.$store.state.menuList;
          this.initMenuListDisabled(this.menuList);
          this.initRoleMenuList(this.roleList[index].menus, this.menuList);
          this.addDialogVisible = true;
        }
      }
    },
    /**
     * 初始化添加角色权限时可选择的菜单
     * @param roleMenuList 菜单列表
     * @param allMenuList 所有菜单
     */
    initRoleMenuList(roleMenuList, allMenuList) {
      // 当前用户已经具有权限
      if (roleMenuList != null && roleMenuList.length > 0) {
        for (let i = 0; i < roleMenuList.length; i++) {
          if (roleMenuList[i].children != null) {
            // 非叶子节点
            this.initRoleMenuList(roleMenuList[i].children, allMenuList[i].children);
          } else {
            // 叶子节点
            allMenuList[i].disabled = true;
          }
        }
      }
    },
    initMenuListDisabled(allMenuList) {
      if (allMenuList != null) {
        for (let i = 0; i < allMenuList.length; i++) {
          if (allMenuList[i].children != null) {
            // 非叶子节点
            this.initMenuListDisabled(allMenuList[i].children);
          } else {
            // 叶子节点
            allMenuList[i].disabled = false;
          }
        }
      }
    },
    addRoleMenu(rid, mid) {
      if (rid != null && mid != null) {
        // 处理级联选择器的mid语义
        let midToAdd = mid[mid.length - 1];
        this.postRequest("/system/basic/permission/" + rid + "/" + midToAdd).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
            this.addDialogVisible = false;
          }
        });
      } else {
        this.$message.warning("请选择需要添加的权限！");
      }
    },
    refreshPage() {
      this.getRoleList();
      this.role = {};
    },
  },
  mounted() {
    this.refreshPage();
  }
}
</script>

<style scoped>
.role-operation-view {
  margin-left: 200px;
}

.role-menu-view {
  margin-left: 30px;
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

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
  width: 400px;
}

.box-card-inner {
  width: 300px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.input-update-role-menu {
  width: 200px;
}

.form-update-job-level {
  width: 800px;
  margin-left: 500px;
}
</style>
