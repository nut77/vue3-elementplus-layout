// 导航配置
const COMPONENT_EMPTY_PATH = 'WrapperEmpty.vue';
// 管理员页面配置
const pageUserAdmin = {
  authority: ['管理员']
};
// 所有用户共有的页面
const pageUserAll = {
  authority: ['管理员', '普通用户']
};
// 独立的页面基本配置
const pageIndividual = {
  isNav: false,
  hasWrapperTop: false,
  hasWrapperLeft: false,
  ...pageUserAll
};
// 详情页基本配置
const pageDetail = {
  isNav: false,
  hasWrapperLeft: false
};
// 无子菜单页面基本配置
const hasWrapperTop = {
  hasWrapperLeft: false
};
const MENU_LIST = [
  // [1, '/', '/', COMPONENT_EMPTY_PATH, Object.assign({redirect: '/home'}, pageIndividual)],
  [1, '首页', '/home', 'home/Index.vue', {...hasWrapperTop, iconClass: 'el-icon-s-home'}],
  [1, '登录', '/login', 'login/Index.vue', pageIndividual],
  [1, '加载页', '/loading', 'loading/Index.vue', pageIndividual],
  [1, '错误页面', '/error', 'error/Index.vue', pageIndividual],
  [1, '订单管理', '/order', COMPONENT_EMPTY_PATH, {redirect: '/order/overview', iconClass: 'el-icon-sell'}, [
    [2, '订单概览', 'overview', 'orderManage/Overview.vue', {iconClass: 'el-icon-pie-chart'}],
    [2, '订单列表', 'list', 'orderManage/list/Index.vue', {iconClass: 'el-icon-tickets'}],
    [2, '订单详情', 'detail/:id', 'orderManage/OrderDetail.vue', pageDetail]
  ]],
  [1, '物流管理', '/logistics', COMPONENT_EMPTY_PATH, {redirect: '/logistics/overview', iconClass: 'el-icon-s-marketing'}, [
    [2, '物流概览', 'overview', 'logisticsManage/Overview.vue', {iconClass: 'el-icon-pie-chart'}],
    [2, '物流配置', 'setting', COMPONENT_EMPTY_PATH, {redirect: '/logistics/setting/company', iconClass: 'el-icon-edit-outline'}, [
      [3, '物流公司', 'company', 'logisticsManage/LogisticsSetting/LogisticsCompany.vue', {iconClass: 'el-icon-s-cooperation'}],
      [3, '渠道配置', 'channel', 'logisticsManage/LogisticsSetting/ChannelSetting.vue', {iconClass: 'el-icon-help'}]
    ]]
  ]],
  [1, '商品管理', '/commodity', COMPONENT_EMPTY_PATH, {redirect: '/commodity/overview', iconClass: 'el-icon-s-goods'}, [
    [2, '商品概览', 'overview', 'commodityManage/Overview.vue', {iconClass: 'el-icon-pie-chart'}],
    [2, '商品列表', 'list', 'commodityManage/List.vue', {iconClass: 'el-icon-tickets'}],
    [2, '商品详情', 'detail/:id', 'commodityManage/CommodityDetail.vue', pageDetail]
  ]],
  [1, '系统管理', '/system-manage', COMPONENT_EMPTY_PATH, {redirect: '/system-manage/customer', iconClass: 'el-icon-setting'}, [
    [2, '客户管理', 'customer', 'systemManage/Customer.vue', {iconClass: 'el-icon-s-custom'}],
    [2, '用户管理', 'user', 'systemManage/User.vue', {iconClass: 'el-icon-user'}],
    [2, '操作日志', 'log', 'systemManage/Log.vue', {...pageUserAdmin, iconClass: 'el-icon-notebook-2'}]
  ]]
];

export default MENU_LIST;
