<template>
	<view class="num-box">
		<view class="subtract-box"
			@click.stop="plusNumEvent">
			<u-icon name="minus"></u-icon>
		</view>
		<input
			@click.stop="inpuntEvent"
			type="number"
			:disabled="disabled"
			:value="val"
			@input="stepperValChange"
		/>
		<view class="plus-box"
			@click.stop="minusNumEvent">
			<u-icon name="plus"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		model: {
		  prop: 'inputParentValue',
		  event: 'inputEvent'
		},
		props: {
			inputParentValue: {
				type: [ Number, String ],
				default: 0
			},
			min: {
				type: [String, Number],
				default: 0
			},
			max: {
				type: [String, Number],
				default: 100
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
			val: {
				immediate: true,
				handler (val) {
					this.$emit('inputEvent', val)
				}
			},
			min: {
				immediate: true,
				handler (val) {
					if (this.val < val ) {
						this.val = val
					}
				}
			},
			max: {
				immediate: true,
				handler (val) {
					if (this.val > val ) {
						this.val = val
					}
				}
			}
		},
		methods: {
			// 输入框点击事件
			inpuntEvent ($event) {
				this.$emit('inpuntClick',$event)
			},
			// input框获取焦点输入事件
			stepperValChange ($event) {
				this.val = $event.detail.value;
				this.$emit('inputEvent',$event.detail.value)
			},
			// 加号点击事件
			plusNumEvent ($event) {
				if (this.disabled) return;
				if (this.val >= Number(this.max)) {
					return
				};
				this.val += 1;
				this.$emit('plusNum',$event,this.val)
			},
			// 减号点击事件
			minusNumEvent ($event) {
				if (this.disabled) return;
				if (this.val <= Number(this.min)) {
					return
				};
				this.val -= 1
				this.$emit('minusNum',$event,this.val)
			}
		}
	}
</script>

<style lang="less">
	.num-box {
		height: 100%;
		position: absolute;
		top: 0;;
		width: 55%;
		right: 0;
		display: flex;
		flex-flow: row nowrap;
		.subtract-box  {
			width: 30px;
			height: 33px;
			background: #d2d2d2;
			line-height: 33px;
		};
		input {
			flex: 1;
			height: 100%;
			background: #a7a7a7;
		};
		.plus-box  {
			width: 30px;
			height: 33px;
			background: #d2d2d2;
			line-height: 33px
		}
	}
</style>
