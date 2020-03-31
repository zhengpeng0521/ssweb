<template>
  <div>
    <div v-if="isShow" class="classSystem">
      <div class="banner" >
        <!-- <img
          src="http://img.ishanshan.com/gimg/n/20191023/e010364b158f406ccfc4e92eea88399e"> -->
      </div>
      <div class="title">
        <p>合作机构</p>
      </div>
      <!-- <Carouse ref="carouse"/> -->
      <!-- <div class="carouse">
        <div class="btn" @click="jumpPre">
          <span>  {{ fuhao }} </span>
        </div>
        <div id="box" class="box">
          <div :style="`transform:translate(${a}px)`" class="swiper_box">
            <div v-for="item in detailsItems" :key="item.id" class="box_item">
              <img :src="item.imgsrc" style="cursor:pointer;" @click="lookDetail(item.id)">
              <p class="box_title">{{ item.title }}</p>
              <p class="lookDetail" @click="lookDetail(item.id)">查看详情</p>
            </div>
          </div>
        </div>
        <div class="btn" @click="jumpNext"><span>></span>
        </div>
      </div> -->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div v-for="el in detailsItems" :key="el.id" class="swiper-slide">
            <img :src="el.imgsrc" class="img" style="cursor:pointer;" @click="lookDetail(el.id)">
            <p class="box_title">{{ el.title }}</p>
            <p class="lookDetail" @click="lookDetail(el.id)">查看详情</p>
          </div>
        </div>
        <div class="swiper-button-prev" /><!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-button-next"/><!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
      </div>
    </div>
    <classDetails ref="classDetails" :return-root-page="returnRootPage"/>
  </div>

</template>
<script>
import classDetails from './classDetails.vue'
import Swiper from 'swiper'
// import Carouse from './commponent/carouse.vue'

export default {
  components: {
    classDetails
    // Carouse
  },
  data() {
    return {
      isShow: true,
      fuhao: '<',
      a: 0,
      detailsItems: [
        {
          id: '0',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/131fa3eb1d75459f66bb10660c9b8eea',
          title: '棒棒贝贝'
        },
        {
          id: '1',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/8efd65a4c1b30cd7c9d45aa886be9577',
          title: '东书房'
        },
        {
          id: '2',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/79465fbfd08ea38811e8585486584e34',
          title: '绘智'
        },
        {
          id: '3',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/ffdd336be11c28940a978052c7081771',
          title: '鲸鱼机器人'
        },
        {
          id: '4',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/d1be610d6e5f0af8eca2d2c40d53a055',
          title: '乐码王国'
        },
        {
          id: '5',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/327d2d7bec91b8fa8bfc9824169ec8fe',
          title: '悦尔钢琴'
        },
        {
          id: '6',
          imgsrc: 'http://img.ishanshan.com/gimg/n/20191023/9e4a33c60d37a7f13d19bcf717728023',
          title: 'iKid'
        }

      ]
    }
  },
  watch: {
    isShow(val) {
      if (val === true) {
        this.$nextTick(function() {
          new Swiper('.swiper-container', {
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },
            slidesPerView: 4,
            spaceBetween: 20
          })
        })
      }
    }
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const with_ = window.screen.width
    let number
    console.log('width_', with_)
    if (with_ === 1366) {
      number = 4
    } else {
      number = 5
    }
    new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      slidesPerView: number,
      spaceBetween: 10
    })
  },
  methods: {
    lookDetail(id) {
      this.isShow = false
      this.$refs.classDetails.showPage(id)
    },
    returnRootPage() {
      this.isShow = true
    }
    // jumpNext() {
    //   const dom = document.getElementById('box')
    //   const box_width = dom.offsetWidth
    //   console.log('box_width', box_width)
    //   // Math.ceil(5/2)
    //   const num = Math.ceil(box_width / 300)
    //   console.log('num', num)
    //   if (this.a > -(7 - num) * 300) {
    //     this.a += -300
    //   }
    // },
    // jumpPre() {
    //   if (this.a < 0) {
    //     this.a += 300
    //   }
    // }

  }

}
</script>
<style>

</style>
<style lang="scss" scoped>
.classSystem /deep/{
  padding: 20px 20px;
  overflow-y: scroll;
  height: calc(100vh - 68px);
  min-width: 1060px;
   .swiper-container{
    --swiper-navigation-color: #333333;/* 单独设置按钮颜色 */
    --swiper-navigation-size: 25px;/* 设置按钮大小 */
    text-align: center;
  }
  .swiper-button-prev{
    left:0px;
  }
  .swiper-button-next{
    right: 0px;
  }
  .box_title{
     margin-top: 14px;
     font-size: 16px;
     color: #333333;
   }
   .lookDetail{
     margin-top: 30px;
     font-size: 14px;
     color: #46B6EE;
     cursor: pointer;
   }
  .banner{
    width: 100%;
    min-height: 300px;
    min-width: 1090px;
    overflow: hidden;
    background-image: url('http://img.ishanshan.com/gimg/n/20191023/e010364b158f406ccfc4e92eea88399e');
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
  }
   .title{
     margin-top: 40px;
     margin-bottom: 20px;
      p{
        text-align: center;
        font-size:18px;
        font-weight:500;
        color: #333333;
      }
    }
}
.carouse /deep/{
  display: flex;
  // align-items: center;
  .box{
    width: 100%;
    overflow: hidden;
    margin-left: 10px;
    // margin-right: 10px;
    .box_title{
     margin-top: 14px;
     font-size: 16px;
     color: #333333;
   }
   .lookDetail{
     margin-top: 30px;
     font-size: 14px;
     color: #46B6EE;
     cursor: pointer;
   }
  }

  .swiper_box{
    width: 2100px;
  }
  .box_item{
    margin-right: 80px;
    display: inline-block;
    text-align: center;
  }
  .btn{
    font-size: 20px;
    color: #999999;
    span{
        margin-top: 75px;
        display: block;
        cursor: pointer;
    }
  }
}
</style>

