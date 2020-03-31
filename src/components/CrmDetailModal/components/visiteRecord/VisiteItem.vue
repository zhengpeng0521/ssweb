<template>
  <div class="item">
    <h3 class="item-top">
      到访时间 :
      <span>{{ item.visitTime }}</span>
    </h3>
    <div class="item-leads-content">
      <div>
        <img
          :src="item.headimgurl || 'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'"
          alt="头像"
          class="leads-pic"
        >
      </div>
      <div class="leads-right">
        <p class="leads-username">{{ item.stuName }}</p>
        <p>
          <span class="leads-item-label">到访状态 :</span>
          <span class="leads-item-value leads-item-left">
            <span v-if="!item.status">--</span>
            <StatusPoint v-else-if="item.status === '0'" :color="'#D0021B'" :text="'已关闭'" />
            <StatusPoint v-else-if="item.status === '1'" :color="'#88C70A'" :text="'已到访'" />
            <StatusPoint v-else-if="item.status === '2'" :color="'#5D9CEC'" :text="'待跟进'" />
          </span>
        </p>
        <p class="leads-item-content">{{ item.content }}</p>
        <div v-if="item.status === '2'" class="leads-btns">
          <a v-if="hasBtn('404000003')" @click="openEdit('edit',item)">编辑</a>
          <Confirm
            v-if="item.sellerId && item.sellerId != '' && hasBtn('404000002')"
            :text="'确认'"
            :placement="'left'"
            :content="'更新为已到访？'"
            :confirm="()=>{updateStatus('1', item.id, item.sellerId)}"
            class="btn-text"
          />
          <a
            v-else-if="hasBtn('404000002')"
            :style="{marginRight: '20px'}"
            @click="openConfirm(item)"
          >确认</a>
          <Confirm
            v-if="hasBtn('404000004')"
            :text="'取消'"
            :placement="'left'"
            :content="'确定取消吗？'"
            :confirm="()=>{updateStatus('0', item.id)}"
          />
        </div>
      </div>
    </div>
    <ConfirmVisite ref="confirmVisite" :id="id" :refresh="refresh" />
  </div>
</template>

<script>
import Confirm from '@/components/MiniCommon/Confirm'
import StatusPoint from '@/components/MiniCommon/StatusPoint'
import ConfirmVisite from './ConfirmVisite'

export default {
  components: {
    Confirm,
    StatusPoint,
    ConfirmVisite
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    updateStatus: {
      type: Function,
      required: true
    },
    openEdit: {
      type: Function,
      required: true
    },
    refresh: {
      type: Function,
      required: true
    }
  },

  computed: {
    id() {
      return this.item.id
    }
  },

  methods: {
    openConfirm(item) {
      this.$refs.confirmVisite.show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.item {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
}
.item-top {
  border-bottom: 1px solid #ddd;
  background: #f4f6f8;
  padding: 0 20px;
  font-size: 14px;
  line-height: 32px;

  span {
    color: #333;
  }
}
.item-leads-content {
  padding: 20px;
  @include flex();
}
.leads-pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  background: #ddd;
}
.leads-right {
  // width: 100%;
  // width: 540px;
  width: 100%;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

.leads-username {
  font-size: 16px;
  color: #46b6ee;
  margin-bottom: 14px;
}
.leads-item-label {
  color: #999;
}
.leads-item-value {
  color: #666;
}
.leads-item-left {
  margin-right: 40px;
}
.leads-item-content {
  margin: 26px 0 20px;
}
.leads-btns {
  text-align: right;

  a {
    color: #46b6ee;

    &:first-child {
      margin-right: 20px;
    }
  }
}
.btn-text {
  margin-right: 20px;
}
</style>
