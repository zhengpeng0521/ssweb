<template>
  <div class="courseware">
    <!-- 直播列表页 -->
    <div v-if="!isCreate" class="liveList">
      <div class="page_title_text">
        直播课程
      </div>
      <div class="timer">
        <div class="timer_tips">
          <div class="residue_timer">剩余直播时长</div>
          <div v-if="duration < 500" class="residue_tips">
            <i class="el-icon-warning residue_tips_icon"/>
            <span v-if="duration < 500 && duration > 0">您的剩余时长即将用完，为保证您正常使用，请及时充值</span>
            <span v-if="duration === 0">无可用剩余时长，完成充值后可正常使用直播功能</span>
            <span v-if="duration < 0">您已产生欠费，请及时充值，充值时将优先补足已欠时长</span>
          </div>
        </div>
        <div class="btn">
          <div class="timer_wrap">
            <span :class="{immediately: duration < 500 && duration > 0, none: duration <= 0}" class="timeNum">
              {{ duration }}
            </span>
            <span>分钟</span>
          </div>
          <el-popover
            placement="bottom"
            width="222"
            trigger="hover"
          >
            <div class="service_content">
              <img src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c">
              <div>请联系客服人员为您充值</div>
            </div>
            <el-button slot="reference" type="primary" size="mini">充值</el-button>
          </el-popover>
          <!-- <el-button slot="reference">hover 激活</el-button> -->
          <el-button
            v-if="hasBtn('510000002')"
            plain
            size="mini"
            @click="getPopUp('details')"
          >查看详情</el-button>
          <div class="btn_right">
            <el-button
              type="primary"
              size="mini"
              @click="getPopUp('addLive')"
            >新建直播</el-button>
            <el-button
              v-if="hasBtn('510000001')"
              plain
              size="mini"
              @click="openTeacherList()"
            >直播老师列表</el-button>
            <el-button
              plain
              size="mini"
              @click="goOrderPage"
            >获取表单设置</el-button>
          </div>
          <!-- <span style="margin-left:5px; color:#1D9DF2;font-size:14px" @click="howUse">如何使用直播功能</span> -->
        </div>
      </div>
      <!-- 表格 -->
      <div class="rubbish_table">
        <el-table
          ref="rabTable"
          :data="liveListData"
          :height="tableHeight"
          size="medium"
          style="width: 100%"
          stripe
        >
          <el-table-column
            v-for="(column, index) in formThead"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="column.isShowTooltip"
            :min-width="column.width || '96px'"
            :key="index"
            :formatter="column.formatter"
            :render-header="column.renderHeader"
          >
            <template slot-scope="scope">
              <template v-if="column.render">
                <my-render
                  v-if="column.render"
                  :row="scope.row"
                  :render="column.render"
                  :index="index"
                  :column="column"
                />
              </template>

              <!-- <template v-else-if="column.prop=='time'">
                <div class="box" style="display:flex;flex-direction:column;-webkit-line-clamp: 2;">
                  <div class="startTime" style="width:150px;height:20px"> {{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>

              </div></template> -->
              <template v-else-if="column.formatter">
                <span v-html="column.formatter(scope.row, column)" />
              </template>
              <!-- <template v-else-if="column.prop === 'liveName'">
                <div style="text-overflow:ellipsis;overflow:hidden">{{ scope.row[column.prop] }}<div/>
              </div></template> -->
              <template v-else>
                <span>{{ scope.row[column.prop] }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="400px"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.status==='1'">
                <a
                  v-if="scope.row.openClass"
                  @click="enterLiveRoom(scope.$index, scope.row)"
                >进入直播间</a>
                <a
                  @click="liveLink(scope.$index, scope.row)"
                >直播链接</a>
                <a
                  v-if="scope.row.type==='2'"
                  @click="liveCode(scope.$index, scope.row)"
                >直播邀请码</a>
                <a
                  @click="edit(scope.$index, scope.row)"
                >编辑</a>

                <Popover
                  style="display:initial"
                  placement="top"
                  popper-class="myPopover"
                  trigger="click"
                  @method="deleteRoom(scope.$index, scope.row)"
                >
                  <div>
                    <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
                    <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确定删除吗？</div>
                  </div>
                  <a slot="reference">删除</a>
                </Popover>
              </template>
              <template v-else-if="scope.row.status === '2'" class="table_btn">
                <a
                  v-if="scope.row.openClass"
                  @click="enterLiveRoom(scope.$index, scope.row)"
                >进入直播间</a>
                <a
                  @click="liveLink(scope.$index, scope.row)"
                >直播链接</a>
                <a
                  v-if="scope.row.type==='2'"
                  @click="liveCode(scope.$index, scope.row)"
                >直播邀请码</a>
              </template>
              <template v-else-if="scope.row.status === '3'" class="table_btn">
                <Popover
                  style="display:initial"
                  placement="top"
                  popper-class="myPopover"
                  trigger="click"
                  @method="deleteRoom(scope.$index, scope.row)"
                >
                  <div>
                    <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
                    <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确定删除吗？</div>
                  </div>
                  <a slot="reference">删除</a>
                </Popover>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :total="paging.resultCount"
            :current-page.sync="paging.pageIndex"
            :page-size="paging.pageSize"
            :hide-on-single-page="paging.resultCount === 0"
            :small="true"
            layout="total,prev, pager, next, sizes"
            @current-change="loadThemeInstList($event)"
            @size-change="themeInstListSizeChange($event)"
          />
        </div>
        <!-- 筛选设置 -->
        <el-popover
          v-model="visiable"
          placement="bottom-end"
          visible-arrow
          trigger="click"
          popper-class="setPop"
        >
          <div class="tableList">
            <div class="checkList">
              <template v-for="checkColumn in checkList">
                <el-checkbox-group
                  v-model="checkboxVal"
                  :key="checkColumn.label"
                >
                  <el-checkbox :label="checkColumn.prop">{{ checkColumn.label }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
            <div class="save_btn">
              <el-button
                type="primary"
                size="mini"
                @click="saveTableColumnFun"
              >保存</el-button>
            </div>
          </div>
          <div
            slot="reference"
            class="setting"
          >
            <div class="setting_img">
              <el-tooltip
                content="显示表格字段"
                placement="bottom"
                effect="dark"
              >
                <i class="iconfont icon_gb_jgsz" />
              </el-tooltip>
            </div>
          </div>
        </el-popover>

      </div>
      <!-- 添加老师弹窗 -->
      <AddTeacherList
        ref="addTeacherList"
      />
      <!-- 直播链接弹窗 -->
      <LiveLinkDialog
        ref="LiveLinkDialog"
      />
      <!-- 直播邀请码弹窗 -->
      <liveCodeDialog
        ref="liveCodeDialog"
        @loadThemeInstList ="loadThemeInstList"
      />
    </div>
    <!-- 创建、编辑直播间和充值详情页 -->
    <transition name ="fade">
      <div v-if="isCreate">
        <!-- <transition name ="slide-fade"> -->
        <div class="page_title_text" style="display:flex;align-items: center;cursor:pointer;" @click="returnBack">
          <svg-icon
            icon-class="return"
            style="color:#333333;transform:rotate(270deg);width:20px;height:20px;"
          />
          <span style="color:#333333;font-size:14px;"> 返回 &nbsp;<div class="iconl"/>&emsp;{{ title }}</span>
        </div>
        <LiveDetails v-if="detailsShow"/>
        <div v-if="!detailsShow" style="height:calc(100vh - 150px);overflow-y:auto;overflow-x:hidden">
          <div
            v-if="tipChoice"
            class="wechatReservation-tip"
          >
            <span>请您遵守国家相关规定，直播中切勿涉及低俗色情、暴力恐怖、谣言诈骗、侵权盗版等相关内容，闪宝科技保有依据国家规定及平台规则进行处理的权利。</span>
            <div
              style="display: inline-block;
               float:right;cursor:pointer;"
              @click="closeTip">
              <svg-icon
                icon-class="error"
                style="color:#666666;
            width: 14px;"
              />
            </div>
          </div>
          <!-- 表单内容 -->
          <div class="formSub">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-width="120px"
              class="demo-ruleForm"
            >
              <el-form-item
                label="直播名称："
                prop="name"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="不超过20个字"
                  style="width:450px"
                />
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '未上传图片：请上传图片', trigger: 'change' }]"
                label="直播封面："
                prop="homePageUrl"
              >
                <el-input
                  v-model="ruleForm.homePageUrl"
                  placeholder="不超过20个字"
                  style="width:1px;height:1px;opacity:0;float:right;"
                />
                <el-upload
                  :class="{'disabled ': bgVisible}"
                  :on-success="handleLogoAvatarSuccess"
                  :on-preview="handleBackImgeAvatarPreview"
                  :on-remove="handleBackImgeAvatarRemove"
                  :on-change="handleBackImgeAvatarChange"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                  :file-list="bgFilelist"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus" />

                </el-upload>

                <el-dialog
                  :visible.sync="bgDialogVisible"
                  size="full"
                  title="预览"
                >
                  <img
                    :src="ruleForm.homePageUrl"
                    width="100%"
                    alt=""
                ></el-dialog>
                <span class="logo_explain">建议尺寸16：9，JPG、PNG格式， 图片小于2M</span>
                <!-- <div v-if="isShow" style="color:#d0021b;font-size:12px;">未上传图片：请上传图片</div> -->

              </el-form-item>
              <el-form-item
                label="直播开始时间："
                prop="startTime"
                label-width="120px"
              >
                <el-date-picker
                  v-model="ruleForm.startTime"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  style="width:220px"
                />

                <el-time-picker
                  v-model="start"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:00'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width:220px"
                  placeholder="开始时间"
                />
              </el-form-item>
              <el-form-item
                label="直播时长："
                prop="longtime"
              >
                <el-input
                  v-model="ruleForm.longtime"
                  :min="0"
                  :max="360"
                  placeholder="请输入直播时长"
                  type="number"
                  style="width:220px"
                  @blur="(e) => longTimeBlur(e)"
                />
                <el-select
                  v-model="timeLength.name"
                  placeholder="请选择"
                  style="width:80px"
                  filterable
                  @change="computedEndTime(timeLength.name)"
                >
                  <el-option
                    v-for="item of timeTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <!-- <span style="color:#888888;font-size:14px;">分钟</span> -->
                <span v-if="addRoomTimeFlag" class="addRoomTime">当前账户剩余时长{{ duration }}分钟，无法开启直播，请重新选择直播时长</span>
              </el-form-item>
              <el-form-item
                label="直播结束时间："
                prop="end"
                label-width="120px"
              >
                <p style="color:#666666;font-size:14px;">{{ ruleForm.endTime }}</p>
                <div style="color:#F56C6C;font-size:12px;">注：老师端可在直播开始前主动开始或结束直播</div>
              </el-form-item>
              <el-form-item
                label="上课老师："
                prop="tid"

              >
                <el-select
                  v-model="ruleForm.tid"
                  placeholder="请选择"
                  style="width:220px"
                  clearable
                  filterable
                  @change="isConflictFun"
                >
                  <el-option
                    v-for="(item, index) of schoolTeacher"
                    :key="index"
                    :label="item.uname"
                    :value="item.uid"
                  />
                </el-select>

                <span style="color:#999999;font-size:12px;margin-left:10px;">*请先在首页“直播老师列表”中添加需进行直播的老师 </span>
                <div v-if="isConflict" style="color:#F56C6C;font-size:12px;">该老师有时间冲突，<a style="text-decoration:underline" @click="openDialog">点击查看详细信息</a></div>
              </el-form-item>
              <el-form-item
                style="margin-right:700px"
                label="直播类型："
                prop="type"
              >
                <el-radio-group v-model="ruleForm.type">
                  <el-radio label="1">公开

                    <el-tooltip class="item" effect="dark" content="学员无需邀请码进入直播间" placement="right-start">
                      <svg-icon
                        icon-class="yiwen"
                        style="color:#666666;width:15px;height:15px;"
                      />
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="2">加密
                    <el-tooltip class="item" effect="dark" content="学员需输入邀请码进入直播间" placement="right-start">
                      <svg-icon
                        icon-class="yiwen"
                        style="color:#666666;width:15px;height:15px;"
                      />
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
                <div v-if="ruleForm.type ==='2'">
                  <el-input
                    v-model="ruleForm.inviteCode"
                    placeholder="请输入邀请码"
                    style="width:220px"
                    @blur="(e) => codeBlur(e)"
                  />
                  <div style="color:#999999;font-size:12px;margin-left:10px;"> *仅支持数字，英文大小写，最少4位，最多8位</div>
                </div>
              </el-form-item>
              <!-- <el-form-item
                label="学员人数上限："
                prop="num"
                label-width="120px"
              >
                <el-input
                  v-model="ruleForm.num"
                  :max="50"
                  type="number"
                  placeholder="请输入学员人数"
                  style="width:220px"
                  @blur="(e) => limintNumberBlur(e)"
                />
                <span style="color:#888888;font-size:14px;">人</span>
                <div style="color:#F56C6C;font-size:12px;">注：学员人数最多不可超过50人</div>
              </el-form-item> -->
            </el-form>
          </div>
          <div style="text-align: center;">
            <el-button
              plain
              @click="resetForm('ruleForm')"
            >取消</el-button>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >保存</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 老师冲突弹窗 -->
    <teacherConflictDialog
      ref="teacherConflictDialog"
    />
    <!--退出编辑二次确认弹窗 -->
    <comfirmDialog
      ref="comfirmDialog"
      :return-back-fun ="returnBackFun"
    />

    <reservationSetting ref="reservationSettingDialog" />
  </div>
</template>

<script>
import TreeSelect from '@/components/SubUserSelect/SubUserSelect'
// import MyRender from '../../components/CommonTable/myRender'
import AddTeacherList from './addTeacherList'
import liveCodeDialog from './liveCodeDialog'
import LiveLinkDialog from './liveLinkDialog'
import comfirmDialog from './comfirmDialog'
import teacherConflictDialog from './teacherConflict'
import moment from 'moment'
import Popover from '../../components/CommonTable/popover'
import LiveDetails from './components/LiveDetails'
import { query, queryTeacher, queryDetail, checkTime, queryAccount } from '../../api/online/liveLesson'
import { showTableColumn, saveTableColumn } from '@/api/orgSet/tableColumnSet'
import { mapActions, mapMutations } from 'vuex'
import reservationSetting from '../microWeb/wechatReservation/components/reservationSetting'

export default {
  components: {
    Popover,
    AddTeacherList,
    TreeSelect,
    comfirmDialog,
    LiveLinkDialog,
    liveCodeDialog,
    teacherConflictDialog,
    reservationSetting,
    LiveDetails
  },

  data() {
    return {
      duration: 0,
      detailsShow: true,
      isCreate: false,
      tipChoice: true,
      title: '新建直播',
      // isShow: false,
      isConflict: false,
      liveListData: [],
      checkboxVal: [],
      start: '',
      roomId: '',
      addRoomTimeFlag: false,
      paging: {
        pageSize: 10,
        resultCount: 100,
        pageIndex: 1,
        lastPageIndex: 0
      },
      timeLength: {
        id: '01',
        name: '分钟'
      },
      ruleForm: {
        name: '',
        homePageUrl: '',
        startTime: '',
        endTime: '',
        longtime: '',
        tid: '',
        type: '1',
        // num: 50,
        inviteCode: ''
      },
      // liveLogo: '',
      schoolTeacher: [],
      bgVisible: false,
      bgFilelist: [], // 背景图片列表
      bgDialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入直播名称', trigger: 'change' },
          { required: true, max: 20, message: '不能超过20字', trigger: 'change' }
        ],
        // homePageUrl: [{ required: true, message: '未上传图片：请上传图片', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请选择直播开始日期', trigger: 'change' }
        ],
        // start: [{
        //   required: true, message: '请选开始时间', trigger: 'blur'
        // }],
        longtime: [
          { required: true, message: '请输入直播时长', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择直播类型', trigger: 'change' }
        ],
        tid: [{ required: true, message: '请选择上课老师', trigger: 'change' }]
        // num: [
        //   { required: true, message: '请输入学员人数上限', trigger: 'change' }
        // ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time && ((time.valueOf() < Date.now() - 24 * 60 * 60 * 1000) || (time.valueOf() > Date.now() + 365 * 24 * 60 * 60 * 1000))
        }
      },
      visiable: false,
      userData: [], // 冲突数据
      formTheadOptions: [], // 表格的列
      formThead: this.columns,
      columns: [
        {
          label: '直播名称',
          prop: 'liveName',
          isShowTooltip: true,
          width: '130'
        },
        {
          label: '上课状态',
          prop: 'status',
          width: '110px',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status === '1') {
              if (((new Date(row.endTime) - new Date(row.startTime)) / 1000 / 60) > this.duration) {
                //eslint-disable-line
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #46B6EE;border-radius: 50px;margin-right: 5px;"></span>
                        ${'待直播'}
                        <span>(剩余时长不足，无法开始直播)</span>
                      </div>`
              } else {
                //eslint-disable-line
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                          <span style="display: inline-block;width:8px;height:8px;background-color: #46B6EE;border-radius: 50px;margin-right: 5px;"></span>
                          ${'待直播'}
                        </div>`
              }
            }
            if (row.status === '2') {
              //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #67C23A;border-radius: 50px;margin-right: 5px;"></span>
                        ${'直播中'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #CCCCCC;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已结束'}
                      </div>`
            }
          }
        },
        {
          label: '开始时间',
          prop: 'startTime',
          isShowTooltip: true,
          width: '150'
        },
        {
          label: '结束时间',
          prop: 'endTime',
          isShowTooltip: true,
          width: '150'
        },
        {
          label: '直播类型',
          prop: 'type',
          isShowTooltip: true,
          width: '100',
          formatter: row => {
            // eslint-disable-next-line
            if (row.type == '1') {
              return `公开`
              // eslint-disable-next-line
            } else if (row.type == '2') {
              return `加密`
              // eslint-disable-next-line
            }
          }
        },
        {
          label: '上课老师',
          prop: 'tname',
          isShowTooltip: true,
          width: '100'
        }
        // {
        //   label: '学员人数上限',
        //   prop: 'limit',
        //   isShowTooltip: true,
        //   width: '120'
        // }

      ],
      tableHeight: 'calc(100vh - 260px)',
      isEditShow: false,
      timeTypes: [
        {
          name: '分钟',
          id: '01'
        },
        {
          name: '小时',
          id: '02'
        }
      ]
    }
  },
  computed: {

  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i.prop) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲
    },
    // title(val) {
    //   if (val === '编辑直播') {
    //     this.isEditShow = true
    //   }
    // },
    // 'ruleForm.homePageUrl'(val) {
    //   if (val === '') {
    //     this.isShow = true
    //   } else {
    //     this.isShow = false
    //   }
    // },
    'ruleForm.startTime'(val) {
      if (val !== null) {
        this.computetime(val)
      }
    },
    start(val) {
      if (val !== null) {
        this.computetime(null, val)
      }
    },
    'ruleForm.endTime'(val) {
      if (val === 'Invalid date') {
        this.ruleForm.endTime = ''
      }
    }
  },
  mounted() {
    this.showTableColumnFun()
    this.loadThemeInstList()
  },

  created() {
    this.formTheadOptions = Object.assign([], this.columns)
    this.checkList = Object.assign([], this.columns)
    const checkArr = Object.assign([], this.columns)
    checkArr.map((item) => {
      // if (item.isColShow !== false) {
      this.checkboxVal.push(item.prop)
      // }
    })
    this.getQueryAccount()
    this.loadThemeInstList(this.paging.pageIndex)
  },
  methods: {
    ...mapMutations('liveLesson', [
      'UPDATE_STATE'
    ]),

    ...mapActions('liveLesson', [
      'updateLiveRoom',
      'addLiveRoom'

    ]),

    async getQueryAccount() {
      const res = await queryAccount()
      const { errorCode, duration } = res.data
      if (errorCode === 0) {
        this.duration = duration
      } else {
        this.$message.error(res.data.errorMessage)
      }
    },

    // 进入直播间
    enterLiveRoom(index, row) {
      const liveDate = row.startTime
      const y = new Date().getFullYear()
      let m = new Date().getMonth() + 1
      m = m.toString().length === 1 ? '0' + m : m
      let d = new Date().getDate()
      d = d.toString().length === 1 ? '0' + d : d
      const currentDate = `${y}-${m}-${d}`

      if (new Date(liveDate) - new Date() > 0 && currentDate !== liveDate.split(' ')[0]) {
        this.$message.error('请于直播当天进入直播间')
        return
      }

      const time = (new Date(row.endTime) - new Date(row.startTime)) / 1000 / 60
      if (time > this.duration) {
        this.$message.error('剩余直播时长不足，无法开始直播')
        return
      }

      this.UPDATE_STATE({ currentRow: row })
      const liveRoomInfo = JSON.stringify(row)
      sessionStorage.setItem('liveRoomInfo', liveRoomInfo)
      this.$router.push('/liveRoom')
    },
    // 直播链接
    liveLink(index, row) {
      // console.log('row', row)
      this.$refs.LiveLinkDialog.showDialog(row)
    },
    // 直播邀请码
    liveCode(index, row) {
      // console.log('row', row)
      this.$refs.liveCodeDialog.showDialog(row)
    },
    // 编辑
    edit(index, row) {
      this.detailsShow = false
      this.title = '编辑直播'
      this.bgFilelist = [{ url: row.homePageUrl }]
      this.bgVisible = true

      // console.log('row', row)
      this.queryTeacherList()
      this.roomId = row.id
      const params = {
        id: row.id
      }
      queryDetail(params).then(res => {
        if (res && res.data.errorCode === 0) {
          // console.log('res', res)
          this.ruleForm.name = res.data.liveName
          this.ruleForm.homePageUrl = res.data.homePageUrl
          this.ruleForm.startTime = res.data.startTime
          this.start = res.data.startTime.substring(11, 16)
          this.timeLength = JSON.parse(res.data.timeLength)
          this.ruleForm.longtime = this.timeLength.longtime
          this.ruleForm.endTime = res.data.endTime
          this.ruleForm.tid = res.data.tid
          this.ruleForm.type = res.data.type
          this.ruleForm.inviteCode = res.data.inviteCode
          // this.ruleForm.num = res.data.limitNum
        }
      })

      // this.timeLength =
      // this.longtime = JSON.parse(row.timeLength)
      this.isCreate = true
    },
    // 删除
    deleteRoom(index, row) {
      if (row.duration !== '0') {
        this.$message.error('该直播间有时长消耗，不可删除')
        return
      }
      this.liveListData.splice(index, 1)
      const params = {
        id: row.id,
        status: '0'
      }
      const text = {
        text: '删除'
      }
      this.updateLiveRoom({ params, text })
      setTimeout(() => {
        this.loadThemeInstList()
      }, 500)
    },
    // 新建直播
    getPopUp(e) {
      if (e === 'details') {
        this.isCreate = true
        this.detailsShow = true
        this.title = '直播时长详情'
      } else {
        if (this.duration <= 0) {
          this.$message.error('已无可用直播时长，请先充值时长')
          return
        }
        this.isCreate = true
        this.detailsShow = false
        this.title = '新建直播'
        this.bgVisible = false
        this.queryTeacherList()
        this.ruleForm = {
          name: '',
          homePageUrl: '',
          startTime: '',
          endTime: '',
          longtime: '',
          tid: '',
          type: '1',
          // num: 50,
          inviteCode: ''
        }
        this.start = ''
      }
      this.bgFilelist = []
      this.start = ''
    },
    // 直播老师列
    openTeacherList() {
      this.$refs.addTeacherList.showDialog()
    },
    codeBlur(e) {
      var str = RegExp('^[0-9A-Za-z]{4,8}$').test(e.target.value)
      if (!str) {
        this.$message.error('仅支持数字，英文大小写，最少4位，最多8位')
      }
    },
    // 获取老师列表
    queryTeacherList() {
      const params = {
        tenantId: this.$store.getters.tenantId,
        orgId: this.$store.getters.orgId,
        uid: this.$store.getters.id
      }
      queryTeacher(params).then(res => {
        // console.log('res', res)
        this.schoolTeacher = res.data.results.map(item => {
          // item.qrCode = this.genQrCode(item.themeId, item.instId)
          return item
        })
      })
    },
    // 如何使用
    howUse() {

    },
    closeTip() {
      this.tipChoice = false
    },
    returnBack() {
      if (this.detailsShow) {
        this.getQueryAccount()
        this.isCreate = false
      } else {
        this.$refs.comfirmDialog.show()
      }
    },
    returnBackFun() {
      this.isCreate = false
      this.bgFilelist = []
      this.loadThemeInstList()
    },
    // 打开老师冲突列表
    openDialog() {
      // console.log('this.userData', this.userData)
      this.$refs.teacherConflictDialog.show(this.userData)
    },
    isConflictFun() {
      const data1 = this.ruleForm.startTime.substring(0, 10)
      const time1 = this.start
      var arr = [data1, time1]
      var data2 = arr.join(' ')
      this.ruleForm.startTime = data2
      const params = {
        tid: this.ruleForm.tid,
        startTime: this.ruleForm.startTime,
        endTime: this.ruleForm.endTime
      }
      checkTime(params).then(res => {
        this.isConflict = !res.data.check
        if (this.isConflict) {
          this.userData = res.data.results
          // console.log('this.userData', this.userData)
        }
      })
    },
    resetForm(formName) {
      if (this.title === '新建直播') {
        this.$refs[formName].resetFields()
        this.ruleForm = {
          name: '',
          homePageUrl: '',
          startTime: '',
          endTime: '',
          longtime: '',
          tid: '',
          type: '1',
          // num: 50,
          inviteCode: ''
        }
        this.start = ''
        this.bgFilelist = []
        this.bgVisible = false
        this.isCreate = false
        this.addRoomTimeFlag = false
      } else {
        this.isCreate = false
      }
    },

    // 刷新并关闭
    refresh() {
      this.ruleForm = {
        name: '',
        homePageUrl: '',
        startTime: '',
        endTime: '',
        longtime: '',
        tid: '',
        type: '1',
        // num: 50,
        inviteCode: ''
      }
      this.start = ''
      this.bgFilelist = []
      this.bgVisible = false
      this.timeLength = {
        id: '01',
        name: '分钟'
      }
      this.isCreate = false
      this.loadThemeInstList()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 分钟
          if (this.timeLength.id === '01' && this.ruleForm.longtime > this.duration) {
            this.addRoomTimeFlag = true
            return
          }
          // 小时
          if (this.timeLength.id === '02' && this.ruleForm.longtime > this.duration / 60) {
            this.addRoomTimeFlag = true
            return
          }

          if (this.timeLength.id === '02' && this.ruleForm.longtime > 6) {
            this.$message.error('直播时长不能超过6小时')
            return
          }
          if (this.timeLength.id === '01' && this.ruleForm.longtime > 360) {
            this.$message.error('直播时长不能超过6小时')
            return
          }
          var str = RegExp('^[0-9A-Za-z]{4,8}$').test(this.ruleForm.inviteCode)
          if (this.ruleForm.type === '2' && !str) {
            this.$message.error('仅支持数字，英文大小写，最少4位，最多8位')
            return
          } else {
            // eslint-disable-next-line
            let isTrue = false
            this.addRoomTimeFlag = false
            if (this.title === '新建直播') {
              const data1 = this.ruleForm.startTime.substring(0, 10)
              const time1 = this.start
              var arr = [data1, time1]
              var data2 = arr.join(' ')
              this.ruleForm.startTime = data2
              // console.log('this.ruleForm.startTime', this.ruleForm.startTime, moment())
              // const t1 = new Date(this.ruleForm.startTime).getTime()
              // const t2 = new Date().getTime()
              // const t3 = new Date(this.ruleForm.endTime).getTime()
              // console.log('t', t1, t2, t3)
              if (moment(this.ruleForm.startTime).isBefore(moment().format('YYYY-MM-DD HH:mm'))) {
                this.$message.error('直播开始时间不能早于当前时间')
                return
              }

              let timeLength = {
                ...this.timeLength,
                longtime: this.ruleForm.longtime
              }
              if (typeof timeLength === 'string') {
                // timeLength = timeLength
              } else {
                // console.log('this.timeLength', this.timeLength)
                timeLength = JSON.stringify(timeLength)
              }
              const objPrarms = {
                ...this.ruleForm,
                timeLength
              }
              delete objPrarms.longtime
              console.log('objPrarms', objPrarms)
              isTrue = true
              this.addLiveRoom({ params: objPrarms, refresh: this.refresh })
            } else if (this.title === '编辑直播') {
              const data1 = this.ruleForm.startTime.substring(0, 10)
              const time1 = this.start
              var arr1 = [data1, time1]
              var data3 = arr1.join(' ')
              this.ruleForm.startTime = data3
              // const t1 = new Date(this.ruleForm.startTime).getTime()
              // const t2 = new Date().getTime()
              // const t3 = new Date(this.ruleForm.endTime).getTime()
              // if (t1 > t2) {
              //   this.$message.error('直播开始时间不能早于当前时间')
              //   return
              // }
              // if (t1 > t3) {
              //   this.$message.error('直播开始时间不能大于结束时间')
              //   return
              // }
              if (moment(this.ruleForm.startTime).isBefore(moment().format('YYYY-MM-DD HH:mm'))) {
                this.$message.error('直播开始时间不能早于当前时间')
                return
              }
              // this.timeLength = {}
              let timeLength = {
                ...this.timeLength,
                longtime: this.ruleForm.longtime
              }
              if (typeof timeLength === 'string') {
                // timeLength = timeLength
              } else {
                timeLength = JSON.stringify(timeLength)
              }
              const params = {
                ...this.ruleForm,
                id: this.roomId,
                timeLength
              }
              delete params.longtime
              isTrue = true
              const text = {
                text: '编辑'
              }
              this.updateLiveRoom({ params, text, refresh: this.refresh })
            }
          }

          // this.isCreate = false
        } else {
          // if (this.ruleForm.homePageUrl === '-') {
          //   // this.ruleForm.homePageUrl = ''
          // }
          console.log('error submit!!')
          return false
        }
      })
    },
    themeInstListSizeChange(v) {
      this.paging.pageSize = v
      // this.loadThemeInstList(this.paging.pageIndex)
      this.loadThemeInstList(0)
    },
    // 查询列表
    loadThemeInstList(params) {
      if (params instanceof Object) {
        params = {
          ...params,
          pageIndex: 0,
          pageSize: 10,
          tenantId: this.$store.getters.tenantId,
          orgId: this.$store.getters.orgId,
          uid: this.$store.getters.id
        }
      } else {
        params = {
          ...this.formObj,
          pageIndex: params > 0 ? params - 1 : 0,
          pageSize: this.paging.pageSize,
          tenantId: this.$store.getters.tenantId,
          orgId: this.$store.getters.orgId,
          uid: this.$store.getters.id

        }
      }
      query(params).then(res => {
        // console.log('res', res)
        if (res && res.data.errorCode === 0) {
          this.liveListData = res.data.results.map(item => {
          // item.qrCode = this.genQrCode(item.themeId, item.instId)
            return item
          })
          this.UPDATE_STATE({ liveListData: this.liveListData })
          this.paging = {
            pageSize: res.data.data.pageSize,
            resultCount: res.data.data.resultCount,
            pageIndex: res.data.data.pageIndex + 1,
            lastPageIndex: res.data.data.pageIndex + 1
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    showTableColumnFun() {
      let params
      if (location.hash === '#/user-inst/list') {
        params = {
          tableKey: 'h5_3',
          orgId: 0,
          tenantId: 0
        }
      } else {
        params = {
          tableKey: 'h5_2'
        }
      }
      showTableColumn(params).then(res => {
        if (res.errorCode === 0) {
          const columnSet = res.columnSet
          if (columnSet.length <= 0 && res.diy !== 'all') {
            this.checkboxVal = []
          } else {
            if (res.columnSet) {
              this.checkboxVal = JSON.parse(res.columnSet)
            }
          }
        }
      })
    },
    saveTableColumnFun() {
      const params = {
        tableKey: 'h5_3',
        columnSet: JSON.stringify(this.checkboxVal),
        orgId: 0,
        tenantId: 0
      }

      saveTableColumn(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message({
            type: 'success',
            message: res.data.errorMessage
          })
        } else {
          this.$message({
            type: 'info',
            message: res.errorMessage
          })
        }
      })
      this.visiable = false
    },

    handleSortChange(val) {
      if (val.prop === 'publishTime') { // 按照创建时间排序
        const createOrder = ''
        // eslint-disable-next-line

        const params = {
          createOrder: createOrder,
          name: this.formInline.name,
          author: this.formInline.author,
          cat: this.formInline.cat,
          type: this.formInline.type
        }
        this.$refs.tableCommon.getList(params)
      } else if (val.prop === 'name') { // 按照课件名称排序
        let nameOrder = ''
        // eslint-disable-next-line
        if (val.order == 'ascending') { // 升序
          nameOrder = '2'
          // eslint-disable-next-line
        } else if (val.order == 'descending') { // 降序
          nameOrder = '1'
        }
        const params = {
          nameOrder: nameOrder,
          name: this.formInline.name,
          author: this.formInline.author,
          cat: this.formInline.cat,
          type: this.formInline.type
        }
        this.$refs.tableCommon.getList(params)
      }
    },
    handleAvatarSuccess(index, res) {
      this.campusData.teachers[this.teachersIndex].teacherImg = res.response.url
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      }
    },
    // 直播封面
    handleLogoAvatarSuccess(res) {
      this.ruleForm.homePageUrl = res.url
      this.bgFilelist = [{ url: res.url }]
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      }
    },

    /* 背景图片查看 */
    handleBackImgeAvatarPreview(file) {
      this.ruleForm.homePageUrl = file.url
      this.bgFilelist = [{ url: file.url }]
      this.bgDialogVisible = true
    },

    /* 背景图片移除 */
    handleBackImgeAvatarRemove(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length < 1) {
          this.bgVisible = false
          this.ruleForm.homePageUrl = ''
          this.bgFilelist = []
          file.url
        } else {
          this.bgVisible = true
        }
      }
    },
    /* 背景图片改变 */
    handleBackImgeAvatarChange(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length === 1) {
          this.bgVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      // 图片
      const isLt2M = file.size / 1024 / 1024 < 2
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        this.$message.error('上传的图片只能是 png、jpg格式的图片')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2M')
        return false
      }
    },
    // 设置时长校验
    longTimeBlur(e) {
      if (Number(e.target.value) < 1) {
        this.ruleForm.longtime = 1
      } else {
        this.ruleForm.longtime = parseInt(Number(e.target.value))
        if (this.ruleForm.longtime > 999) {
          this.ruleForm.longtime = 999
        }
      }
      this.computedEndTime(this.timeLength.id)
    },
    // 计算结束时间
    computedEndTime(val) {
      // console.log('val', val)
      if (val === '01') {
        this.timeLength = {
          id: '01',
          name: '分钟'
        }
      } else if (val === '02') {
        this.timeLength = {
          id: '02',
          name: '小时'
        }
      }
      let data1
      if (!(this.ruleForm.startTime === '' && this.start === '')) {
        if (this.ruleForm.startTime.length > 10) {
          data1 = this.ruleForm.startTime.substring(0, 10)
        } else {
          data1 = this.ruleForm.startTime
        }
        const time1 = this.start
        var arr = [data1, time1]
        var data2 = ''
        data2 = arr.join(' ')
        // console.log(this.ruleForm, data2)
        if (val === '02') {
          this.ruleForm.endTime = moment(data2).add(this.ruleForm.longtime, 'h').format('YYYY-MM-DD HH:mm')
        } else if (val === '01') {
          this.ruleForm.endTime = moment(data2).add(this.ruleForm.longtime, 'm').format('YYYY-MM-DD HH:mm')
        }
      }
    },
    // 计算结束时间
    computetime(val, time) {
      if (val !== null) {
        let data1
        if (val.length > 10) {
          data1 = val.substring(0, 10)
        } else {
          data1 = val
        }
        const time1 = this.start
        var arr = [data1, time1]
        var data2 = ''
        data2 = arr.join(' ')
        // console.log(this.ruleForm, data2)
        if (this.timeLength.id === '02') {
          this.ruleForm.endTime = moment(data2).add(this.ruleForm.longtime, 'h').format('YYYY-MM-DD HH:mm')
        } else if (this.timeLength.id === '01') {
          this.ruleForm.endTime = moment(data2).add(this.ruleForm.longtime, 'm').format('YYYY-MM-DD HH:mm')
        }
      } else if (val === null && time) {
        let data1
        if (this.ruleForm.startTime.length > 10) {
          data1 = this.ruleForm.startTime.substring(0, 10)
        } else {
          data1 = this.ruleForm.startTime
        }
        const time1 = time
        var arr1 = [data1, time1]
        var data3 = ''
        data3 = arr1.join(' ')
        // console.log(this.ruleForm, data3)
        if (this.timeLength.id === '02') {
          this.ruleForm.endTime = moment(data3).add(this.ruleForm.longtime, 'h').format('YYYY-MM-DD HH:mm')
        } else if (this.timeLength.id === '01') {
          this.ruleForm.endTime = moment(data3).add(this.ruleForm.longtime, 'm').format('YYYY-MM-DD HH:mm')
        }
      }
    },

    /** 跳转微官网预约设置 */
    goOrderPage() {
      // this.$router.push({ name: 'wechatReservation', params: { orderForm: true }})
      this.$refs.reservationSettingDialog.reservationSettingDialogShow = true
    }
    // 设置人数校验
    // limintNumberBlur(e) {
    //   this.ruleForm.num = parseInt(Number(e.target.value))
    //   if (this.ruleForm.num < 1) {
    //     this.ruleForm.num = 1
    //   } else if (this.ruleForm.num > 50) {
    //     this.ruleForm.num = 50
    //   }
    // }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
      transition: opacity .5s
}
.fade-enter, .fade-leave-active {
      transition: all 0.5s ease;
}

</style>

<style lang="scss" scoped>

.formSub /deep/{
 .el-form-item__label{
      padding-right:0px !important;
 }
}
.addRoomTime{
  color: red;
  margin-left: 10px;
}
.hide{
  display: none !important;
}
.timer{
  .timer_tips{
    margin-bottom: 15px;
  }

  .residue_timer,
  .residue_tips{
    display: inline-block;
  }

  .residue_timer{
    margin-right: 18px;
    color: #333;
    font-size: 16px;
  }
  .residue_tips{
    color: #F56C6C;
    font-size: 14px;

    .residue_tips_icon{
      margin-right: 5px;
    }
  }

  .timer_wrap{
    display: inline-block;
    font-size: 14px;
    color: #333;
    margin-right: 20px;
  }
  .timeNum{
    font-size: 26px;
  }
  .none{
    color: #F56C6C;
  }
  .immediately{
    color: #E6A23C !important;
  }
  .btn_right{
    float: right;
  }
}
.service_content{
  text-align: center;
  color: #666;
  font-size: 14px;

  img{
    width: 100%;
    margin-bottom: 10px;
  }
}
  /* 筛选框 */
.checkList {
  max-height: 300px;
  overflow: auto;
  padding-left: 14px;
}
.checkList /deep/ {
  .el-checkbox-group {
    margin: 0 20px 10px 0;
  }
   .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #666666;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #46b6ee;
    border-color: #46b6ee;
  }
  .el-checkbox__inner:hover {
    border-color: #46b6ee;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #46b6ee;
    border-color: #46b6ee;
  }
}
.save_btn {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 14px;
  margin-top: 4px;
}
.courseware /deep/{
  padding: 20px 20px 0;
  //  height: calc(100vh - 68px);

.rubbish_table {
  background: #fff;
  position: relative;
}
.setting {
  position: absolute;
  top: 1px;
  right: 0;
  height: 44px;
  line-height: 44px;
  border-left: 1px solid #ddd;
  padding: 0 15px;
  background: #f0f2f5;
  cursor: pointer;
  z-index: 11;
  .setting_img {
    display: inline-block;
    position: relative;
    top: 0px;
    content: "";
  }
  &:hover .setting_img {
    color: #46b6ee;
  }
}
.rubbish_table /deep/{
  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }
  // .el-table{
  //  overflow: auto;
  // }
  .el-table th {
    background: #f6f7f9;
    font-size: 14px;
    padding: 0;
    color:#333;
    line-height:44px;
    font-weight:500;
    // font-weight: 500;
    // .is-leaf{
    //        border-bottom:none;
    // }
  }
  .el-table td {
    font-size: 14px;
    color: #666;
    line-height: 44px;
    padding: 0;
    font-weight: 400;
    height: 44px;
  }
 a{
    color: #1d9df2;
    font-weight: 500;
    margin-right: 20px;
  }

  .el-table__row.hover-row td {
    background: #ecf7fd;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #ecf7fd;
  }
  tr.el-table__row.el-table__row--striped:hover {
    background: #ecf7fd !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped {
    background: #fcfcfd;
  }
  .el-table-column--selection .cell {
    padding-left: 26px;
  }
  .el-table .cell {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    // height: 44px;
    // line-height: 44px;
  }
  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding-left: 20px;
  }
  /* 分页 start*/
  .el-pagination {
    text-align: end;
    padding: 7px 5px;
    color: #666;
    font-weight: normal;
    border-top: 1px solid #eee;
  }
  .el-input--mini .el-input__icon{
    line-height: 100%;
  }
  .el-pager {
    padding: 2px 0 !important;
  }
  .el-pager li.active {
    color: #fff;
    background: #46b6ee;
    border-radius: 4px;
    height: 18px;
    min-width: 18px;
    line-height: 18px;
    font-size: 12px;
  }
  .el-pager li.active:hover {
    color: #fff !important;
  }
  .el-pager li {
    height: 18px;
    font-size: 12px;
    min-width: 18px;
    line-height: 18px;
  }
  .el-pagination__sizes {
    height: 22px;
    line-height: 22px;
    margin: 0 10px;
  }
  .el-pagination .el-select .el-input {
    width: 89px;
  }
  .el-pagination__jump {
    margin-left: 10px;
    font-size: 12px;
    color: #666;
  }
  .el-pagination__editor.el-input .el-input__inner {
    height: 22px;
    width: 36px;
  }
  .el-pager li:hover {
    color: #46b6ee !important;
  }
  .el-pagination button,
  .el-pagination span:not([class*="suffix"]) {
    font-size: 12px;
  }
  .el-pagination__sizes .el-input .el-input__inner:hover {
    border-color: #46b6ee;
  }
  .el-pagination__jump .el-input .el-input__inner:focus {
    border-color: #46b6ee;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #46b6ee;
  }
  .el-select .el-input__inner:focus {
    border-color: #ddd;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #46b6ee;
  }
  .el-input--mini .el-input__inner {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    color: #666;
  }
}
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .wechatReservation-tip {
    background: rgba(247, 176, 70, 0.2);
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-bottom: 10px;
    color: #333;
    font-weight: 400;
    position: relative;
  }
   .iconl{
    width:1px;
    height:12px;
    display: inline-block;
    border-right: 1px solid #DDDDDD;
  }
  .formSub {
    margin-top: 20px;
    // height:auto;
    margin-bottom: 10px;
    // overflow: auto;
    background:rgba(240,242,245,0.6);
    padding: 20px 0px 20px 20px;
    .logo_explain {
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-top: 6px;

  }

  .disabled /deep/ .el-upload--picture-card {
    display: none;
   }
  .el-upload--picture-card i {
    margin-top: 31px;
    display: block;
    margin-left: -5px;
    font-size: 28px;
    color: #999999;
  }
  }
  .liveList{
    .btn{
        padding-bottom:20px;
     }
  }

}
</style>
<style lang="scss">
.courseware {
margin-right: 10px;
 height: calc(100vh - 35px);
}
</style>

