<template>
    <view class="light-hint" v-if="isShow">
			<image :src="type == 'success' ? passedPng : exclamationPointPng" alt=""></image>
			<text>{{message}}</text>
    </view>
</template>
 
<script>
export default {
  name: 'LightHint',
  props: {
    type: {
      type: String,
      default: "success"
    },
    message: {
      type: String,
      default: ""
    },
    duration: {
      type: Number,
      default: 3000000 //默认3000毫秒消失
    },
		isShow: {
			type: Boolean,
			default: false
		}
  },
  data() {
    return {
      exclamationPointPng: require("@/static/img/exclamation-point.png"),
      passedPng: require("@/static/img/passed.png")
    }
  },
	mounted () {
		this.show()
	},
  methods: {
    show() {
      setTimeout(this.hide, this.duration);//设置时间自动消失
    },
    hide() {
			this.$emit('hide')
    }
  }
};
</script>
<style lang="scss" scoped>
 .light-hint {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 216px;
    height: 48px;
    position: fixed;
    z-index: 1000;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    line-height: 30px;
    font-weight: bold;
    color: #101010;
    font-size: 14px;
		box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.4);
    text {
      vertical-align: middle;
      margin-left: 10px
    };
    image {
      vertical-align: middle;
      width: 24px;
      height: 24px
    }
  }
</style>