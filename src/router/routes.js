// 路由配置
import MENU_LIST from './config';

/**
 * 界面导航配置
 * name 导航中文名
 * path 导航对应的路径
 * redirect 非必填，重定向地址
 * component 该页面组件
 * meta object-存一些额外的附件数据
 * meta-index number-导航层级，1表示一级导航，依次类推
 * meta-fullPath string-该页面全路径
 * meta-hasWrapperTop boolean-表示该页面是否具有顶部模块
 * meta-hasWrapperLeft boolean-表示该页面是否具有左侧模块
 * meta-iconClass 表示该导航模块应用的css-class,
 * meta-isNav boolean-是否是导航
 * meta-hasWrapperSubNav boolean-表示该页面是否具有子导航
 * meta-authority [string]-该页面所属用户权限（'管理员'、'普通用户'）
 */
const COMPONENT_EMPTY_PATH = 'WrapperEmpty.vue';
const components = getAllComponent();

/**
 * 生成上述路由配置
 * @param {number} index - 页面层级
 * @param {string} name - 页面名字
 * @param {string} path - 页面路径
 * @param {string} componentPath - 页面组件资源路径
 * @param {Object} [config={}] - 页面的其它配置参数
 * @param {Object[]} [children=[]] - 该页面的子组件配置
 */
function getMenuItemConfig(index, name, path, componentPath, config = {}, children = []) {
  const menuItemConfig = {
    name,
    path,
    component: loadComponent(componentPath || COMPONENT_EMPTY_PATH),
    meta: Object.assign(
      {
        index,
        fullPath: '',
        hasWrapperTop: true,
        hasWrapperLeft: true,
        hasWrapperSubNav: true,
        isNav: true,
        iconClass: '',
        authority: ['管理员', '普通用户']
      },
      config
    )
  };
  !config.fullPath && (menuItemConfig.meta.fullPath = path);
  if (config.redirect) menuItemConfig.redirect = config.redirect;
  if (children.length) menuItemConfig.children = [];
  for (const item of children) {
    const fullPath = menuItemConfig.meta.fullPath + '/' + item[2];
    // config 参数对应数组下标4, path 参数对应下标2，设置子页面全路径
    if (item[4]) {
      item[4].fullPath = fullPath;
    } else {
      item[4] = {fullPath};
    }
    menuItemConfig.children.push(getMenuItemConfig(...item));
  }
  return menuItemConfig;
}

function getRoutes() {
  const routes = [];
  for (const item of MENU_LIST) {
    routes.push(getMenuItemConfig(...item));
  }
  return routes;
}

/**
 * 懒加载所有路由相关的组件
 * import只支持字符串字面量，import.meta.glob也只能使用对象字面量
 */
function getAllComponent(componentPath) {
  const pages = import.meta.glob('/src/pages/**/**.vue');
  const empty = import.meta.glob(`/src/layout/WrapperEmpty.vue`);
  return {...pages, ...empty};
}

// 根据路由组件名拿到异步组件
function loadComponent(componentPath) {
  const key = (componentPath === COMPONENT_EMPTY_PATH ? '/src/layout/' : '/src/pages/') + componentPath;
  return components[key];
}
export default getRoutes();
