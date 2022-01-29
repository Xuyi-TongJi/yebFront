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
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职位名称"
          width="400">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="400">
        </el-table-column>
        <el-table-column
          prop="enabledStr"
          label="是否启用"
          width="200">
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作">
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
        if (res.data != null) {
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
    tableRowClassName({rowIndex}) {
      if (!this.tableData[rowIndex].enabled) {
        return 'warning-row';
      } else if (this.tableData[rowIndex].enabled) {
        return 'success-row';
      }
      return 'success-row';
    },
    addPosition(position) {
      if (position.name != null && '' !== position.name) {
        this.postRequest("/system/basic/position/", position).then(res => {
          if (res.data.status === 200) {
            this.getPositions();
          }
        })
      }
    },
    deletePosition(id) {
      if (id !== null) {
        this.deleteRequest("/system/basic/position/" + id).then(res => {
          if (res.data.status === 200) {
            this.getPositions();
          }
        })
      }
    },
    enablePosition(position, enabled) {
      let pos = {
        id: position.id,
        name: position.name,
        createDate: null,
        enabled: enabled
      }
      this.putRequest("/system/basic/position/", pos).then(res => {
        if (res.data.status === 200) {
          this.getPositions();
        }
      })
    },
    deleteBatch(checkedArray) {
      if (checkedArray != null && checkedArray !== []) {
        let pIds = [];
        for (let i = 0; i < checkedArray.length; i++) {
            pIds.push(checkedArray[i].id);
        }
        this.deleteRequest("/system/basic/position/", pIds).then(res => {
          if (res.data.status === 200) {
            this.getPositions();
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
    }
  },
  mounted() {
    this.getPositions();
  }
}

</script>

<style scoped>
.add-position-input {
  width: 300px;
  margin-right: 8px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
