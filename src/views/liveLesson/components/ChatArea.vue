<template>
  <div class="chat_box">
    <el-tabs type="card">
      <el-tab-pane label="讨论区">
        <div>
          <ul id="msg_box" class="chat_list">
            <!-- <li
              v-if="hasMore && !msgLoading"
              class="has_more"
              @click="loadMore"
            >点击加载更多</li>
            <li v-if="msgLoading" class="has_more"><i class="el-icon-loading"/>加载中...</li> -->
            <li v-for="(msg, index) in msgs" :key="'msg'+index" :style="msg.uid === currentRow.uid ? {textAlign: 'right'} : {}">
              <div v-if="!msg.isSystem">
                <div
                  v-if="msg.uid === currentRow.uid"
                  class="chat_user_right">({{ msg.time }})<span>讲师</span><span>{{ msg.name }}</span></div>
                <div v-else class="chat_user">{{ msg.name }}<span>({{ msg.time }})</span></div>
                <div class="chat_text">{{ msg.text }}</div>
              </div>
              <div v-else class="system_text">
                <span>{{ `${msg.time} ${msg.name + msg.text}` }}</span>
              </div>
            </li>
          </ul>
          <div class="chat_edit">
            <!-- <el-checkbox-group v-model="checkList" class="chat_checkbox">
              <el-checkbox label="1">全体禁言</el-checkbox>
            </el-checkbox-group> -->

            <div class="send_box">
              <el-input v-model="chatValue" resize="none" type="textarea" placeholder="请输入聊天内容..." />
              <el-button :disabled="!chatValue || chatValue === ''" type="primary" @click="sendMsg">发送</el-button>
            </div>

          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">进入学员({{ memberNum }})</span>
        <ul class="stu_list">
          <li v-for="(item, index) in memberList" :key="'stu'+index">{{ item.nickName || '--' }}</li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    tic: {
      type: null,
      required: true
    },
    msgs: {
      type: Array,
      required: true
    },
    currentRow: {
      type: null,
      required: true
    }
  },

  data() {
    return {
      checkList: [],
      chatValue: ''
    }
  },

  computed: {
    ...mapState('liveLesson', [
      'msgLoading',
      'hasMore',
      'memberList',
      'memberNum'
    ])
  },

  methods: {
    ...mapActions('liveLesson', [
      'getMsgs'
    ]),

    /** 发送消息 */
    sendMsg() {
      const now = moment().format('HH:mm')
      const data = {
        time: now,
        name: this.currentRow.tname,
        text: this.chatValue
      }
      this.tic.sendGroupCustomMessage(JSON.stringify(data), (res) => {
        if (res.code !== 0) {
          this.$message.error('消息发送失败')
        }

        console.log('===发送信息:', res)
        this.chatValue = ''
      })
    },

    /** 加载更多 */
    loadMore() {
      this.$emit('loadMore')
    }
  }
}
</script>

<style lang="scss" scoped>
.chat_box /deep/{
  .el-tabs__nav-scroll{
    padding: 0;
  }
  .el-tabs__item{
    height: 50px;
    line-height: 50px;
    width: 50%;
    border: none;
    background: #F8F8F8;
    text-align: center;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    background: #fff;
  }
  .el-tabs__nav{
    width: 100%;
    border: none;
  }
  .el-tabs--card>.el-tabs__header{
    border: none;
    margin: 0;
  }
  .el-tabs__content{
    padding: 0;
  }
}

.chat_list{
  // height: calc(100vh - 219px); // 加上禁言高度
  height: calc(100vh - 190px);
  padding: 20px;
  overflow: auto;
  font-size: 12px;
  li+li{
    margin-top: 20px;
  }
  .chat_user{
    color: #666;
    span{
      color: #999;
      margin-left: 6px;
    }
  }
  .chat_user_right{
    color: #999;
    span{
      color: #666;
      margin-left: 6px;
    }
  }
  .chat_text{
    display: inline-block;
    color: #333;
    font-size: 14px;
    padding: 8px 10px;
    margin-top: 5px;
    background: #F0F2F5;
    border-radius:7px;
    text-align: left;
  }
  .system_text{
    text-align: center;
    span{
      display: inline-block;
      background: rgba(240,242,245,0.6);
      line-height: 21px;
      border-radius:11px;
      padding: 0 10px;
      color: #aaa;
    }
  }
  .has_more{
    color: #46b6ee;
    cursor: pointer;
    text-align: center;
  }
}

.chat_edit{
  border-top: 1px solid #eee;
  padding: 14px 20px;
  .chat_checkbox{
    margin-bottom: 10px;
  }
  .send_box /deep/{
    display: flex;
    .el-textarea__inner{
      height: 60px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .el-button--primary{
      height: 60px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}

.stu_list{
  height: calc(100vh - 116px);
  padding: 20px;
  overflow: auto;
  li+li{
    margin-top: 20px;
  }
}
</style>
