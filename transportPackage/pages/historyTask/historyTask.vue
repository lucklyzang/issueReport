<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<view>
			<u-picker mode="time" v-model="startShow" :params="params" @confirm="startDateSure"></u-picker>
		</view>
		<view>
			<u-picker mode="time" v-model="endShow" :params="params" @confirm="endDateSure"></u-picker>
		</view>
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="历史任务" @backClick="backTo"></nav-bar>
		</view>
		<!--任务切换栏-->
		<view class="container-box">
			<u-sticky offset-top="90">
				<view class="task-switch">
					<text v-for="(item,index) in taskNameList" :class="{'active-tab-style':taskNameIndex === index}" :key="index" @click="tabSwitchEvent(item,index)">{{item.name}}</text>
				</view>
			</u-sticky>	
			<view class="historyTask-box">
				<view class="historyTask-list-box historyTask-list-dispatch-box" v-show="taskNameIndex == 0">
					<view class="time-change-box">
						<view class="time-change-text">至</view>
						<view class="time-change-left">
							<u-field @click="showActionStart"  v-model="dateStart" :disabled="true" right-icon="calendar"></u-field>
						</view>
						<view class="time-change-right">
							<u-field @click="showActionEnd" v-model="dateEnd" :disabled="true" right-icon="calendar"></u-field>
						</view>
					</view>
					<!-- <view class="search">
						<button @click="searchCompleteTask">搜索</button>
					</view> -->
					<view class="task-tail-content-box">
						<u-tabs :list="list" :is-scroll="false" font-size="35" bar-width="150" active-color="#2c9af1" inactive-color="#7d7d7d" :current="current" @change="tabChange"></u-tabs>
						<view class="task-tail-content" v-if="current == 0 && stateDispatchCompleteList.length > 0">
							<view class="task-tail-content-item"  v-for="(item,index) in stateDispatchCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
										<view class="number">
											<text>编号 : {{item.number}}</text>
										</view>
										<view class="priority" style="color:'#94e178'">
											<text>{{stateTransfer(item.state)}}</text>
										</view>
									</view>
									<view class="task-type-name">
										<view class="destination-point" v-if="templateType == 'template_one'">
											<text>运送类型 :</text>
											<text>{{item.taskTypeName ? item.taskTypeName : '无'}}</text>
										</view>
										<view class="destination-point" v-else-if="templateType === 'template_two'">
											<text>运送类型 :</text>
											<text>{{item.patientInfoList[0].typeList.length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="start-point">
											<text>出发地 :</text>
											<text>{{item.setOutPlaceName}}</text>
										</view>
										<view class="transport-type">
											<text>转运工具 :</text>
											<text>{{!item.toolName ? '无' : item.toolName}}</text>
										</view>
									</view>
									<view class="item-top-two">
										<view class="start-point">
											<text>优先级 :</text>
											<text>{{priorityTransfer(item.priority)}}</text>
										</view>
										<view class="bed-number" v-if="templateType === 'template_one'">
											<text>床号: </text>
											<text>{{item.bedNumber ? item.bedNumber : '无'}}</text>
										</view>
										<view class="bed-number" v-else-if="templateType === 'template_two'">
											<text>床号 :</text>
											<text>{{ extractBedNumber(item.patientInfoList) }}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people" v-if="templateType === 'template_one'">
											<text>住院号 :</text>
											<text>{{!item.patientNumber ? '无' : item.patientNumber}}</text>
										</view>
										<view class="transport-people" v-else-if="templateType === 'template_two'">
											<text>住院号 :</text>
											<text>{{item.patientInfoList.length > 0 ? item.patientInfoList[0]['number']:'无'}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>接触隔离 :</text>
											<text>无</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>订单创建时间 :</text>
											<text>{{!item.createTime ? '无' : item.createTime}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>完成时间 :</text>
											<text>{{!item.finishTime ? '无' : item.finishTime}}</text>
										</view>
									</view>
									<view class="item-top-four">
										<view class="bed-number">
											<text>目的地: </text>
											<text class="destina-list" v-for="(innerItem,innerIndex) in item.destinations" :key="innerIndex">{{innerItem.destinationName}}</text>
										</view>
									</view>
								</view>
								<view class="item-bottom">
									<!-- 反馈区域 -->
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
											<view class="right" v-if="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType === 'template_one' && item.feedbackFlag == 0">
												<view class="left-feedback-icon"  @click="feedBackEvent(item,index,1)">
													<u-icon name="arrow-down-fill" size="40" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
												</view>
												<view class="right-like-icon" @click="giveLikeEvent(item,index,1,'点赞')">
													<u-icon name="arrow-up-fill" size="40" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
													<text :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
														点赞
													</text>
												</view>
											</view>
											<view class="thank-feedback" v-if="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType === 'template_one'">
												感谢您的反馈!
											</view>
										</view>
										<view class="feedback-bottom" v-show="item.isShowFeedBack">
											<view class="idea-feedback">
												请输入你的反馈意见
											</view>
											<u-input :value="item.deedbackContent" @input="inputChange($event,item,index,1)" maxlength="2000" border placeholder="请输入你的反馈意见" type="textarea" height="200" :key="item.id" />
											<view class="guess-speak">
												猜你想说
											</view>
											<view class="guess-speak-list">
												<text v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex,1)" :key="innerItem.name">{{innerItem.name}}</text>
											</view>  
											<view class="submit-feedback" @click="submitTaskFeedBack(item,index,1,'反对')">
												提交反馈
											</view> 
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="task-tail-content" v-if="current == 1 && stateDispatchCompleteList.length > 0">
							<view class="task-tail-content-item" v-for="(item,index) in stateDispatchCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
											<view class="number">
												<text>编号 : {{item.number}}</text>
											</view>
											<view class="priority">
												<text>{{stateTransfer(item.state)}}</text>
											</view>
										</view>
										<view class="task-type-name">
											<view class="destination-point" v-if="templateType == 'template_one'">
												<text>运送类型 :</text>
												<text>{{item.taskTypeName ? item.taskTypeName : '无'}}</text>
											</view>
											<view class="destination-point" v-else-if="templateType === 'template_two'">
												<text>运送类型 :</text>
												<text>{{item.patientInfoList[0].typeList.length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="start-point">
												<text>出发地 :</text>
												<text>{{item.setOutPlaceName}}</text>
											</view>
											<view class="transport-type">
												<text>转运工具 :</text>
												<text>{{!item.toolName ? '无' : item.toolName}}</text>
											</view>
										</view>
										<view class="item-top-two">
											<view class="start-point">
												<text>优先级 :</text>
												<text>{{priorityTransfer(item.priority)}}</text>
											</view>
											<view class="bed-number" v-if="templateType === 'template_one'">
												<text>床号: </text>
												<text>{{item.bedNumber ? item.bedNumber : '无'}}</text>
											</view>
											<view class="bed-number" v-else-if="templateType === 'template_two'">
												<text>床号 :</text>
												<text>{{ extractBedNumber(item.patientInfoList) }}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people" v-if="templateType === 'template_one'">
												<text>住院号 :</text>
												<text>{{!item.patientNumber ? '无' : item.patientNumber}}</text>
											</view>
											<view class="transport-people" v-else-if="templateType === 'template_two'">
												<text>住院号 :</text>
												<text>{{item.patientInfoList.length > 0 ? item.patientInfoList[0]['number']:'无'}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>接触隔离 :</text>
												<text>无</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>订单创建时间 :</text>
												<text>{{!item.createTime ? '无' : item.createTime}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>完成时间 :</text>
												<text>{{!item.finishTime ? '无' : item.finishTime}}</text>
											</view>
										</view>
										<view class="item-top-four">
											<view class="bed-number">
												<text>目的地: </text>
												<text class="destina-list" v-for="(innerItem,innerIndex) in item.destinations" :key="innerIndex">{{innerItem.destinationName}}</text>
											</view>
										</view>
								</view>
								<view class="item-bottom">
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
										</view>	
									</view>	
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="historyTask-list-box historyTask-list-appoint-box" v-show="taskNameIndex == 1">
					<view class="time-change-box">
						<view class="time-change-text">至</view>
						<view class="time-change-left">
							<u-field @click="showActionStart"  v-model="dateStart" :disabled="true" right-icon="calendar"></u-field>
						</view>
						<view class="time-change-right">
							<u-field @click="showActionEnd" v-model="dateEnd" :disabled="true" right-icon="calendar"></u-field>
						</view>
					</view>
					<!-- <view class="search">
						<button @click="searchCompleteTask">搜索</button>
					</view> -->
					<view class="task-tail-content-box">
						<u-tabs :list="list" :is-scroll="false" font-size="35" bar-width="150" active-color="#2c9af1" inactive-color="#7d7d7d" :current="current" @change="tabChange"></u-tabs>
						<view class="task-tail-content" v-if="current == 0 && stateAppointCompleteList.length > 0">
							<view class="task-tail-content-item" v-for="(item,index) in stateAppointCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
										<view class="number">
											<text>编号 : {{item.taskNumber}}</text>
										</view>
										<view class="priority" style="color:'#94e178'">
											<text>{{stateTransfer(item.state)}}</text>
										</view>
									</view>
									<view class="task-type-name">
										<view class="destination-point">
											<text>检查类型 :	</text>
											<text>{{item.taskTypeName.length > 0 ? item.taskTypeName.join(";") : '无'}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="start-point">
											<text>出发地 :</text>
											<text>{{item.setOutPlaceName}}</text>
										</view>
										<view class="transport-type">
											<text>转运工具 :</text>
											<text>{{!item.toolName ? '无' : item.toolName}}</text>
										</view>
									</view>
									<view class="item-top-two">
										<view class="start-point">
											<text>优先级 :</text>
											<text>{{priorityTransfer(item.priority)}}</text>
										</view>
										<view class="bed-number">
											<text>床号: </text>
											<text>{{item.bedNumber}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>住院号 :</text>
											<text>{{!item.patientNumber ? '无' : item.patientNumber}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>接触隔离 :</text>
											<text>无</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>任务开始时间 :</text>
											<text>{{!item.startTime ? '无' : item.startTime}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>完成时间 :</text>
											<text>{{!item.finishTime ? '无' : item.finishTime}}</text>
										</view>
									</view>
									<view class="item-top-four">
										<view class="bed-number">
											<text>目的地: </text>
											<text></text>
											<text class="destina-list" v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{item.distName.length > 0 ? innerItem : '无'}}</text>
										</view>
									</view>
								</view>
								<view class="item-bottom">
									<!-- 反馈区域 -->
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
											<view class="right" v-if="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType === 'template_one' && item.feedbackFlag == 0">
												<view class="left-feedback-icon"  @click="feedBackEvent(item,index,2)">
													<u-icon name="arrow-down-fill" size="40" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
												</view>
												<view class="right-like-icon" @click="giveLikeEvent(item,index,2,'点赞')">
													<u-icon name="arrow-up-fill" size="40" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
													<text :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
														点赞
													</text>
												</view>
											</view>
											<view class="thank-feedback" v-if="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType === 'template_one'">
												感谢您的反馈!
											</view>
										</view>
										<view class="feedback-bottom" v-show="item.isShowFeedBack">
											<view class="idea-feedback">
												请输入你的反馈意见
											</view>
											<u-input :value="item.deedbackContent" @input="inputChange($event,item,index,2)" maxlength="2000" border placeholder="请输入你的反馈意见" type="textarea" height="200" :key="item.id"/>
											<view class="guess-speak">
												猜你想说
											</view>
											<view class="guess-speak-list">
												<text v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex,2)" :key="innerIndex">{{innerItem.name}}</text>
											</view>  
											<view class="submit-feedback" @click="submitTaskFeedBack(item,index,2,'反对')">
												提交反馈
											</view> 
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="task-tail-content" v-if="current == 1 && stateAppointCompleteList.length > 0">
							<view class="task-tail-content-item" v-for="(item,index) in stateAppointCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
											<view class="number">
												<text>编号 : {{item.number}}</text>
											</view>
											<view class="priority">
												<text>{{stateTransfer(item.state)}}</text>
											</view>
										</view>
										<view class="task-type-name">
											<view class="destination-point">
												<text>检查类型 : </text>
												<text>{{item.taskTypeName.length > 0 ? item.taskTypeName.join(";") : '无'}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="start-point">
												<text>出发地 :</text>
												<text>{{item.setOutPlaceName}}</text>
											</view>
											<view class="transport-type">
												<text>转运工具 :</text>
												<text>{{!item.toolName ? '无' : item.toolName}}</text>
											</view>
										</view>
										<view class="item-top-two">
											<view class="start-point">
												<text>优先级 :</text>
												<text>{{priorityTransfer(item.priority)}}</text>
											</view>
											<view class="bed-number">
												<text>床号: </text>
												<text>{{item.bedNumber}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>住院号 :</text>
												<text>{{!item.patientNumber ? '无' : item.patientNumber}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>接触隔离 :</text>
												<text>无</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>任务开始时间 :</text>
												<text>{{!item.createTime ? '无' : item.createTime}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>完成时间 :</text>
												<text>{{!item.finishTime ? '无' : item.finishTime}}</text>
											</view>
										</view>
										<view class="item-top-four">
											<view class="bed-number">
												<text>目的地: </text>
												<text class="destina-list" v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{item.distName.length > 0 ? innerItem : '无'}}</text>
											</view>
										</view>
								</view>
								<view class="item-bottom">
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
										</view>	
									</view>	
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="historyTask-list-box historyTask-list-circulation-box" v-show="taskNameIndex == 2">
					<view class="time-change-box">
						<view class="time-change-text">至</view>
						<view class="time-change-left">
							<u-field @click="showActionStart"  v-model="dateStart" :disabled="true" right-icon="calendar"></u-field>
						</view>
						<view class="time-change-right">
							<u-field @click="showActionEnd" v-model="dateEnd" :disabled="true" right-icon="calendar"></u-field>
						</view>
					</view>
					<!-- <view class="search">
						<button @click="searchCompleteTask">搜索</button>
					</view> -->
					<view class="task-tail-content-box">
						<u-tabs :list="list" :is-scroll="false" font-size="35" bar-width="150" active-color="#2c9af1" inactive-color="#7d7d7d" :current="current" @change="tabChange"></u-tabs>
						<view class="task-tail-content" v-if="current == 0 && stateCircleCompleteList.length > 0">
							<view class="task-tail-content-item" v-for="(item,index) in stateCircleCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
										<view class="number">
											<text>编号 : {{item.taskNumber}}</text>
										</view>
										<view class="priority" style="color:'#94e178'">
											<text>{{stateTransfer(item.state)}}</text>
										</view>
									</view>
									<view class="task-type-name">
										<view class="destination-point">
											<text>任务名称 :</text>
											<text>{{item.taskTypeName}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>预计开始时间 :</text>
											<text>{{!item.startTime ? '无' : item.startTime}}</text>
										</view>
									</view>
									<view class="item-top-three">
										<view class="transport-people">
											<text>实际开始时间 :</text>
											<text>{{!item.startUpTime ? '无' : item.startUpTime}}</text>
										</view>
									</view>
									<view class="dist-list">
										<text v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{innerItem.name}}</text>
									</view>
								</view>
								<view class="item-bottom">
									<!-- 反馈区域 -->
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
											<view class="right" v-if="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType === 'template_one' && item.feedbackFlag == 0">
												<view class="left-feedback-icon"  @click="feedBackEvent(item,index,3)">
													<u-icon name="arrow-down-fill" size="40" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
												</view>
												<view class="right-like-icon" @click="giveLikeEvent(item,index,3,'点赞')">
													<u-icon name="arrow-up-fill" size="40" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
													<text :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
														点赞
													</text>
												</view>
											</view>
											<view class="thank-feedback" v-if="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType === 'template_one'">
												感谢您的反馈!
											</view>
										</view>
										<view class="feedback-bottom" v-show="item.isShowFeedBack">
											<view class="idea-feedback">
												请输入你的反馈意见
											</view>
											<u-input :value="item.deedbackContent" @input="inputChange($event,item,index,3)" maxlength="2000" border placeholder="请输入你的反馈意见" type="textarea" height="200" :key="item.id"/>
											<view class="guess-speak">
												猜你想说
											</view>
											<view class="guess-speak-list">
												<text v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex,3)" :key="innerIndex">{{innerItem.name}}</text>
											</view>  
											<view class="submit-feedback" @click="submitTaskFeedBack(item,index,3,'反对')">
												提交反馈
											</view> 
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="task-tail-content" v-if="current == 1 && stateCircleCompleteList.length > 0">
							<view class="task-tail-content-item" v-for="(item,index) in stateCircleCompleteList" :key="item.id">
								<view class="item-top">
									<view class="item-top-one">
											<view class="number">
												<text>编号 : {{item.taskNumber}}</text>
											</view>
											<view class="priority">
												<text>{{stateTransfer(item.state)}}</text>
											</view>
										</view>
										<view class="task-type-name">
											<view class="destination-point">
												<text>任务名称 :</text>
												<text>{{item.taskTypeName}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>预计开始时间 :</text>
												<text>{{!item.startTime ? '无' : item.startTime}}</text>
											</view>
										</view>
										<view class="item-top-three">
											<view class="transport-people">
												<text>实际开始时间 :</text>
												<text>{{!item.startUpTime ? '无' : item.startUpTime}}</text>
											</view>
										</view>
										<view class="dist-list">
											<text v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{innerItem.name}}</text>
										</view>
								</view>
								<view class="item-bottom">
									<view class="feedback-area">
										<view class="feedback-top">
											<view class="left">
												<u-icon name="account-fill" size="50" />
												<text>运送人:</text>
												<text>{{item.workerName}}</text>
											</view>
										</view>	
									</view>	
								</view>
							</view>
						</view>
					</view>
				</view>	
			</view>
		</view>			
		<view class="bottom-bar">
			<bottom-bar :itemIndex="2" @itemEvent="clickEvent"></bottom-bar>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { getDate, checkEmptyArray } from '@/common/js/utils'
	import SOtime from '@/common/js/utils/SOtime.js'
	import {getDispatchTaskComplete,queryAppointTaskMessage,queryCirculationTask,queryFeedback,submitTaskFeedback} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components:{
			navBar
		},
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				startShow: false,
				endShow: false,
				dateStart: '',
				dateEnd: '',
				isFresh: false,
				content: '',
				showLoadingHint: false,
				noDataShow: false,
				taskNameList: [{name: '调度任务'},{name: '预约任务'},{name: '循环任务'}],
				taskCurrentName: '调度任务',
				guessSpeakList: [],
				taskNameIndex: 0,
				list: [{name: '已完成'}, {name: '已取消'}],
				stateDispatchCompleteList: [],
				stateAppointCompleteList: [],
				stateCircleCompleteList: [],
				current: 0
			}
		},
		onLoad (options) {
			this.taskTypeText = this.titleText
		},
		
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			this.isFresh = true;
			if (this.taskCurrentName == '调度任务') {
				if (this.current === 0) {
					this.queryCompleteDispatchTask(
						{
							proId:this.proId, workerId:'',state:7,
							startDate: this.dateStart, endDate: this.dateEnd,
							departmentId: this.userInfo.depId
						}
					)
				} else {
					this.queryCompleteDispatchTask(
						{
							proId:this.proId, workerId:'',state:6,
							startDate: this.dateStart, endDate: this.dateEnd,
							departmentId: this.userInfo.depId
						}
					)
				}
			}	else if (this.taskCurrentName == '预约任务') {
			  if (this.current == 1) {
			    this.queryCompleteAppointTask(
			      {
			        proId: this.proId, workerId: '', state: 6,
			        startDate: this.dateStart, endDate: this.dateEnd,
			        departmentId: this.userInfo.depId
			      }
			    )
			  } else {
			    this.queryCompleteAppointTask(
			      {
			        proId: this.proId, workerId: '', state: 7,
			        startDate: this.dateStart, endDate: this.dateEnd,
			        departmentId: this.userInfo.depId
			      }
			    )
			  }
			} else if (this.taskCurrentName == '循环任务') {
			  if (this.current == 1) {
			    this.queryCompleteCirculationTask(
			      {
			        proId: this.proId, workerId: '', state: 6,
			        startDate: this.dateStart, endDate: this.dateEnd,
			        departmentId: this.userInfo.depId
			      }
			    )
			  } else {
			    this.queryCompleteCirculationTask(
			      {
			        proId: this.proId, workerId: '', state: 7,
			        startDate: this.dateStart, endDate: this.dateEnd,
			        departmentId: this.userInfo.depId
			      }
			    )
			  }
			}
		},
		computed: {
      ...mapGetters([
        'titleText',
        'isToCallTaskPage',
        'userInfo',
				'templateType'
      ]),
			userName () {
				return this.userInfo.userName
			},
			proId () {
				return this.userInfo.extendData.proId
			},
			proName () {
				return this.userInfo.extendData.proName
			},
			workerId () {
				return this.userInfo.extendData.userId
			},
			accountName () {
				return this.userInfo.name
			}
		},
		
		mounted () {
			console.log('版本',this.$u.config.v);
			this.initDate();
			this.queryCompleteDispatchTask(
				{
				  proId:this.proId, workerId:'',state:7,
				  startDate: this.dateStart, endDate: this.dateEnd,
				  departmentId: this.userInfo.depId
				}
			)
		},
		
		methods: {
			...mapMutations([
				'changeTitleText',
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			
			// 触发日历显示事件开始日期
			showActionStart () {
				this.startShow = true
			},
			
			// 触发日历显示事件结束日期
			showActionEnd () {
				this.endShow = true
			},
			
			// 任务优先级转换
		  priorityTransfer (index) {
        switch(index) {
          case 0 :
          return '正常'
          break;
          case 1 :
          return '重要'
          break;
          case 2 :
          return '紧急'
          break;
          case 3 :
          return '紧急重要'
          break;
        }
		  },
		  
		  // 耗时
		  consueTime (t1,t2) {
			  if (t1 && t2) {
          return SOtime.time5(t1,t2)
			  }
		  },
						
			// 任务状态转换
			stateTransfer (index) {
				switch(index) {
				  case 0 :
					return '未分配'
					break;
				  case 1 :
					return '未查阅'
					break;
				  case 2 :
					return '未开始'
					break;
				  case 3 :
					return '进行中'
					break;
				  case 4 :
					return '未结束'
					break;
				  case 5 :
					return '已延迟'
					break;
				  case 6 :
					return '已取消'
					break;
				  case 7 :
					return '已完成'
					break;
				}
			},
			
			// 文本域输入框值改变事件
			inputChange ($event,item,index,type) {
				if (type == 1) {
					this.$set(this.stateDispatchCompleteList[index], 'deedbackContent', $event);
				} else if (type == 2) {
					this.$set(this.stateAppointCompleteList[index], 'deedbackContent', $event); 
				} else if (type == 3) {
					this.$set(this.stateCircleCompleteList[index], 'deedbackContent', $event); 
				}
			},
			
			// 提取床号
			extractBedNumber (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.bedNumber)
				};
				return temporaryArr.join("、")
			},

			//提取预约任务检查类型
			extractAppointTaskCheckType (checkItems) {
				let AppointTypeList = [];
				if (checkItems.length > 0) {
					for (let item of checkItems) {
						AppointTypeList.push(item.checkTypeName)
					}
				};
				return AppointTypeList
			},

			//提取预约任务目的地
			extractAppointTaskDist (checkItems) {
				let AppointDistList = [];
				if (checkItems.length > 0) {
					for (let item of checkItems) {
						AppointDistList.push(item.depName)
					}
				};
				return checkEmptyArray(AppointDistList)
			},
			
			// 反馈点击事件
			feedBackEvent(item,index,type) {
				if (type == 1) {
					this.stateDispatchCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateDispatchCompleteList[index]['isShowFeedBackIconStyle'];
					this.stateDispatchCompleteList[index]['isShowFeedBack'] = !this.stateDispatchCompleteList[index]['isShowFeedBack'];
					if (this.stateDispatchCompleteList[index]['isShowFeedBack']) {
						this.$set(this.stateDispatchCompleteList[index], 'deedbackContent', '');
						this.inquireFeedback({
							proId: this.proId,
							signFlag: 2,
							typeFlag: '',
							state: 1
						})
					}
				} else if (type == 2) {
					this.stateAppointCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateAppointCompleteList[index]['isShowFeedBackIconStyle'];
					this.stateAppointCompleteList[index]['isShowFeedBack'] = !this.stateAppointCompleteList[index]['isShowFeedBack'];
					if (this.stateAppointCompleteList[index]['isShowFeedBack']) {
						if (!this.stateAppointCompleteList[index]['deedbackContent']) {
							this.$set(this.stateAppointCompleteList[index], 'deedbackContent', '');
						};
						this.inquireFeedback({
							proId: this.proId,
							signFlag: 2,
							typeFlag: '',
							state: 1
						})
					}
				} else if (type == 3) {
					this.stateCircleCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateCircleCompleteList[index]['isShowFeedBackIconStyle'];
					this.stateCircleCompleteList[index]['isShowFeedBack'] = !this.stateCircleCompleteList[index]['isShowFeedBack'];
					if (this.stateCircleCompleteList[index]['isShowFeedBack']) {
						if (!this.stateCircleCompleteList[index]['deedbackContent']) {
							this.$set(this.stateCircleCompleteList[index], 'deedbackContent', '');
						};
						this.inquireFeedback({
							proId: this.proId,
							signFlag: 2,
							typeFlag: '',
							state: 1
						})
					}
				}
			},
			
			//提交反馈事件
			submitTaskFeedBack (item,index,type,text) {
				if (type == 1) {
					if (this.stateDispatchCompleteList[index]['isIssueFeedback']) {
						this.$refs.uToast.show({title:'该任务已反馈过',type:'waring'})
						return
					}
				} else if (type == 2) {
					if (this.stateAppointCompleteList[index]['isIssueFeedback']) {
						this.$refs.uToast.show({title:'该任务已反馈过',type:'waring'})
						return
					}
				} else if (type == 3) {
					if (this.stateCircleCompleteList[index]['isIssueFeedback']) {
						this.$refs.uToast.show({title:'该任务已反馈过',type:'waring'})
						return
					}
				};
				let data = {
					feedbackId : this.workerId, // 反馈者ID
					feedbackName : this.accountName, // 反馈者名称
					feedbackRole : '', //反馈角色，暂定为医务人员的 role 字段
					depId : this.userInfo.depId  , //反馈科室ID，医务人员depId字段
					depName:  this.userInfo.depName , //反馈科室名称医务人员depName字段
					content : '' , //反馈内容，可以为空，点赞默认为空
					type : 1, //反馈类型(1-意见反馈，2-赞)
					terminal : 2, //反馈终端(1-客户端，2-小程序)
					taskType : '', //任务类型-调度任务(1-调度任务，2-预约任务，3-循环任务)
					proId : this.proId, //所属项目ID，医务人员proId字段
					taskId : item.id, //任务ID
					isIssueFeedback: item.isIssueFeedback,
					feedbackFlag : item.feedbackFlag,
					taskNumber : item.number, //任务编号
					taskCreate : item.createTime, //调度任务创建时间
					taskStart : item.startTime, //调度任务开始时间
					taskFinish : item.finishTime, //调度任务结束时间
					taskState : 7, //调度任务状态
					taskPriority : item.priority, //调度任务优先级
					taskWorkerId : item.workerId, //运送员ID
					taskWorkerName : item.workerName //运送员姓名
				};
				if (type == 1) {
					data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
					data['taskStart'] = item.planStartTime ? item.planStartTime.slice(0,item.planStartTime.lastIndexOf(':')) : '';
					data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskType'] = type;
					data['content'] = this.stateDispatchCompleteList[index]['deedbackContent'];
					data['taskStartDep'] = '';
					data['taskCreateDep'] = item['setOutPlaceName'];
					if (this.userInfo.pc == 'template_one') {
						data['taskTransType'] = `${item.parentTypeName ? item.parentTypeName : ''}-${item.taskTypeName ? item.taskTypeName : ''}`;
					} else {
						if (item.patientInfoList.length > 0 && item.patientInfoList[0].typeList.length > 0) {
							let typeList = this.extractTransportTypeSmallClass(item.patientInfoList).join('、');
							data['taskTransType'] = `${item.patientInfoList[0].typeList[0].parentTypeName}-${typeList}`
						} else {
							data['taskTransType'] = ''
						}
					};
					data['taskTemplate'] = this.userInfo.pc == 'template_two' ? 2 : 1;
					this.submitFeedBackEvent(data,index,type,text)
				} else if (type == 2) {
					data['taskCreateDep'] = item['setOutPlaceName'];
					data['taskType'] = type;
					data['content'] = this.stateAppointCompleteList[index]['deedbackContent'];
					data['taskHospitalNo'] = item['patientNumber'] ? item['patientNumber'] : '';
					data['taskDistDepartments'] = item['distDepartments'] ? item['distDepartments'] : [];
					data['taskNumber'] = item['taskNumber'];
					this.submitFeedBackEvent(data,index,type,text)
				} else if (type == 3) {
					data['taskHasAccess'] = item.hasAccess;
					data['taskType'] = type;
					data['content'] = this.stateCircleCompleteList[index]['deedbackContent'];
					data['taskNumber'] = item['taskNumber'];
					data['taskName'] = item['taskTypeName'];
					data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
					data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskStart'] = item['startUpTime'] ? item['startUpTime'].slice(0,item['startUpTime'].lastIndexOf(':')) : '';
					data['taskStartTime'] = item['startTime'] ? item['startTime'].slice(0,item['startTime'].lastIndexOf(':')) : '';
					this.submitFeedBackEvent(data,index,type,text)
				} 
			},
			
			// 点赞事件
			giveLikeEvent(item,index,type,text) {
				if (type == 1) {
					if (this.stateDispatchCompleteList[index]['isShowGiveLikeIconStyle']) {return}
				} else if (type == 2) {
					if (this.stateAppointCompleteList[index]['isShowGiveLikeIconStyle']) {return}
				} else if (type == 3) {
					if (this.stateCircleCompleteList[index]['isShowGiveLikeIconStyle']) {return}
				};
				let data = {
					feedbackId : this.workerId, // 反馈者ID
					feedbackName : this.accountName, // 反馈者名称
					feedbackRole : '', //反馈角色，暂定为医务人员的 role 字段
					depId : this.userInfo.depId  , //反馈科室ID，医务人员depId字段
					depName:  this.userInfo.depName , //反馈科室名称医务人员depName字段
					content : '' , //反馈内容，可以为空，点赞默认为空
					type : 2, //反馈类型(1-意见反馈，2-赞)
					isIssueFeedback: item.isIssueFeedback,
					feedbackFlag : item.feedbackFlag,
					terminal : 2, //反馈终端(1-客户端，2-小程序)
					taskType : '', //任务类型-调度任务(1-调度任务，2-预约任务，3-循环任务)
					proId : this.proId, //所属项目ID，医务人员proId字段
					taskId : item.id, //任务ID
					taskNumber : item.number, //任务编号
					taskCreate : item.createTime, //调度任务创建时间
					taskStart : item.startTime, //调度任务开始时间
					taskFinish : item.finishTime, //调度任务结束时间
					taskState : 7, //调度任务状态
					taskPriority : item.priority, //调度任务优先级
					taskWorkerId : item.workerId, //运送员ID
					taskWorkerName : item.workerName //运送员姓名
				};
				if (type == 1) {
					data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
					data['taskStart'] = item.planStartTime ? item.planStartTime.slice(0,item.planStartTime.lastIndexOf(':')) : '';
					data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskType'] = type;
					data['taskStartDep'] = '';
					data['taskCreateDep'] = item['setOutPlaceName'];
					if (this.userInfo.pc == 'template_one') {
						data['taskTransType'] = `${item.parentTypeName ? item.parentTypeName : ''}-${item.taskTypeName ? item.taskTypeName : ''}`;
					} else {
						if (item.patientInfoList.length > 0 && item.patientInfoList[0].typeList.length > 0) {
							let typeList = this.extractTransportTypeSmallClass(item.patientInfoList).join('、');
							data['taskTransType'] = `${item.patientInfoList[0].typeList[0].parentTypeName}-${typeList}`
						} else {
							data['taskTransType'] = ''
						}
					};
					data['taskTemplate'] = this.userInfo.pc == 'template_two' ? 2 : 1;
					this.submitFeedBackEvent(data,index,type,text)
				} else if (type == 2) {
					data['taskCreateDep'] = item['setOutPlaceName'];
					data['taskType'] = type;
					data['taskHospitalNo'] = item['patientNumber'] ? item['patientNumber'] : '';
					data['taskDistDepartments'] = item['distDepartments'] ? item['distDepartments'] : [];
					data['taskNumber'] = item['taskNumber'];
					this.submitFeedBackEvent(data,index,type,text)
				} else if (type == 3) {
					data['taskHasAccess'] = item.hasAccess;
					data['taskType'] = type;
					data['taskNumber'] = item['taskNumber'];
					data['taskName'] = item['taskTypeName'];
				  data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
					data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskStart'] = item['startUpTime'] ? item['startUpTime'].slice(0,item['startUpTime'].lastIndexOf(':')) : '';
					data['taskStartTime'] = item['startTime'] ? item['startTime'].slice(0,item['startTime'].lastIndexOf(':')) : '';
					this.submitFeedBackEvent(data,index,type,text)
				} 
			},
			// 任务猜你想说项点击事件
			guessSpeakListEvent(index,innerItem,innerIndex,type) {
				this.$forceUpdate();
				if (type == 1) {
					if (this.stateDispatchCompleteList[index]['deedbackContent'].length == 0) {
						this.$set(this.stateDispatchCompleteList[index], 'deedbackContent', `${innerItem.name}`);
					} else {
						this.$set(this.stateDispatchCompleteList[index], 'deedbackContent', `${this.stateDispatchCompleteList[index]['deedbackContent']},${innerItem.name}`);
					}
				}	else if (type == 2) {
					if (this.stateAppointCompleteList[index]['deedbackContent'].length == 0) {
						this.$set(this.stateAppointCompleteList[index], 'deedbackContent', `${innerItem.name}`);
					} else {
						this.$set(this.stateAppointCompleteList[index], 'deedbackContent', `${this.stateAppointCompleteList[index]['deedbackContent']},${innerItem.name}`);
					}
				} else if (type == 3) {
					if (this.stateCircleCompleteList[index]['deedbackContent'].length == 0) {
						this.$set(this.stateCircleCompleteList[index], 'deedbackContent', `${innerItem.name}`);
					} else {
						this.$set(this.stateCircleCompleteList[index], 'deedbackContent', `${this.stateCircleCompleteList[index]['deedbackContent']},${innerItem.name}`);
					}
				}
			},
			
			// 查询任务反馈意见
			inquireFeedback (data) {
				this.guessSpeakList = [];
				queryFeedback(data).then((res) => {
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.guessSpeakList.push({
									name: item.content
								})
							}
						}
					} else {
						this.$refs.uToast.show({
						  title: `${res.data.msg}`,
						  type: 'warning'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
					  title: `${err.message}`,
					  type: 'warning'
					})
				})
			},
						
			// 提交意见反馈
			submitFeedBackEvent (data,index,type,text) {
				if (data.feedbackFlag == 1 || data.isIssueFeedback) {
					this.$refs.uToast.show({title:'该任务已反馈过',type:'waring'})
					return
				};
				submitTaskFeedback(data,type).then((res) => {
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
						  title: '意见反馈成功',
						  type: 'success'
						});
						if (type == 1) {
							if (text == '点赞') {
								this.stateDispatchCompleteList[index]['isShowGiveLikeIconStyle'] = !this.stateDispatchCompleteList[index]['isShowGiveLikeIconStyle'];
								this.stateDispatchCompleteList[index]['isShowFeedBackIconStyle'] = false;
								this.stateDispatchCompleteList[index]['isShowFeedBack'] = false;
							} else if (text == '反对') {
								this.stateDispatchCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateDispatchCompleteList[index]['isShowFeedBackIconStyle'];
								this.stateDispatchCompleteList[index]['isIssueFeedback'] = true;
								this.stateDispatchCompleteList[index]['isShowFeedBack'] = !this.stateDispatchCompleteList[index]['isShowFeedBack'];
							}
						}	else if (type == 2) {
							if (text == '点赞') {
								this.stateAppointCompleteList[index]['isShowGiveLikeIconStyle'] = !this.stateAppointCompleteList[index]['isShowGiveLikeIconStyle'];
								this.stateAppointCompleteList[index]['isShowFeedBackIconStyle'] = false;
								this.stateAppointCompleteList[index]['isShowFeedBack'] = false;
							} else if (text == '反对') {
								this.stateAppointCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateAppointCompleteList[index]['isShowFeedBackIconStyle'];
								this.stateAppointCompleteList[index]['isIssueFeedback'] = true;
								this.stateAppointCompleteList[index]['isShowFeedBack'] = !this.stateAppointCompleteList[index]['isShowFeedBack'];
							}
						} else if (type == 3) {
							if (text == '点赞') {
								this.stateCircleCompleteList[index]['isShowGiveLikeIconStyle'] = !this.stateCircleCompleteList[index]['isShowGiveLikeIconStyle'];
								this.stateCircleCompleteList[index]['isShowFeedBackIconStyle'] = false;
								this.stateCircleCompleteList[index]['isShowFeedBack'] = false;
							} else if (text == '反对') {
								this.stateCircleCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateCircleCompleteList[index]['isShowFeedBackIconStyle'];
								this.stateCircleCompleteList[index]['isIssueFeedback'] = true;
								this.stateCircleCompleteList[index]['isShowFeedBack'] = !this.stateCircleCompleteList[index]['isShowFeedBack'];
							}
						};
					} else {
						this.$refs.uToast.show({
						  title: `${res.data.msg}`,
						  type: 'warning'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
					  title: `${err.message}`,
					  type: 'warning'
					})
				})
			},
			
			// 任务类型tab切换事件
			tabSwitchEvent (item,index) {
				this.taskNameIndex = index;
				this.taskCurrentName = item.name;
				this.current = 0;
				if (this.taskCurrentName == '调度任务') {
					this.queryCompleteDispatchTask({
						proId:this.proId, workerId:'',state:7,
						startDate: this.dateStart, endDate: this.dateEnd,
						departmentId: this.userInfo.depId
					})
				} else if (this.taskCurrentName == '预约任务') {
					this.queryCompleteAppointTask(
						{
							proId: this.proId, workerId: '', state: 7,
							startDate: this.dateStart, endDate: this.dateEnd,
							departmentId: this.userInfo.depId
						}
					)
				} else if (this.taskCurrentName == '循环任务') {
					this.queryCompleteCirculationTask(
						{
							proId: this.proId, workerId: '', state: 7,
							startDate: this.dateStart, endDate: this.dateEnd,
							departmentId: this.userInfo.depId
						}
					)
				}
			},
			
			// tab切换改变事件
			tabChange (index) {
				if (SOtime.time6(this.dateEnd) < SOtime.time6(this.dateStart)) {
					this.$refs.uToast.show({
					  title: `结束日期不能小于开始日期`,
					  type: 'warning'
					});
					return
				};
				this.current = index;
				if (this.taskCurrentName == '调度任务') {
					if (index === 0) {
						this.queryCompleteDispatchTask(
							{
								proId:this.proId, workerId:'',state:7,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					} else {
						this.queryCompleteDispatchTask(
							{
								proId:this.proId, workerId:'',state:6,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					}
				}	else if (this.taskCurrentName == '预约任务') {
          if (index == 1) {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.dateStart, endDate: this.dateEnd,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.dateStart, endDate: this.dateEnd,
                departmentId: this.userInfo.depId
              }
            )
          }
        } else if (this.taskCurrentName == '循环任务') {
          if (index == 1) {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.dateStart, endDate: this.dateEnd,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.dateStart, endDate: this.dateEnd,
                departmentId: this.userInfo.depId
              }
            )
          }
        }
			},
			
			//提取调度任务运送类型小类
			extractTransportTypeSmallClass (transportTypeList) {
				let TransportTypeList = [];
				if (transportTypeList.length > 0) {
					for (let item of transportTypeList) {
						if (item.typeList.length > 0) {
							for (let innerItem of item.typeList) {
								TransportTypeList.push(innerItem['taskTypeName'])
							}
						}
					}
				};
				return TransportTypeList
			},
			
      // 搜索完成的任务
      searchCompleteTask () {
        if (this.taskCurrentName == '调度任务') {
					if (this.current == 0) {
						this.queryCompleteDispatchTask(
							{
								proId: this.proId, workerId: '', state: 7,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					} else {
						this.queryCompleteDispatchTask(
							{
								proId: this.proId, workerId: '', state: 6,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					}
				} else if (this.taskCurrentName == '预约任务') {
					if (this.current == 0) {
						this.queryCompleteAppointTask(
							{
								proId: this.proId, workerId: '', state: 7,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					} else {
						this.queryCompleteAppointTask(
							{
								proId: this.proId, workerId: '', state: 6,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					}
				} else if (this.taskCurrentName == '循环任务') {
					if (this.current == 0) {
						this.queryCompleteCirculationTask(
							{
								proId: this.proId, workerId: '', state: 7,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					} else {
						this.queryCompleteCirculationTask(
							{
								proId: this.proId, workerId: '', state: 6,
								startDate: this.dateStart, endDate: this.dateEnd,
								departmentId: this.userInfo.depId
							}
						)
					}
				}
      },
			  
      // 查询历史调度任务(已完成)
      queryCompleteDispatchTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
				this.stateDispatchCompleteList = [];
        getDispatchTaskComplete(data).then((res) => {
          this.showLoadingHint = false;
          if (this.isFresh) {
            uni.stopPullDownRefresh();
            this.isFresh = false
          };
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                this.stateDispatchCompleteList.push({
                  createTime: item.createTime,
                  responseTime: item.responseTime,
                  planStartTime: item.planStartTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskTypeName,
                  toolName: item.toolName,
                  finishTime: item.finishTime,
                  priority: item.priority,
                  id: item.id,
									parentTypeName: item.parentTypeName,
									feedbackFlag: item.feedbackFlag,
                  number: item.taskNumber,
									patientInfoList: item.patientInfoList,
                  distName: item.distName,
									startTime: item.startTime,
									workerId: item.workerId,
									deedbackContent: '',
									isShowFeedBack: false,
									isShowFeedBackIconStyle: false,
									isShowGiveLikeIconStyle: false,
									isIssueFeedback: false,
									destinations: item.destinations,
                  patientName: item.patientName,
									patientNumber: item.number,
                  bedNumber: item.bedNumber,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto,
                  isBack: item.isBack,
                  isSign: item.isSign,
                  workerName: item.workerName
                })
              };
							console.log('调度数据',this.stateDispatchCompleteList);
            } else {
              this.noDataShow = true
            }
          } else {
			this.$refs.uToast.show({
			   title: `${res.data.msg}`,
			   type: 'warning'
			}) 
		  }
        })
        .catch((err) => {
          this.$refs.uToast.show({
            title: `${err.message}`,
            type: 'error'
          });
          this.showLoadingHint = false;
          this.noDataShow = true;
          if (this.isFresh) {
            uni.stopPullDownRefresh();
            this.isFresh = false
          }
        })
      },
			
			// 查询历史预约任务(已完成)
			queryCompleteAppointTask (data) {
				this.noDataShow = false;
				this.showLoadingHint = true;
				this.stateAppointCompleteList = [];
				queryAppointTaskMessage(data).then((res) => {
					this.showLoadingHint = false;
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					};
					if (res && res.data.code == 200) {
						this.isRefresh = false;
						if (res.data.data.length > 0) {
							this.noDataShow = false;
							for (let item of res.data.data) {
								this.stateAppointCompleteList.push({
									createTime: item.createTime,
									planUseTime: item.planUseTime,
									planStartTime: item.planStartTime,
									state: item.state,
									setOutPlaceName: item.setOutPlaceName,
									taskNumber: item.taskNumber,
									destinationName: item.destinationName,
									taskTypeName: this.extractAppointTaskCheckType(item.checkItems),
									toolName: item.toolName,
									isIssueFeedback: false,
									priority: item.priority,
									feedbackFlag: item.feedbackFlag,
									patientNumber: item.hospitalNo,
									distDepartments: item.distDepartments,
									id: item.id,
									distName: this.extractAppointTaskDist(item.checkItems),
									deedbackContent: '',
									isShowFeedBack: false,
									isShowFeedBackIconStyle: false,
									isShowGiveLikeIconStyle: false,
									workerName: item.workerName,
									workerId: item.workerId,
									startTime: item.responseTime,
									finishTime: item.finishTime,
									patientName: item.patientName,
									bedNumber: item.badNumber,
									startPhoto: item.startPhoto,
									endPhoto: item.endPhoto,
									isBack: item.isBack,
									isSign: item.isSign
								});
								this.taskCount = this.stateAppointCompleteList.length;
							}
						} else {
							this.noDataShow = true
						}
					} else {
						this.$refs.uToast.show({
						   title: `${res.data.msg}`,
						   type: 'warning'
						}) 
					}
				})
				.catch((err) => {
				  this.$refs.uToast.show({
				    title: `${err.message}`,
				    type: 'error'
				  });
				  this.showLoadingHint = false;
				  this.noDataShow = true;
				  if (this.isFresh) {
				    uni.stopPullDownRefresh();
				    this.isFresh = false
				  }
				})
			},
			// 查询历史循环任务(已完成)
			queryCompleteCirculationTask (data) {
				this.noDataShow = false;
				this.showLoadingHint = true;
				this.stateCircleCompleteList = [];
				queryCirculationTask(data).then((res) => {
					this.showLoadingHint = false;
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					};
					if (res && res.data.code == 200) {
						this.isRefresh = false;
						if (res.data.data.length > 0) {
							this.noDataShow = false;
							for (let item of res.data.data) {
								this.stateCircleCompleteList.push({
									startTime: item.startTime,
									startUpTime: item.startUpTime,
									state: item.state,
									taskNumber: item.taskNumber,
									taskTypeName: item.taskTypeName,
									id: item.id,
									isIssueFeedback: false,
									workerId: item.workerId,
									deedbackContent: '',
									feedbackFlag: item.feedbackFlag,
									isShowFeedBack: false,
									isShowFeedBackIconStyle: false,
									isShowGiveLikeIconStyle: false,
									workerName: item.workerName,
									priority: item.priority,
									finishTime: item.finishTime,
									createTime: item.createTime,
									distName: Object.values(JSON.parse(item.hasAccess)),
									hasAccess: item.hasAccess
								});
								this.taskCount = this.stateCircleCompleteList.length
							};
						} else {
							this.noDataShow = true
						}
					} else {
						this.$refs.uToast.show({
						   title: `${res.data.msg}`,
						   type: 'warning'
						}) 
					}
				})
				.catch((err) => {
				  this.$refs.uToast.show({
				    title: `${err.message}`,
				    type: 'error'
				  });
				  this.showLoadingHint = false;
				  this.noDataShow = true;
				  if (this.isFresh) {
				    uni.stopPullDownRefresh();
				    this.isFresh = false
				  }
				})
			},
			
			// 初始化当前日期
			initDate () {
				this.dateStart = getDate();
				this.dateEnd = getDate()
			},
			
			// 返回上一页
			backTo () {
				this.changeBottomBarIndex(0);
				uni.redirectTo({
				    url: '/transportPackage/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			
			
			// 开始时间确定
			startDateSure(e) {
				this.dateStart = `${e.year}-${e.month}-${e.day}`;
				if (SOtime.time6(this.dateEnd) < SOtime.time6(this.dateStart)) {
					this.$refs.uToast.show({
					  title: `结束日期不能小于开始日期`,
					  type: 'warning'
					});
					return
				};
				this.searchCompleteTask()
			},
			
			// 结束日期确定
			endDateSure(e) {
				this.dateEnd = `${e.year}-${e.month}-${e.day}`;
				if (SOtime.time6(this.dateEnd) < SOtime.time6(this.dateStart)) {
					this.$refs.uToast.show({
					  title: `结束日期不能小于开始日期`,
					  type: 'warning'
					});
					return
				};
				this.searchCompleteTask()
			},
			
			clickEvent (item) {
				if (item.text == "呼叫下单") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo ({
							url: '/transportPackage/pages/callTask/callTask'
						});
						this.changeBottomBarIndex(0);
						this.changeIsToCallTaskPage(true)
					}
				} else if (item.text == "任务跟踪") {
					uni.redirectTo({
						url: '/transportPackage/pages/task-tail/task-tail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "历史任务") {
					uni.redirectTo({
						url: '/transportPackage/pages/historyTask/historyTask'
					});
					this.changeBottomBarIndex(2);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "意见反馈") {
					uni.redirectTo({
						url: '/transportPackage/pages/totalFeedbackIdea/totalFeedbackIdea'
					});
					this.changeBottomBarIndex(3);
					this.changeIsToCallTaskPage(true)
				} 
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		position: relative;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		.empty-info {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto
		};
		.nav {
			width: 100%;
		};
		.container-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: auto;
			/deep/ .u-sticky {
				background: #FFFFFF
			};
			.task-switch {
				width: 100%;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				height: 50px;
				>text {
					display: inline-block;
					font-size: 16px;
					color: #333;
					text-align: center;
					width: 30%;
					margin-right: 2%;
					line-height: 50px;
					height: 50px;
					z-index: 1000;
					&:last-child {
						margin-right: 0
					}
				};
				.active-tab-style {
					color: #2895ea;
					font-size: 17px;
					font-weight: bold;
					position: relative;
					&:after {
						content: '';
						position: absolute;
						bottom: 4px;
						left: 50%;
						transform: translateX(-50%);
						width: 26px;
						height: 4px;
						background: #2895ea;
						border-radius: 2px;
					}
				};
			};
			.historyTask-box {
				flex: 1;
				.historyTask-list-box {
					.time-change-box {
						height: 60px;
						width: 100%;
						padding: 10px;
						box-sizing: boredr-box;
						position: relative;
						.time-change-text {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 60px;
							line-height: 60px;
							text-align: center
						}
						.time-change-left {
							width: 45%;
							height: 100%;
							float: left;
							/deep/ .u-field {
								border: 1px solid #d8d7d7;
								padding: 5px 15px;
								.u-label {
									flex: 0 0 0 !important
								}
								.u-icon__icon {
									font-size: 26px !important
								}
							}
						};
						.time-change-right {
							width: 45%;
							height: 100%;
							float: right;
							/deep/ .u-field {
								border: 1px solid #d8d7d7;
								padding: 5px 15px;
								.u-label {
									flex: 0 0 0 !important
								}
								.u-icon__icon {
									font-size: 26px !important
								}
							}
						}
					}
					.search {
						width: 100px;
						height: 40px;
						margin: 0 auto;
						button {
							font-size: 14px;
							color: #fff;
							background: #278ee6
						}
					}
					.task-tail-content-box {
						width: 100%;
						flex: 1;
						-webkit-overflow-scrolling: touch;
						overflow: auto;
						/deep/ .u-tabs {
							.u-tab-bar {
								display: none !important;
							}
						};
						.task-tail-content {
							height: 94%;
							-webkit-overflow-scrolling: touch;
							overflow: auto;
							position: relative;
							background: #f7f7f7;
							.empty-info {
								position: absolute;
								top: 0;
								left: 0;
								bottom: 0;
								right: 0;
								margin: auto
							};
							.task-tail-content-item {
								background: #FFFFFF;
								width: 98%;
								margin: 0 auto;
								border-radius: 4px;
								padding-bottom: 10px;
								box-sizing: border-box;
								.item-top {
									width: 100%;
									font-size: 16px;
									display: inline-block;
									color: black;
									> view {
										padding: 6px 0;
										display: flex;
										box-sizing: border-box;
										flex-flow: row nowrap;
										> view {
											width: 50%;
											> text {
												&:last-child {
													padding-left: 0;
												}
											}
										}
									};
									.item-top-one {
										height:40px;
										background: #f9f9f9;
										display: flex;
										padding: 0;
										flex-flow: row nowrap;
										justify-content: space-between;
										align-items: center;
										> view {
											height: 20px;
											line-height: 20px;
											word-break: break-all;
											font-size: 13px;
											text {
												color: #333;
											};
											&:first-child {
												flex: 1;
												height: 40px;
												display: flex;
												justify-content: flex-start;
												align-items: center;
												-webkit-overflow-scrolling: touch;
												overflow: auto;
											};
											&:last-child {
												width: 60px;
												height: 40px;
												display: flex;
												justify-content: center;
												align-items: center;
												-webkit-overflow-scrolling: touch;
												> text {
													&:first-child {
														color: black
													};
													&:last-child {
														color: red;
														display: inline-block;
														width: 80px;
														text-align: center;
														background: #fff;
														border-radius: 4px;
													}
												}
											}
										}
									};
									.task-type-name {
										padding: 0 12px;
										margin-top: 6px;
										line-height: 20px;
										text-align: justify;
										>view {
											width: 100% !important;
											font-size: 17px;
											font-weight: bold;
											overflow: auto;
											>text {
												&:first-child {
													margin-right: 4px
												}
											}
										}
									};
									.item-top-two {
										height:40px;
										padding: 0 12px;
										> view {
											height: 40px;
											line-height: 40px;
											&:first-child {
												width: 60%;
												-webkit-overflow-scrolling: touch;
												overflow: auto;
												text {
													&:first-child {
														color: $color-text-left;
														margin-right: 4px
													};
													&:last-child {
														color: $color-text-right;
														font-weight: bold
													}
												}
											};
											&:last-child {
												width: 40%;
												-webkit-overflow-scrolling: touch;
												overflow: auto;
												text {
													&:first-child {
														color: $color-text-left;
														margin-right: 4px
													};
													&:last-child {
														color: $color-text-right;
														font-weight: bold
													}
												}
											}
										}
									};
									.item-top-three {
										height:40px;
										padding: 0 12px;
										> view {
											height: 40px;
											line-height: 40px;
											&:first-child {
												width: 60%;
												-webkit-overflow-scrolling: touch;
												overflow: hidden;
												text-overflow: ellipsis;
												white-space: nowrap;
												text {
													&:first-child {
														color: $color-text-left;
														margin-right: 4px
													};
													&:last-child {
														color: $color-text-right;
														font-weight: bold
													}
												}
											};
											&:last-child {
												width: 40%;
												-webkit-overflow-scrolling: touch;
												overflow: auto;
												text {
													&:first-child {
														color: $color-text-left;
														margin-right: 4px
													};
													&:last-child {
														color: $color-text-right;
														font-weight: bold
													}
												}
											}
										};
										.transport-people {
											width: 100% !important
										}
									};
									.item-top-four {
										 height:80px;
										 padding: 4px 12px;
										 back-sizing: border-box;
										 font-size: 15px;
										 background: #f7f7f7;
										 > view {
											height: 80px;
											width: 100%;
											-webkit-overflow-scrolling: touch;
											overflow: auto;
											.destina-list {
												color: $color-text-right;
												margin-right: 4px;
												font-weight: bold
											};
											text {
												display: inline-block;
												&:first-child {
													color: $color-text-left;
													margin-right: 4px
												};
											}
										};
									};
									.item-top-four-cancel {
										background: #FFF;
									}
								}
							}
						}
						.item-bottom {
							width: 100%;
							display: inline-block;
							 .feedback-area {
									display: flex;
									flex-direction: column;
									padding: 0 12px;
									box-sizing: border-box;
									.feedback-top {
										display: flex;
										flex-flow: row nowrap;
										justify-content: space-between;
										align-items: center;
										height: 60px;
										.left {
											flex: 1;
											height: 50px;
											line-height: 20px;
											word-break: break-all;
											display: flex;
											flex-flow: row nowrap;
											align-items: center;
											text {
												color: black;
												display: inline-block;
												&:nth-child(2) {
													font-size: 16px;
													margin: 0 2px;
												};
												&:nth-child(3) {
													font-size: 14px;
													height: 50px;
													display: flex;
													flex-flow: row nowrap;
													align-items: center;
													overflow: auto;
													flex: 1;
												}
											}
										};
										.right {
											display: flex;
											flex-flow: row nowrap;
											justify-content: space-between;
											align-items: center;
											height: 50px;
											width: 160px;
											padding: 0 8px;
											box-sizing: border-box;
											border: 1px solid #e2e2e2;
											border-radius: 30px;
											.left-feedback-icon {
												width: 50px;
												height: 50px;
												display: flex;
												flex-flow: row nowrap;
												justify-content: center;
												align-items: center;
												border-right: 1px solid #a59f9f;
											};
											.right-like-icon {
												flex: 1;
												text-align: center;
												text {
													font-size: 12px;
													color: #a59f9f;
													margin-left: 4px
												};
												.give-like-text-style {
													color: orange
												}
											}
										};
										.thank-feedback {
											display: flex;
											flex-flow: row nowrap;
											justify-content: space-between;
											align-items: center;
											height: 50px;
											padding: 0 8px;
											box-sizing: border-box;
											color: orange;
											font-size: 14px;
										}
									};
								.feedback-bottom {
									.idea-feedback {
										color: black;
										font-size: 13px;
										margin: 12px 0;
									};
									/deep/ .van-cell {
										border: 1px solid #dadada
									};
									.guess-speak {
										font-size: 12px;
										color: #a59f9f;
										margin: 12px 0;
									};
									.guess-speak-list {
											display: flex;
											flex-flow: row wrap;
											justify-content: flex-start;
											min-height: 80px;
											text {
												font-size: 13px;
												color: #a59f9f;
												display: inline-block;
												padding: 0 8px;
												box-sizing: border-box;
												height: 30px;
												border-radius: 20px;
												line-height: 30px;
												text-align: center;
												border: 1px solid #dcdfe6;
												margin: 0 8px 8px 0;
											}
									};
									.submit-feedback {
										width: 180px;
										height: 40px;
										background: orange;
										font-size: 13px;
										text-align: center;
										line-height: 40px;
										color: #fff;
										margin: 0 auto;
										margin-top: 12px;
										border-radius: 20px;
									}
								}
							}
						}
					}
				};
				.historyTask-list-circulation-box {
					.dist-list {
						display: flex;
						flex-flow: row wrap !important;
						justify-content: space-between;
						padding: 0 12px !important;
						>text {
							display: inline-block;
							padding: 6px 10px;
							box-sizing: border-box;
							width: 48%;
							margin-bottom: 10px;
							border: 1px solid #d5d5d5;
							font-size: 12px;
							color: #333;
							text-align: center
						}
					}
				}
			}
		}			
	};
	.bottom-bar {
		height: 50px;
		width: 100%;
	}
</style>