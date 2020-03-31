<template>
  <div id="detailPage" class="detailPage">
    <div v-if="isVisible">
      <div class="return" @click="returnPage"><div class="span"><svg-icon icon-class="left"/>&nbsp;返回</div><span>品牌介绍</span></div>
      <div class="content">
        <!-- <p class="head">品牌介绍</p> -->
        <div class="img_head" >
          <img :src="headimg_src">
        </div>
        <div v-for="item in images" :key="item.id" class="imgs">
          <img :src="item.src">
        </div>
        <div class="footer">
          <img src="http://img.ishanshan.com/gimg/n/20191024/4fa3da1c9ecb064e851cec078d22fa49">
          <p class="text">微信扫码，加入合作</p>
          <p class="number">客服热线：400-660-5733</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    'returnRootPage': {
      type: Function,
      default: false
    }

  },
  data() {
    return {
      isVisible: false,
      id: '',
      headimg_src: '',
      images: [],
      fuhao: '<'
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showPage(id) {
      this.id = id
      this.isVisible = true
      switch (id) {
        case '0': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/77bfdfafacdca5ba94b3ef4aea27f91f'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/72de1c8bd32dc72b47ab8be7269bf851'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/239838514fbb5314f44f532b932597c5'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/a8b53016db33ccc3b9ab9b2272a3b1a6'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/d4d3e11e96da98a1c33f56b97884ccc0'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/504f659f4f5d18a5d6e72b6eb9fd52ef'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/be7ccf17614b894f765f592d8294772c'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/a4bb4971f64b56715f2974d806bc0e18'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/0b2b3bdadcde2926d3ee79721e2f89ab'
            }
          ]
          break
        case '1': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/5fff6e074ef2d4d6ef37c8649a1e0805'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/da26b47ecb65df3089b64a71ceabd6ca'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/3e28a196a048b066046c023c2cf7f08e'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/e7f8dd9b993d23c896f029ea6d4a9b02'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/e55ff0716481d08011643df26ea8a2f0'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/870e55678c795540ea675a19328bd855'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/f113e49cf05a536ed75de511f5fd48c1'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/0df11e2794cfc78d5b869078ce8c05b9'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/c99ad1aae62bd762bdc95a8f75983bdf'
            }
          ]
          break
        case '2': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/6543f5820bee478d51e4699dfa745992'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/7a132921ff1ad1d52b4d8a0a6d0a9dee'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/04457fadb9fcc7709dc0eea7b02f282e'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/ecbdf3b3c56b471b9cea5e473cb5c3dc'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/a12ea5471d0287ed54a2471246f06326'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/bde42248380b8678aae0529dbb88e25a'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/03b8c2606ecf57633de9776fe4729ae7'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/0a2deb09753550623e2e5b7da0f5bcfd'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/5b3ba4248f4523c78889c6ab93d3920c'
            }
          ]
          break
        case '3': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/0ad772aab076aa69d897972f4adc7a24'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/6dbdcbc7cf467cb56aa26d34593d9011'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/b418e897fc9efe51f4cbc090f5b3481f'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/cf14a02ddcdb99568663ee6def067f01'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/49a77714badaee5e32ae283be085666b'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/c0450c2c461dd3c1971529834a46f30e'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/6e789b90d07cc8451a99f39dc6463d96'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/e635c96488b28ebf2e5d9743ba773957'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/927a94154ad1566b76e751351a885b9f'
            }
          ]
          break
        case '4': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/dcf782238889203c1165b46009178fe8'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/33e09cac1cb3bb1583a513fa129bca46'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/6f4b1e77c75812c01e24e719bc5c65f7'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/ea1629d3b4d91a08740cb8d802668733'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/a88831aa407d7aa3ceec22d9d7664690'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/7d35e0016975d049d285144c7cc9ede3'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/cdcab0c790b8a64a854e811677b7823b'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/d9955d2420e708dac8fc4fe21381dd63'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/a25e0ff03abab78648f079866a49953c'
            }
          ]
          break
        case '5': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/7c09291fcf3b04e9aaf3919babca12b5'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/d04b4a7cd96a21517d160269e7506243'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/c7927a24499776ff715d19e002cd3ef5'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/35e7cf6621e8b91402e6846a2d8fa723'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/b65a146d4b3f8439480a6563fe308353'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/d6229689e90f5b8745bd0b2dec357cb3'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/14cde371fe4100d8e74d8e2a5b255a3e'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/cdf17baba61ed0ca2b6adb6f70a89db8'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/af83a853174276714b71fbdda26b99b1'
            }
          ]
          break
        case '6': this.headimg_src = 'http://img.ishanshan.com/gimg/n/20191024/7960ec4a677735e5c88e8d6bb2f03a4c'
          this.images = [
            {
              id: '0',
              src: 'http://img.ishanshan.com/gimg/n/20191024/b7190b06d5f7611cb9b0fc80ae38c01d'
            },
            {
              id: '1',
              src: 'http://img.ishanshan.com/gimg/n/20191024/51df2974aaadbcb24710a53534782219'
            },
            {
              id: '2',
              src: 'http://img.ishanshan.com/gimg/n/20191024/54a6d31422114121e71e03c9abe5bc22'
            },
            {
              id: '3',
              src: 'http://img.ishanshan.com/gimg/n/20191024/ebbb5298465dd00e4351a30c7318350f'
            },
            {
              id: '4',
              src: 'http://img.ishanshan.com/gimg/n/20191024/e722c177cd7b708e42e312131c4b604a'
            },
            {
              id: '5',
              src: 'http://img.ishanshan.com/gimg/n/20191024/9cf477785cf10484955a052e513dee0e'
            },
            {
              id: '6',
              src: 'http://img.ishanshan.com/gimg/n/20191024/652d75c37862167ad280992f26049de3'
            },
            {
              id: '7',
              src: 'http://img.ishanshan.com/gimg/n/20191024/db1f14c696d0ae783bf5f93f07dacb92'
            }
          ]
          break
      }
    },
    returnPage() {
      this.isVisible = false
      this.returnRootPage()
    }
  }
}
</script>
<style lang="scss" scoped>
.detailPage{
 .return{
   padding: 20px 20px;
   border-bottom: 1px solid #dedede;
   text-align: center;
   font-size: 16px;
    color: #333333;
    position: relative;
   .span{
    font-size: 14px;
    display: inline-block;
    color: #666666;
    cursor: pointer;
    position: absolute;
    left: 20px;
      &:hover {
      color: #46B6EE;
    }
   }
 }
 .content{
  overflow-y: scroll;
  height: calc(100vh - 168px);
   text-align: center;
    .head{
   text-align: center;
   font-size: 18px;
   color: #333333;
   font-weight:500;
   margin-top: 6px;
    position: relative;
 }
img{vertical-align:top;}
  .img_head{
    margin-top: 40px;
    // padding-top: 100px;
    margin-bottom: 30px;
  }
 }
 .footer{
   margin-top: 40px;
   img{
     margin-bottom: 20px;
   }
   .text{
     font-size: 18px;
     color: #333333;
     font-weight: 500;
   }
   .number{
     margin-top: 16px;
     font-size: 14px;
     color:#46B6EE;
     font-weight:500;
   }
   text-align: center;
 }
}
</style>
