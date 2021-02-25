<template>
	<view class="num-box">
		<view class="icon" @click="minus">-</view>
		<input type="number" v-model="val" class="ipt" />
		<view class="icon" @click="plus">+</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: [ Number, String ],
				default: 0
			},
			min: {
				type: [String, Number],
				default: 0
			},
			max: {
				type: [String, Number],
				default: ''
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				val: 0
			};
		},
		watch: {
			value: {
				immediate: true,
				handler (val) {
					this.val = val
					this.$emit('value', this.val)
					this.$emit('change', this.val)
				}
			},
			min: {
				immediate: true,
				handler (val) {
					if (this.val < val ) {
						this.val = val
						this.$emit('value', this.val)
						this.$emit('change', this.val)
					}
				}
			},
			val () {
				this.$emit('value', this.val)
				this.$emit('change', this.val)
			}
		},
		methods: {
			minus () {
				if (this.disabled) return
				if (this.val <= Number(this.min)) {
					return
				}
				this.val = (this._calcNum(this.val) - this._calcNum(this.step)) / 10
			},
			plus () {
				if (this.disabled) return
				if (this.max != '' && Number.isInteger(this.max) && ((this._calcNum(this.val) + this._calcNum(this.step)) / 10) > Number(this.max)) {
					return
				}
				this.val = (this._calcNum(this.val) + this._calcNum(this.step)) / 10
			},
			_calcNum (num) {
				return num * 10
			}
		}
	}
</script>

<style lang="less">
	.num-box {
		display: flex;
		.icon {
			width: 44upx;
			height: 44upx;
			line-height: 44upx;
			background: #338B61;
			border-radius: 50%;
			text-align: center;
			color: #FFFFFF;
		}
		.minus {
			
		}
		.ipt {
			margin: 0 20upx;
			width: 116upx;
			height: 50upx;
			font-size: 28upx;
			background: #FFFFFF;
			border: 2upx solid #338B61;
			opacity: 1;
			border-radius: 12upx;
			text-align: center;
			color: #338B61;
		}
		.plus {
			
		}
	}
</style>
