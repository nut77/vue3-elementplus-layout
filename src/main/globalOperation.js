// 需要全局引用的组件、指令、工具方法等

/**
 * 拿到指定路径下面的模块，减少index.js文件 路径不能用变量
 * @param {string} name
 * @return {Object}
 */
function getModules(name) {
  let modulesFiles = import.meta.globEager('/src/test/*.js');
  if (name === 'directives') modulesFiles = import.meta.globEager('/src/directives/*.js');
  if (name === 'utils') modulesFiles = import.meta.globEager('/src/utils/*.js');
  if (name === 'api') modulesFiles = import.meta.globEager('/src/api/*.js');
  if (name === 'components') modulesFiles = import.meta.globEager('/src/components/*.vue');

  return Object.keys(modulesFiles).reduce((modules, path) => {
    const key = path.replace(/.+\/(\w+)\.(js|vue)$/g, '$1');
    const mod = modulesFiles[path];
    modules[key] = mod.default || mod || {};
    return modules;
  }, {});
}

export default {
  install(app) {
    //this.registerDirectives(app);
    this.registerGlobalProperties(app);
    this.registerComponents(app);
  },
  // 注册指令
  registerDirectives(app) {
    const Directives = getModules('directives');
    for (const name in Directives) {
      app.directive(name.toLowerCase(), Directives[name]);
    }
  },
  // 将方法挂载在原型上
  registerGlobalProperties(app) {
    const GlobalProperties = {api: getModules('api'), ...getModules('utils')};
    for (const name in GlobalProperties) {
      app.config.globalProperties['$' + name] = GlobalProperties[name];
    }
  },
  // 注册全局组件
  registerComponents(app) {
    const Components = getModules('components');
    for (const name in Components) {
      // 设置组件名 组件名小写，英文单词间用短横线‘-’分隔
      const key = name.replace(/[A-Z]/g, (char, index) => {
        let res = char.toLowerCase();
        res = index > 0 ? `-${res}` : res;
        return res;
      });
      app.component(key, Components[name]);
    }
  }
};
