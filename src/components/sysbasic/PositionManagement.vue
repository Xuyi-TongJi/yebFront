<template>
  <div>
    <!-- 输入框和全局操作按钮 -->
    <div>
      <el-input
        size="small"
        class="add-position-input"
        placeholder="添加职位"
        prefix-icon="el-icon-plus"
        v-model="position.name">
      </el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addPosition(position)">
        添加
      </el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="confirmDeleteBatch(multipleSelection)">
        批量删除
      </el-button>
    </div>
    <!-- 展示表格 -->
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职位名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="enabledStr"
          label="是否启用"
          width="200">
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="confirmDelete(tableData[scope.$index].id)">删除
            </el-button>
            <el-button
              size="mini"
              @click="enablePosition(tableData[scope.$index], true)" v-if="!tableData[scope.$index].enabled">
              启用
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="enablePosition(tableData[scope.$index], false)" v-if="tableData[scope.$index].enabled">
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionManagement",
  data() {
    return {
      position: {
        name: ''
      },
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    getPositions() {
      this.getRequest("/system/basic/position/").then(res => {
        if (res.status === 200 && res.data != null && [] !== res.data) {
          this.tableData = [];
          for (let i = 0; i < res.data.length; i++) {
            let pos = {
              index: '',
              id: '',
              name: '',
              createDate: '',
              enabled: false,
              enabledStr: ''
            }
            pos.index = i + 1;
            pos.id = res.data[i].id;
            pos.name = res.data[i].name;
            pos.createDate = res.data[i].createDate;
            pos.enabled = res.data[i].enabled;
            if (pos.enabled === true) {
              pos.enabledStr = '启用';
            } else {
              pos.enabledStr = '禁用';
            }
            this.tableData.push(pos);
          }
        }
      })
    },
    addPosition(position) {
      if (position != null && '' !== position.name) {
        this.postRequest("/system/basic/position/", position).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    deletePosition(id) {
      if (id != null) {
        this.deleteRequest("/system/basic/position/" + id).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    enablePosition(position, enabled) {
      if (position != null && enabled != null) {
        let pos = {
          id: position.id,
          name: position.name,
          createDate: null,
          enabled: enabled
        }
        this.putRequest("/system/basic/position/", pos).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    deleteBatch(checkedArray) {
      if (checkedArray.length === 0) {
        this.$message.info("没有需要删除的数据");
      }
      if (checkedArray.length > 0)  {
        let pIds = [];
        for (let i = 0; i < checkedArray.length; i++) {
            pIds.push(checkedArray[i].id);
        }
        this.deleteRequest("/system/basic/position/", pIds).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    confirmDelete(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePosition(id);
      })
    },
    confirmDeleteBatch(checkedArray) {
      this.$confirm('此操作将永久删除所选中的记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBatch(checkedArray);
      })
    },
    // 不可更改
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    refreshPage() {
      this.getPositions();
    }
  },
  mounted() {
    this.refreshPage();
  }
}

</script>

<style scoped>
.add-position-input {
  width: 300px;
  margin-right: 8px;
}
</style>
