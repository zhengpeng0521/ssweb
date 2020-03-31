<template>
  <div class="readingStu_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <div class="subUserSelect">
          <SubUserSelect
            :options="userBranchOptions"
            v-model="userBranchSelected"
            placeholder="全部员工"
            width="120"
          />
        </div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search
          ref="superSearch"
          v-bind="superSearch"
        />
      </div>
      <div>
        <!-- <el-button
          v-log="{compName:'在读学员',eventName:'web-【学员CRM】-学员信息-在读学员-家长绑定'}"
          type="primary"
          size="mini"
          @click="parentBindWX"
        >家长绑定</el-button>
        <el-button
          v-log="{compName:'在读学员',eventName:'web-【学员CRM】-学员信息-在读学员-导入'}"
          v-if="hasBtn('402000004')"
          class="cancel_btn"
          size="mini"
          @click="nameImportDialog"
        >导入</el-button> -->
        <el-button
          v-log="{compName:'往期学员',eventName:'web-【学员CRM】-学员信息-在读学员-导出'}"
          v-if="hasBtn('402000005')"
          class="cancel_btn"
          size="mini"
          @click="exportReadingStu"
        >导出</el-button>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <!-- <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkedData || '0' }}</i>条数据</span>
      <el-button
        v-log="{compName:'往期学员',eventName:'批量删除'}"
        v-if="hasBtn('402000008')"
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-left:0px"
        @click="delCheckData(checkedData)"
      >批量删除</el-button>
    </div> -->
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :options="options"
      :operation="operates"
      :table-loading="loading"
      :data-source="readingList"
      :pagination="listQuery"
      :page-count="pageCount"
      table-key="crm_studentInfo_reading"
      @handleSelectionChange="selectionChange"
    />
    <!-- 侧边详情弹框 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :tabs="detailTabs"
      :student-type ="studentType"
      :source ="'1'"
      :name="studentName"
      :params="idObj"
      :header-data="headerData"
      :base-data="baseData"
      :parent-data="parentData"
      @toUpdateLeadsTable="detailUpdateTable"
    />

    <!-- 分配转给其他销售弹框 -->
    <DistributeDialog
      ref="distributeDialog"
      @toReadingStuPage="getReadingStuList"
      @toParent="getClearData"
    />
    <!-- 家长绑定微信弹框 -->
    <ParentBindWX ref="parentBindWX" />

    <!-- 绑定人脸弹窗 -->
    <bindingFace
      ref="bindingFace"
      @toUpdateTableFace="getUpdateTable"
    />

    <!-- 到访弹框 -->
    <VisitDialog
      ref="visitDialog"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 试听弹框 -->
    <ListenDialog
      ref="listenDialog"
      @toOfflinePage="getUpdateTable"
    />
    <!-- 报名弹框 -->
    <ApplyDialog ref="applyDialog" />
    <!-- 添加潜在学员弹框 -->
    <AddLantentStuDialog
      ref="addLantentStuDialog"
      @toUpdateFollow="getUpdateTable"
      @toUpdateDetailData="getUpdateDetailData"
    />
    <!-- 转给他人弹框 -->
    <TurnOtherDialog ref="turnOtherDialog" />
    <!-- 教师分配在读学员 -->
    <!-- <TeachDistributeDialog
      ref="teachDistribute"
      @toParent="getClearData"
      @toUpdateTable="getUpdateTable"
    /> -->

    <!-- 删除在读学员弹窗 -->
    <!-- <DeleteStuDialog
      ref="deleteStuDialog"
      :refresh="getReadingStuList"
      @toUpdateTables="getUpdateTables"
    /> -->

    <!-- 批量删除在读学员弹窗 -->
    <batchDelete
      ref="batchDelete"
      @toParent="getClearData"
      @toUpdateTable="getReadingStuList"
    />
    <!-- 在读学员批量导入弹框 -->
    <NameImportDialog
      ref="nameImportDialog"
      :refresh="refresh"
    />
  </div>
</template>

<script src="./previousStu.js"></script>

<style lang="scss" scoped>
.readingStu_container {
  min-width: 1060px;
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .checked_data {
    margin: 20px 0 16px;
    .checked_text {
      margin-right: 5px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
}
</style>
<style lang="scss">
.readingStu_container {
  .stuName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    // max-width: 80px;
    &:hover {
      color: #56c0f5;
    }
  }
  .subUserSelect {
    vertical-align: top;
    float: left;
    margin-right: 10px;
  }
}
</style>
