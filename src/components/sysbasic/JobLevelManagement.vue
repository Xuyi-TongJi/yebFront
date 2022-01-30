<template>
  <div>
    <!-- 输入框和全局操作按钮 -->
    <div>
      <el-input
        size="small"
        class="add-job-level-input"
        placeholder="添加职位"
        prefix-icon="el-icon-plus"
        v-model="jobLevel.name">
      </el-input>
      <!-- 选择器 -->
      <el-select v-model="jobLevel.titleLevel" placeholder="请选择职称等级">
        <el-option
          v-for="name in levelTitleList"
          :key="name"
          :label="name"
          :value="name">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel(jobLevel)">
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
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职称名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="titleLevel"
          label="职称等级"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="200">
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
              @click="openEditDialog(tableData[scope.$index])">编辑
            </el-button>
            <el-button
              size="mini"
              @click="enableJobLevel(tableData[scope.$index], true)" v-if="!tableData[scope.$index].enabled">
              启用
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="enableJobLevel(tableData[scope.$index], false)" v-if="tableData[scope.$index].enabled">
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑界面对话框 -->
    <div>
      <el-dialog class="form-update-job-level" title="更新职称信息" :visible.sync="dialogVisible">
        <el-form :model="jobLevelUpdate" >
          <el-form-item label="职称名称" :label-width="formLabelWidth">
            <el-input class="input-update-job-level-name" v-model="jobLevelUpdate.name" autocomplete="off" placeholder="请输入职称姓名"></el-input>
          </el-form-item>
          <el-form-item label="职称等级" :label-width="formLabelWidth">
            <el-select v-model="jobLevelUpdate.titleLevel" placeholder="请选择职称等级">
              <el-option :key="name" :label="name" :value="name" v-for="name in levelTitleList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-switch v-model="jobLevelUpdate.enabled"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateJobLevel(jobLevelUpdate)">更 新</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobLevelManagement",
  data() {
    return {
      jobLevel: {
        name: '',
        titleLevel: '',
      },
      jobLevelUpdate: {
        id: '',
        name: '',
        titleLevel: '',
        enabled: false
      },
      levelTitleList: [],
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 不可更改
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getLevelTitleList() {
      let list = this.$store.state.levelTitleList;
      if (list.length > 0) {
        this.levelTitleList = list;
      } else {
        this.getRequest("/system/basic/jobLevel/levelTitle").then(res => {
          if (res.status === 200 && res.data != null && [] !== res.data) {
            this.levelTitleList = res.data;
            this.$store.commit("setLevelTitleList", res.data);
          }
        })
      }
    },
    getJobLevelList() {
      this.getRequest("/system/basic/jobLevel/").then(res => {
        if (res.status === 200 && res.data != null && [] !== res.data) {
          this.tableData = [];
          for (let i = 0; i < res.data.length; i++) {
            let pos = {
              index: '',
              id: '',
              name: '',
              titleLevel: '',
              createDate: '',
              enabled: false,
              enabledStr: ''
            };
            pos.index = i;
            pos.id = res.data[i].id;
            pos.name = res.data[i].name;
            pos.titleLevel = res.data[i].titleLevel;
            pos.createDate = res.data[i].createDate;
            pos.enabled = res.data[i].enabled;
            if (pos.enabled) {
              pos.enabledStr = '启用';
            } else {
              pos.enabledStr = '禁用';
            }
            this.tableData.push(pos);
          }
        }
      })
    },
    addJobLevel(jobLevel) {
      if (jobLevel != null && jobLevel.name !== '' && jobLevel.titleLevel !== '') {
        this.postRequest("/system/basic/jobLevel/", jobLevel).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    enableJobLevel(jobLevel, enabled) {
      if (jobLevel != null && enabled != null) {
        let jobLevelVo = {
          id: jobLevel.id,
          name: jobLevel.name,
          titleLevel: jobLevel.titleLevel,
          enabled: enabled
        };
        this.putRequest("/system/basic/jobLevel/", jobLevelVo).then(res => {
          if (res.data.status === 200) {
            this.refreshPage();
          }
        })
      }
    },
    openEditDialog(jobLevel) {
      if (jobLevel != null) {
        this.jobLevelUpdate.id = jobLevel.id;
        this.jobLevelUpdate.name = jobLevel.name;
        this.jobLevelUpdate.titleLevel = jobLevel.titleLevel;
        this.jobLevelUpdate.enabled = jobLevel.enabled;
      }
      this.dialogVisible = true;
    },
    updateJobLevel(jobLevel) {
      if (jobLevel != null && jobLevel.name !== '') {
          this.putRequest("/system/basic/jobLevel/", jobLevel).then(res => {
            if (res.data.status === 200) {
              this.dialogVisible = false;
              this.refreshPage();
            }
          })
        } else {
        this.$message.error("请输入职称名称!");
      }
    },
    deleteJobLevel(id) {
      if (id != null) {
        this.deleteRequest("/system/basic/jobLevel/" + id).then(res => {
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
      if (checkedArray.length > 0) {
        let jIds = [];
        for (let i = 0; i < checkedArray.length; i++) {
          jIds.push(checkedArray[i].id);
        }
        this.deleteRequest("/system/basic/jobLevel/", jIds).then(res => {
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
        this.deleteJobLevel(id);
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
    refreshPage() {
      this.getLevelTitleList();
      this.getJobLevelList();
    }
  },
  mounted() {
    this.refreshPage();
  }
}
</script>

<style scoped>
.add-job-level-input {
  width: 300px;
  margin-right: 8px;
}
.input-update-job-level-name {
  width: 300px;
}
</style>
