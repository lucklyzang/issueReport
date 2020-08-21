import request from '@/api/request';

// 查询运送类型
export function queryTransportType(data) {
  return request({
    url: 'taskType/queryAll',
    method: 'get',
    params: data
  })
};

// 查询运送类型分类
export function queryTransportTypeClass(data) {
  return request({
    url: 'taskTypeClass/queryAll',
    method: 'get',
    params: data
  })
};

// 查询目的地(科室)
export function queryAllDestination(proId) {
  return request({
    url: `department/dict/${proId}`,
    method: 'get'
  })
};

// 查询转运工具
export function queryTransportTools(data) {
  return request({
    url: 'tool/queryAll',
    method: 'get',
    params: data
  })
};

// 生成调度任务
export function generateDispatchTask(data) {
  return request({
    url: 'task/add',
    method: 'post',
    data
  })
};

// 查询调度任务(分配给本人的已完成)
export function getDispatchTaskComplete(data) {
  return request({
    url: 'task/queryTask',
    method: 'get',
    params: data
  })
};

// 取消原因查询
export function queryDispatchTaskCancelReason(data) {
  return request({
    url: 'cancel/queryAll',
    method: 'get',
    params: data
  })
};

// 调度任务的操作(取消)
export function updateDispatchTask(data) {
  return request({
    url: 'task/update',
    method: 'put',
    data
  })
};