// mixins分发组件中可以复用的功能，extends扩展另一个组件（便于扩展单文件组件）
const modulesFiles = import.meta.globEager('/src/mixins/*.js');
export default Object.keys(modulesFiles).reduce((modules, path) => {
  const key = path.replace(/.+\/(\w+)\.(js|vue)$/g, '$1');
  if (key === 'index') return modules;
  const mod = modulesFiles[path];
  modules[key] = mod.default || mod || {};
  return modules;
}, {});
