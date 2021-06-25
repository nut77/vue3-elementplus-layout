// element plus 自定义表单验证规则
import Tool from '@/utils/tool';
import systemManage from '@/api/systemManage';
const {checkUser, checkUnique} = systemManage;
/**
 * 表单验证前期工作 先验证是否是必填
 * @param {Object} rule - 表单项的相关属性
 * @param {string} [rule.field] - 表单项属性名
 * @param {boolean} [rule.message] - 表单项输入错误后的提示语句
 * @param {boolean} [rule.required] - 该表单项是否必填
 * @param {boolean} [rule.isUnique] - 该表单项需要做唯一性验证
 * @param {string} [rule.fieldType] - 表单项类型
 * @param {string} [rule.newPassword] - 新密码，一般确认密码才需要这个参数
 * @param {function|null} [handler = null] - 返回 除表单项是否必填验证后，其它后续验证工作过程中的错误信息
 */
async function validator(rule, value, callback, handler = null) {
  value = typeof value === 'string' ? value.trim() : value;
  const isValueEmpty = value === 0 ? false : !value;
  // 非必填且无值 不继续验证
  if (!rule.required && isValueEmpty) {
    callback();
    return false;
  }
  // 必填且无值 提示为空，不继续验证
  if (rule.required && isValueEmpty) {
    const msg = rule.message ? rule.message : `请输入${rule.fieldType || rule.field}`;
    callback(new Error(msg));
    return false;
  }
  const msg = handler ? await handler(value) : '';
  msg ? callback(new Error(msg)) : callback();
}

// 验证必填
const required = (rule, value, callback) => validator(rule, value, callback);

// 验证ip
const ip = (rule, value, callback) =>
  validator(rule, value, callback, async value => {
    let msg = !Tool.isIp(value) ? 'IP格式有误' : '';
    rule.isUnique && (await checkUnique('test')).data && (msg = 'IP已存在');
    return msg;
  });

// 验证域名
const domain = (rule, value, callback) =>
  validator(rule, value, callback, async value => {
    let msg = !Tool.isDomain(value) ? '域名格式有误' : '';
    rule.isUnique && (await checkUnique('test')).data && (msg = '域名已存在');
    return msg;
  });

// 验证HASH
const hash = (rule, value, callback) =>
  validator(rule, value, callback, async value => {
    let msg = !Tool.isHash(value) ? 'HASH格式有误' : '';
    rule.isUnique && (await checkUnique('test')).data && (msg = 'HASH已存在');
    return msg;
  });

// 验证端口
const port = (rule, value, callback) =>
  validator(rule, value, callback, value => {
    let msg = '';
    if (!Number.isInteger(value)) msg = '请输入整数值';
    if (!Tool.isPort(value)) msg = '端口范围有误';
    return msg;
  });

// 验证压缩包文件格式是否正确
const file = (rule, value, callback) =>
  validator(rule, value, callback, value => {
    let file;
    let msg = '';
    const dialogElements = document.querySelectorAll('.el-dialog__wrapper');
    for (const ele of dialogElements) {
      if (ele.style.display !== 'none') {
        file = ele.querySelector('.el-dialog-file');
        break;
      }
    }
    if (!/\.(zip)$/.test(value)) msg = '文件格式有误';
    if (file && file.files[0].size > 500 * 1024 * 1024) msg = '请上传500M以内的文件';
    return msg;
  });

// 验证邮箱账号
const email = (rule, value, callback) =>
  validator(rule, value, callback, async value => {
    if (!Tool.isEmail(value)) return '邮箱格式有误';
    if (rule.isUnique && (await checkUnique('test').data)) return '邮箱已存在';
  });
const emailArr = (rule, value, callback) =>
  validator(rule, value, callback, value => {
    const arr = value.split(',');
    for (const item of arr) {
      if (!Tool.isEmail(item)) {
        return '邮箱格式有误';
      }
    }
  });

// 用户名
const username = (rule, value, callback) =>
  validator(rule, value, callback, async value => {
    if (rule.isEdit) return '';
    const result = await checkUser(value);
    if (!!result && result.status === 200 && result.data) return '该用户名已存在';
  });

// 密码
const password = (rule, value, callback) =>
  validator(rule, value, callback, value => {
    const newPassword = rule.newPassword;
    const type = rule.fieldType || rule.field;
    const ERROR_MSG = {
      ILLEGAL: `${type}为8~20位大小写英文字母和数字（特殊字符可选）混合`,
      NOT_REPEAT: '确认密码和新密码不同',
      NOT_SAME: '两次输入密码不同'
    };
    if (!Tool.isValidPassword(value, false)) return ERROR_MSG.ILLEGAL;
    if (type === '确认密码' && value !== newPassword) return ERROR_MSG.NOT_REPEAT;
    if (type === '重复密码' && value !== newPassword) return ERROR_MSG.NOT_SAME;
  });

/**
 * 验证任务-分析目标格式是否正确
 * @param {string} [rule.targetType = ''] 本表单项依赖的上一项输入
 */
const taskTarget = (rule, value, callback) =>
  validator(rule, value, callback, value => {
    const type = rule.targetType;
    let msg = '';
    if (!type) msg = '请选择任务类型';
    if (type === '域名' && !Tool.isDomain(value)) msg = '输入的域名格式有误';
    if (type === 'IP' && !Tool.isIp(value)) msg = '输入的IP格式有误';
    if (type === 'URL' && !Tool.isUrl(value)) msg = '输入的URL格式有误';
    if (type === '样本' && !Tool.isHash(value)) msg = '输入的样本HASH格式有误';
    if (type === '邮箱' && !Tool.isEmail(value)) msg = '输入的邮箱格式有误';
    return msg;
  });

export default {
  required,
  ip,
  domain,
  email,
  emailArr,
  hash,
  port,
  file,
  taskTarget,
  username,
  password
};
