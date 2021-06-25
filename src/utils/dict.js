// 相关键值对字典
const Dict = {};

// 任务状态
Dict.taskStatus = [
  { label: '已创建', value: '已创建', status: 'primary' },
  { label: '准备开始', value: '准备开始', status: 'info' },
  { label: '分析中', value: '分析中', status: 'warning' },
  { label: '分析中止', value: '分析中止', status: 'danger' },
  { label: '分析异常', value: '分析异常', status: 'danger' },
  { label: '分析完成', value: '分析完成', status: 'success' }
];

// 任务类型
Dict.taskType = [
  { label: '域名', value: '域名', cls: 'fa fa-internet-explorer' },
  { label: 'IP', value: 'IP', cls: 'fa fa-info' },
  { label: 'URL', value: 'URL', cls: 'fa fa-link' },
  { label: '样本', value: '样本', cls: 'fa fa-bug' },
  { label: '邮箱', value: '邮箱', cls: 'fa fa-envelope' }
];

export default Dict;
