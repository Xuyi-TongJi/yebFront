<template>
  <div>
    <div class="dep-operation-view">
      <el-input
        placeholder="请输入一级部门名称"
        v-model="depName" class="add-dep-input">
      </el-input>
      <el-button type="primary" @click="addTitleDep(depName)">添加一级部门</el-button>
      <br/>
      <br/>
      <el-input
        placeholder="请输入部门名称进行搜索"
        v-model="filterText" class="search-dep-input">
      </el-input>
    </div>
    <!-- 部门展示界面 -->
    <div style="width: 500px" class="text item">
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        accordion
        :filter-node-method="filterNode"
        ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.children.length === 0"
            type="text"
            size="mini"
            @click="() => confirmDelete(data.id)">
            删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => openAddDialog(data.id)">
            添加
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <!-- 新增编辑界面对话框 -->
    <div>
      <el-dialog class="form-update-job-level" title="更新职称信息" :visible.sync="addDialogVisible">
        部门名称：<el-input
          placeholder="请输入部门名称"
          v-model="depAdd.name">
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDep(depAdd)">添 加</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepartmentManagement",
  data() {
    return {
      // 树形展示界面
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 添加部门编辑界面
      depAdd: {
        name: '',
        parentId: ''
      },
      formLabelWidth: '100px',
      addDialogVisible: false,
      // 添加一级部门
      depName: ''
    }
  },

  watch: {
    filterText(val) {
      // 调用filter-node-method
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    getDepList() {
      this.getRequest("/system/basic/department/").then(res => {
        if (res.status === 200 && res.data != null && res.data.length > 0) {
          this.treeData = res.data;
        }
      })
    },
    deleteDep(did) {
      if (did != null) {
        this.deleteRequest("/system/basic/department/" + did).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    confirmDelete(did) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDep(did);
      })
    },
    openAddDialog(parentId) {
      if (parentId != null) {
        this.depAdd.parentId = parentId;
        this.addDialogVisible = true;
      }
    },
    addDep(dep) {
      if (dep != null && dep.name !== '') {
        this.postRequest("/system/basic/department/", dep).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
            this.addDialogVisible = false;
          }
        });
      } else {
        this.$message.warning("请输入部门名称！");
      }
    },
    addTitleDep(depName) {
      if (depName != null && depName !== '') {
        let dep = {
          parentId: -1,
          name: depName
        }
        this.addDep(dep);
      } else {
        this.$message.warning("请输入部门名称！");
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    refreshPage() {
      this.getDepList();
    }
  },

  mounted() {
    this.refreshPage();
    this.depName = '';
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.dep-operation-view {
  margin-left: 20px;
}
.add-dep-input {
  width: 300px;
  margin-right: 8px;
}
.search-dep-input {
  width: 300px;
  margin-right: 8px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
