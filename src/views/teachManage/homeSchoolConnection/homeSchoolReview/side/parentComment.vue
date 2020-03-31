<template>
  <div class="common_table">
    <el-table
      :data="parentEvaLit"
      style="width: 100%"
      fit
      stripe
      height="calc(100vh - 280px)"
    >
      <el-table-column
        prop="stu_name"
        label="学员姓名"
        width="100px"
      />
      <el-table-column
        prop="score"
        label="综合评分"
        width="150px"
      >
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.score"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="teachFormatter"
        prop="comment"
        label="家长评价"
        width="300px"
      />
      <el-table-column
        label="图片视频"
        prop="pictures"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.pictures.length == 0">无</div>
          <div v-else style="display:flex;padding-top:5px;display: flex;height: 70px;">
            <div
              v-for="(items, index) of scope.row.pictures.split(',').slice(0,3)"
              :key="index"
              class="wrapWall"
              @click="videoImg(index,scope.row.pictures.split(','))"
            >
              <div v-if="items.indexOf('mp4') !== -1 || items.indexOf('MOV') !== -1" style="height:100%;position:relative">
                <video
                  :src="items"
                  width="100%"
                  height="100%"
                  style="object-fit:fill"
                />
                <img
                  src="http://img.ishanshan.com/gimg/n/20190729/57a0a9e3929437e627aed14e68828f6d"
                  alt=""
                  class="IMGa"
                >
              </div>
              <div v-else style="height:100%">
                <div :style="{backgroundImage: `url(${items})`, height: '65px', width: '92px',backgroundSize:'cover',backgroundPosition:'center center'}"/>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看图片轮播详情 -->
    <Imgpreview v-if="dialogVisible" :list="listALL" @message="hiDcloe"/>
  </div>
</template>
<script>
import Imgpreview from '@/components/ImgPreview/imgpre'
export default {
  components: {
    Imgpreview
  },
  props: {
    parentEvaLit: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      listALL: {}
    }
  },
  mounted() {
    this.windowH = document.body.clientHeight + 'px'
  },
  methods: {
    hiDcloe(val) {
      this.dialogVisible = val
    },
    videoImg(index, arr) {
      this.dialogVisible = true
      this.listALL = {
        arr: arr,
        index: index,
        heights: this.windowH
      }
    },
    /* 老师评价 */
    teachFormatter(row) {
      return `${row.comment || '--'}`
    }
  }
}
</script>
<style scoped>
.IMGa {
  position: absolute;
  width: 15px;
  height: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.wrapWall {
  width: 33%;
  height: 100%;
}

.wrapALL /deep/ .el-dialog__headerbtn {
  top: 17px;
  right: 17px;
}
.wrapALL /deep/ .el-dialog__header {
  padding: 26px;
}
.wrapALL /deep/ .el-dialog__body {
  padding: 20px !important;
}
.wrapWall:nth-child(2) {
  margin: 0 1%;
}
a {
  color: #46b6ee;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
}
.common_table {
  background: #fff;
  position: relative;
}
/*分页 start*/
.common_table >>> .el-pagination {
  text-align: end;
  padding: 7px 5px;
  color: #666;
  font-weight: normal;
  border-top: 1px solid #eee;
}
.common_table >>> .el-pager {
  padding: 5px 0 !important;
}
.common_table >>> .el-pager li.active {
  color: #fff;
  background: #46b6ee;
  border-radius: 4px;
  /*		width:30px;*/
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  font-size: 12px;
}
.common_table >>> .el-pager li.active:hover {
  color: #fff !important;
}
.common_table >>> .el-pager li {
  height: 18px;
  font-size: 12px;
  /*		width: 30px;*/
  min-width: 18px;
  line-height: 18px;
}
.common_table >>> .el-pagination__sizes {
  height: 22px;
  line-height: 28px;
  margin: 0 10px;
}
.common_table >>> .el-pagination .el-select .el-input {
  width: 82px;
}
.common_table >>> .el-pagination__jump {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
.common_table >>> .el-pagination__editor.el-input .el-input__inner {
  height: 22px;
  width: 36px;
}
.common_table >>> .el-pager li:hover {
  color: #46b6ee !important;
}
.common_table >>> .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px;
}
.common_table >>> .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #666;
}
.el-select-dropdown__item.selected {
  color: #46b6ee !important;
}
.common_table >>> .el-select .el-input.is-focus .el-input__inner {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__jump .el-input .el-input__inner:focus {
  border-color: #46b6ee;
}
.common_table >>> .el-select .el-input__inner:focus {
  border-color: #ddd;
}
/*end*/

.common_table >>> .el-table td,
.el-table th.is-leaf {
  border-bottom: 0;
}
.common_table >>> .el-table th {
  background: #f0f2f5;
  font-size: 14px;
  color: #333;
  line-height: 44px;
  padding: 0;
  font-weight: 500;
}
.common_table >>> .el-table td {
  font-size: 14px;
  color: #666;
  line-height: 44px;
  padding: 0;
  font-weight: 400;
}
.common_table >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
}
.common_table >>> .el-table__row.hover-row {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
}
.common_table >>> .el-table__row.el-table__row--striped.hover-row {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
}
.checkList {
  max-height: 300px;
  overflow: auto;
}
.common_table >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-table-column--selection .cell {
  padding-left: 26px;
}
.common_table >>> .el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
.common_table >>> .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
.common_table >>> .el-table .descending .sort-caret.descending {
  border-top-color: #46b6ee;
}
.common_table >>> .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #46b6ee;
}
.common_table >>> .el-table .sort-caret.ascending {
  border-bottom-color: #ccc;
}
.common_table >>> .el-table .sort-caret.descending {
  border-top-color: #ccc;
}
/*loading*/
.common_table >>> .el-loading-spinner .path {
  stroke: #46b6ee;
}
.common_table >>> .el-loading-spinner .el-loading-text {
  color: #46b6ee;
}
.common_table >>> .el-table .cell {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height:auto;
  width: 300px;
  /* line-height: 44px; */
  /* display: -webkit-box; */
  /* white-space: normal !important; */
}
.common_table >>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}
.common_table >>> .el-icon--right {
  margin-left: -2px;
}
.dropMenu.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
.dropMenu >>> .popper__arrow {
  display: none;
}
</style>
<style lang="scss">
@import "@/styles/mixin.scss";

.common_table .el-table .cell {
  @include flex();
  @include itemCenter(center);
  span {
    // width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.common_table .el-table td.is-center .cell,
.common_table .el-table th.is-center .cell {
  @include flexCenter(center);
}
.common_table .el-table td.is-right .cell,
.common_table .el-table th.is-right .cell {
  @include flexCenter(flex-end);
}
</style>
