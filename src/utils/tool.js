// 通用的工具方法，可移植到任意系统
import {ElMessage as Message} from 'element-plus';

/**
 * 当前系统localstorage 是否有token
 * @return  {boolean}
 */
const hasToken = () => {
  const token = localStorage.token;
  return !!(token !== 'null' && token);
};

/**
 * Shows the message. 显示提示
 * @param {string} [type] - 提示框类型
 * @param {string} [text] - 提示文字
 * @param {number} [duration=3000] - 提示框持续时间
 * @param {Object} [config] - 提示框其它配置
 */
const showMessage = (type, text, duration = 3000, config = {}) => {
  hasToken() &&
    Message({
      type: type || 'success',
      showClose: false,
      customClass: '',
      duration,
      message: text,
      ...config
    });
};

/**
 * Hides the message. 关闭提示框
 */
const hideMessage = () => {
  Message.closeAll();
};

/**
 * 对象深拷贝
 * @param {Object|array} obj - 要拷贝的对象
 * @return {Object} 拷贝后的对象
 */
const objectDeepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * formatByteSize. 字节大小格式化
 * @param {(null|string|number)} byteSize - 字节大小
 * @return {string} 格式化后的值
 */
const formatByteSize = byteSize => {
  if (byteSize == null || byteSize === '' || !byteSize) {
    return '0B';
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcSize = parseFloat(byteSize);
  index = Math.floor(Math.log(srcSize) / Math.log(1024));
  let size = srcSize / Math.pow(1024, index);
  size = size.toFixed(2);
  return size + unitArr[index];
};

/**
 * 按指定格式-格式化时间
 * @param {string} fmt - 时间格式化方式
 * @param {boolean} [hasWeek=false] - 是否显示星期
 * @return {string} 格式化后的时间
 * @example
 * new Date().format("yyyy-MM-dd hh:mm:ss")
 */
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt, hasWeek = false) {
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    // 季度
    'q+': Math.floor((this.getMonth() + 3) / 3),
    // 毫秒
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  }

  return fmt + (hasWeek ? '&nbsp;&nbsp;&nbsp;&nbsp;' + weekday[this.getDay()] : '');
};

/**
 * 日期格式化
 * @param {Date|number|string} val - Date实例或者是时间戳
 * @param {string} [type='YYYY-MM-DD hh:mm:ss'] - 日期格式
 * @param {number} [granularity=1] 分粒度 默认为1，若为10可能显示为 10:10 10:20等
 * @return {string} 格式化后的时间
 */
const formatDate = (val, type = 'YYYY-MM-DD hh:mm:ss', granularity = 1) => {
  const date = val instanceof Date ? val : new Date(/^[0-9]*$/g.test(val) ? val * 1 : Date.now());
  const YYYY = date.getFullYear() + '';
  const m = date.getMonth() + 1;
  const MM = m > 9 ? m + '' : '0' + m;
  const d = date.getDate();
  const DD = d > 9 ? d + '' : '0' + d;
  const h = date.getHours();
  const hh = h > 9 ? h + '' : '0' + h;
  const $m = Math.ceil(date.getMinutes() / granularity) * granularity;
  const mm = $m > 9 ? $m + '' : '0' + $m;
  const s = date.getSeconds();
  const ss = s > 9 ? s + '' : '0' + s;
  const obj = {
    YYYY,
    MM,
    DD,
    hh,
    mm,
    ss
  };

  return type.replace(/(YYYY)|(MM)|(DD)|(hh)|(mm)|(ss)/g, key => obj[key]);
};

/**
 * 判断输入的域名格式是否正确
 * @param {string} str - 待判断的域名
 * @return {boolean}
 * @example
 * isDomain('www.123.co')
 */
const isDomain = str => {
  // 先做一个简单的域名格式判断，下一个正则虽然判断的更全面但是效率很低，如果字符串长了很浪费时间 // (([a-z0-9\\-]{2,}\\[?\\.\\]?)+
  const regFirst = /[a-zA-Z0-9][a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][a-zA-Z0-9]{0,62})+\.?/;
  if (!regFirst.test(str)) return false;

  // eslint-disable-next-line
  const reg =
    '(^([a-z0-9]{2,}.)+(abogado|ac|academy|accountants|active|actor|ad|adult|' +
    'ae|aero|af|ag|agency|ai|airforce|al|allfinanz|alsace|am|amsterdam|an|android|ao|aq|aquarelle' +
    '|ar|archi|army|arpa|as|asia|associates|at|attorney|au|auction|audio|autos|aw|ax|axa|az|ba' +
    '|band|bank|bar|barclaycard|barclays|bargains|bayern|bb|bd|be|beer|berlin|best|bf|bg|bh|bi' +
    '|bid|bike|bingo|bio|biz|bj|black|blackfriday|bloomberg|blue|bm|bmw|bn|bnpparibas|bo|boo' +
    '|boutique|br|brussels|bs|bt|budapest|build|builders|business|buzz|bv|bw|by|bz|bzh|ca|cal' +
    '|camera|camp|cancerresearch|canon|capetown|capital|caravan|cards|care|career|careers|cartier' +
    '|casa|cash|cat|catering|cc|cd|center|ceo|cern|cf|cg|ch|channel|chat|cheap|christmas|chrome' +
    '|church|ci|citic|city|ck|cl|claims|cleaning|click|clinic|clothing|club|cm|cn|co|coach' +
    '|codes|coffee|college|cologne|com|community|company|computer|condos|construction|consulting' +
    '|contractors|cooking|cool|coop|country|cr|credit|creditcard|cricket|crs|cruises|cu|cuisinella' +
    '|cv|cw|cx|cy|cymru|cz|dabur|dad|dance|dating|day|dclk|de|deals|degree|delivery|democrat|dental' +
    '|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|dnp|do|docs' +
    '|domains|doosan|durban|dvag|dz|eat|ec|edu|education|ee|eg|email|emerck|energy|engineer|engineering' +
    '|enterprises|equipment|er|es|esq|estate|et|eu|eurovision|eus|events|everbank|exchange|expert' +
    '|exposed|fail|farm|fashion|feedback|fi|finance|financial|firmdale|fish|fishing|fit|fitness' +
    '|fj|fk|flights|florist|flowers|flsmidth|fly|fm|fo|foo|forsale|foundation|fr|frl|frogans|fund' +
    '|furniture|futbol|ga|gal|gallery|garden|gb|gbiz|gd|ge|gent|gf|gg|ggee|gh|gi|gift|gifts|gives' +
    '|gl|glass|gle|global|globo|gm|gmail|gmo|gmx|gn|goog|google|gop|gov|gp|gq|gr|graphics|gratis' +
    '|green|gripe|gs|gt|gu|guide|guitars|guru|gw|gy|hamburg|hangout|haus|healthcare|help|here|hermes' +
    '|hiphop|hiv|hk|hm|hn|holdings|holiday|homes|horse|host|hosting|house|how|hr|ht|hu|ibm|id|ie|ifm' +
    '|il|im|immo|immobilien|in|industries|info|ing|ink|institute|insure|int|international|investments' +
    '|io|iq|ir|irish|is|it|iwc|jcb|je|jetzt|jm|jo|jobs|joburg|jp|juegos|kaufen|kddi|ke|kg|kh|ki|kim' +
    '|kitchen|kiwi|km|kn|koeln|kp|kr|krd|kred|kw|ky|kyoto|kz|la|lacaixa|land|lat|latrobe|lawyer|lb' +
    '|lc|lds|lease|legal|lgbt|li|lidl|life|lighting|limited|limo|link|lk|loans|london|lotte|lotto' +
    '|lr|ls|lt|ltda|lu|luxe|luxury|lv|ly|ma|madrid|maison|management|mango|market|marketing|marriott' +
    '|mc|md|me|media|meet|melbourne|meme|memorial|menu|mg|mh|miami|mil|mini|mk|ml|mm|mn|mo|mobi|moda' +
    '|moe|monash|money|mormon|mortgage|moscow|motorcycles|mov|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz' +
    '|na|nagoya|name|navy|nc|ne|net|network|neustar|new|nexus|nf|ng|ngo|nhk|ni|ninja|nl|no|np|nr|nra' +
    '|nrw|ntt|nu|nyc|nz|okinawa|om|one|ong|onl|ooo|org|organic|osaka|otsuka|ovh|pa|paris|partners|parts' +
    '|party|pe|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictures|pink|pizza|pk|pl|place' +
    '|plumbing|pm|pn|pohl|poker|porn|post|pr|praxi|press|pro|prod|productions|prof|properties|property' +
    '|ps|pt|pub|pw|qa|qpon|quebec|re|realtor|recipes|red|rehab|reise|reisen|reit|ren|rentals|repair' +
    '|report|republican|rest|restaurant|reviews|rich|rio|rip|ro|rocks|rodeo|rs|rsvp|ru|ruhr|rw|ryukyu' +
    '|sa|saarland|sale|samsung|sarl|sb|sc|sca|scb|schmidt|schule|schwarz|science|scot|sd|se|services' +
    '|sew|sexy|sg|sh|shiksha|shoes|shriram|si|singles|sj|sk|sky|sl|sm|sn|so|social|software|sohu|solar' +
    '|solutions|soy|space|spiegel|sr|st|style|su|supplies|supply|support|surf|surgery|suzuki|sv|sx|sy' +
    '|sydney|systems|sz|taipei|tatar|tattoo|tax|tc|td|technology|tel|temasek|tennis|tf|tg|th|tienda|tips' +
    '|tires|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|toshiba|town|toys|tp|tr|trade|training|travel' +
    '|trust|tt|tui|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung' +
    '|vet|vg|vi|viajes|video|villas|vision|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wales|wang|watch' +
    '|webcam|website|wed|wedding|wf|whoswho|wien|wiki|williamhill|wme|work|works|world|ws|wtc|wtf|xyz|yachts' +
    '|yandex|ye|yoga|yokohama|youtube|yt|za|zm|zone|zuerich|zw)$)';
  return new RegExp(reg).test(str);
};

/**
 * 判断输入的密码格式是否正确（密码为8到20位的大小写字母、数字和特殊字符混合）
 * @param {string} pwd - 待判断密码
 * @param {boolean} [isMustSpecialChar = true] - 是否必须包含特殊字符
 * @return {boolean}
 */
const isValidPassword = (pwd, isMustSpecialChar = true) => {
  let count = 0;
  // 判断密码长度是8-20位
  if (pwd.length >= 8 && pwd.length <= 20) ++count;

  // 判断密码是否包含大写字母
  if (/[A-Z]+/.test(pwd)) ++count;

  // 判断密码是否包含小写字母
  if (/[a-z]+/.test(pwd)) ++count;

  // 判断密码是否包含数字
  if (/[0-9]+/.test(pwd)) ++count;

  if (!isMustSpecialChar) return count === 4;

  // 判断密码是否包含特殊字符
  // eslint-disable-next-line
  if (/[~@#%\+\-=\/\(_\)\*\&\<\>\[\"\;\'\|\$\^\?\!.\{\}\`]+/.test(pwd)) ++count;

  return count === 5;
};

/**
 * 判断输入的电话号码格式是否正确
 * @param {string} phone - 电话号码
 * @return {boolean}
 */
const isPhone = phone => {
  const reg = /^1[3|4|5|8][0-9]\d{8}$/;
  return reg.test(phone);
};

/**
 * 判断输入的ip格式（包含模糊匹配）是否正确
 * @param {string} str - 待判断的IP
 * @return {boolean}
 * @example
 * isIp('192.168.33.22')
 * @example
 * isIp('192.168.33.22/89')
 * @example
 * isIp('192.168.33.*')
 */
const isIp = str => {
  // 判断是否是正确的IP格式 192.136.23.6 192.136.23.*
  const isIp = function (str) {
    const reg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return str.charAt(0) !== '0' && reg.test(str);
  };

  // 这里是IP段的分割，后面最好做智能判断
  const ipArr = str.split('/');
  if (ipArr.length === 1) {
    const ipParts = ipArr[0].split('.');
    return ipParts[ipParts.length - 1] === '*' ? true : isIp(ipArr[0]);
  } else if (ipArr.length === 2) {
    if (isIp(ipArr[0])) {
      const ipStart = ipArr[0].split('.')[3];
      const ipEnd = ipArr[1];
      return !!(parseInt(ipStart) < parseInt(ipEnd) && parseInt(ipEnd) >= 255);
    }
    return false;
  }
};

/**
 * 判断输入的字符串或内容是端口
 * @param {string|number} str - 待判断的端口
 * @return {boolean}
 */
const isPort = str => {
  str = str * 1;
  return Number.isInteger(str) && !(str < 0 || str >= 65535);
};

/**
 * 判断输入hash格式是否正确（16/32/64/128/256位）
 * @param {string} str - 待判断的hash
 * @param {array[number]} [lengthArr=[16, 32, 64, 128, 256]] - hash长度
 * @return {boolean}
 */
const isHash = (str, lengthArr = [16, 32, 64, 128, 256]) => {
  // const reg = /^([A-Fa-f0-9]{16}|[A-Fa-f0-9]{32}|[A-Fa-f0-9]{64}|[A-Fa-f0-9]{128}|[A-Fa-f0-9]{256})$/;
  return lengthArr.includes(str.length) && /^[A-Fa-f0-9]*$/.test(str);
};

/**
 * @feature 判断输入的邮箱（email）格式是否正确
 * @param {string} 123@qq.com
 * @return {boolean}
 */
const isEmail = str => {
  // eslint-disable-next-line
  // const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  // const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
};

/**
 * 判断输入的字符串是否是url
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
const isUrl = str => {
  // eslint-disable-next-line no-useless-escape
  return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(
    str
  );
};

/**
 * 判断输入的字符串是否是uri
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
const isUri = str => {
  return /^\/[\s\S]+/.test(str.replace(/(^\s*)|(\s*$)/g, ''));
};

/**
 * 判断输入的文件名是否是指定类型
 * @param {string} str - 待判断的字符串
 * @param {string} mimeType - 文件大类，格式参见MIME
 * @param {string|string[]} specifiedType - 特定类型，填入文件后缀名
 * @return {boolean}
 */
const isSpecifiedFile = (str, mimeType, specifiedType = []) => {
  // todo
  return /^\/[\s\S]+/.test(str.replace(/(^\s*)|(\s*$)/g, ''));
};

/**
 * 根据输入的国家中文名 输出该国家国旗路径
 * @param {string} nation - 输入的国家中文名
 * @param {string} [basePath='/'] - 图片基础路径
 * @return {string}
 * @example
 * getNationalFlagSrc('中国')
 */
const getNationalFlagSrc = (nation, basePath = process.env.BASE_URL + 'nationalFlag/') => {
  nation = nation || '';
  const nationWithFlagPath = {
    本地局域网: 'bdjyw.png',
    内网IP: 'bdjyw.png',
    中国: 'zg.png',
    香港: 'zg.png',
    台湾: 'zg.png',
    澳门: 'zg.png',
    日本: 'rb.png',
    韩国: 'hg.png',
    美国: 'mg.png',
    俄罗斯: 'els.png',
    朝鲜: 'cx.png',
    老挝: 'lw.png',
    印度: 'yd.png',
    印尼: 'yn.png',
    约旦: 'yued.png',
    缅甸: 'md.png',
    蒙古: 'mgu.png',
    不丹: 'bd.png',
    泰国: 'tg.png',
    越南: 'yuen.png',
    阿曼: 'am.png',
    也门: 'ym.png',
    沙特: 'st.png',
    阿富汗: 'afh.png',
    阿联酋: 'alq.png',
    巴林: 'bl.png',
    科威特: 'kwt.png',
    土耳其: 'teq.png',
    文莱: 'wl.png',
    黎巴嫩: 'lbn.png',
    孟加拉: 'mjl.png',
    新加坡: 'xjp.png',
    格鲁吉亚: 'gljy.png',
    马尔代夫: 'medf.png',
    伊朗: 'yl.png',
    以色列: 'ysl.png',
    叙利亚: 'xly.png',
    卡塔尔: 'kte.png',
    柬埔寨: 'jpz.png',
    塞浦路斯: 'spls.png',
    土库曼: 'tkm.png',
    尼泊尔: 'nbe.png',
    乌兹别克: 'wzbk.png',
    伊拉克: 'ylk.png',
    哈萨克: 'hsk.png',
    斯里兰卡: 'sllk.png',
    马来西亚: 'mlxy.png',
    菲律宾: 'flb.png',
    巴勒斯坦: 'blst.png',
    加蓬: 'jp.png',
    亚美尼亚: 'ymny.png',
    埃及: 'aj.png',
    多哥: 'dg.png',
    刚果: 'gg.png',
    加纳: 'jn.png',
    马里: 'ml.png',
    中非: 'zf.png',
    苏丹: 'sd.png',
    卢旺达: 'lwd.png',
    安哥拉: 'agl.png',
    佛得角: 'fdj.png',
    冈比亚: 'gby.png',
    吉布提: 'jbt.png',
    利比亚: 'lby.png',
    科麦隆: 'kml.png',
    科摩罗: 'keml.png',
    莱索托: 'lst.png',
    尼日尔: 'nre.png',
    突尼斯: 'tns.png',
    赞比亚: 'zby.png',
    马拉维: 'mlw.png',
    乌干达: 'wgd.png',
    摩洛哥: 'mlg.png',
    博茨瓦纳: 'bzwl.png',
    利比里亚: 'lbly.png',
    科特迪瓦: 'ktdw.png',
    毛里求斯: 'mlqs.png',
    民主刚果: 'mzgg.png',
    尼日利亚: 'nrly.png',
    塞拉利昂: 'slla.png',
    南非: 'nf.png',
    布隆迪: 'bld.png',
    莫桑比克: 'msbk.png',
    津巴布韦: 'jbbw.png',
    几内亚: 'jny.png',
    厄立特里亚: 'eltly.png',
    坦桑尼亚: 'tsny.png',
    肯尼亚: 'kny.png',
    斯威士兰: 'swsl.png',
    西撒哈拉: 'xshl.png',
    塞舌尔: 'sse.png',
    布基纳法索: 'bjnlfs.png',
    赤道几内亚: 'cdjny.png',
    索马里: 'sml.png',
    几内亚比绍: 'jnybs.png',
    圣多美和普林西比: 'plxb.png',
    阿尔及利亚: 'aejly.png',
    毛里塔尼亚: 'mltny.png',
    冰岛: 'bdao.png',
    纳米比亚: 'nmby.png',
    埃塞俄比亚: 'aseby.png',
    马达加斯加: 'mdjsj.png',
    波黑: 'bh.png',
    德国: 'germany.png',
    波兰: 'poland.png',
    法国: 'france.png',
    捷克: 'Chech.png',
    荷兰: 'Netherlands.png',
    瑞士: 'Switzerland.png',
    英国: 'England.png',
    希腊: 'Greece.png',
    瑞典: 'Sweden.png',
    爱尔兰: 'Ireland.png',
    安道尔: 'Andorra.png',
    奥地利: 'Austria.png',
    比利时: 'Belgium.png',
    梵蒂冈: 'Vatican.png',
    马耳他: 'Malta.png',
    西班牙: 'Spain.png',
    乌克兰: 'Ukraine.png',
    葡萄牙: 'Portugal.png',
    意大利: 'Italy.png',
    匈牙利: 'Hungary.png',
    白俄罗斯: 'Belarus.png',
    南斯拉夫: 'Yugoslavia.png',
    克罗地亚: 'Croatia.png',
    拉脱维亚: 'Latvia.png',
    保加利亚: 'Bulgaria.png',
    罗马尼亚: 'Romania.png',
    摩尔多瓦: 'Moldova.png',
    斯洛文尼亚: 'Slovenia.png',
    阿尔巴尼亚: 'Albania.png',
    列支敦士登: 'Liechtenstein.png',
    芬兰: 'Finland.png',
    卢森堡: 'Luxembourg.png',
    立陶宛: 'Lithuania.png',
    挪威: 'Norway.png',
    摩纳哥: 'Monaco.png',
    所罗门群岛: 'Solomon.png',
    爱沙尼亚: 'Estonia.png',
    斯洛伐克: 'Slovakia.png',
    智利: 'Chile.png',
    古巴: 'Cuba.png',
    海地: 'Haiti.png',
    圭亚那: 'Guyana.png',
    委内瑞拉: 'Venezuela.png',
    安提瓜和巴布达: 'AntiguaAndBarbuda.png',
    伯利兹: 'Belize.png',
    巴哈马: 'Bahamas.png',
    巴拿马: 'Panama.png',
    墨西哥: 'Mexico.png',
    苏里南: 'Suriname.png',
    加拿大: 'Canada.png',
    厄瓜多尔: 'Ecuador.png',
    格林纳达: 'Grenada.png',
    洪都拉斯: 'Honduras.png',
    巴西: 'Brazil.png',
    玻利维亚: 'Bolivia.png',
    秘鲁: 'Peru.png',
    阿根廷: 'Argentina.png',
    圣卢西亚: 'SaintLucia.png',
    多米尼克: 'Dominican.png',
    巴拉圭: 'Paraguay.png',
    尼加拉瓜: 'Nicaragua.png',
    哥伦比亚: 'Columbia.png',
    乌拉圭: 'Uruguay.png',
    巴巴多斯: 'Barbados.png',
    瑙鲁: 'Nauru.png',
    牙买加: 'Jamaica.png',
    危地马拉: 'Guatemala.png',
    斐济: 'Fiji.png',
    哥斯达黎加: 'CostaRita.png',
    圣基茨和尼维斯: 'SaintKittsAndNevis.png',
    新西兰: 'NewZealand.png',
    特立尼达和多巴哥: 'TrinidadAndTobago.png',
    圣文森特和格林纳丁斯: 'SaintVincentAndGrenadines.png',
    基里巴斯: 'Kiribati.png',
    纽埃: 'Niue.png',
    巴新: 'PapuaNewGuinea.png',
    萨摩亚: 'Samoa.png',
    汤加: 'Tonga.png',
    帕劳: 'Palau.png',
    澳大利亚: 'Australian.png',
    瓦努阿图: 'Vanuatu.png',
    图瓦卢: 'Tuvalu.png',
    密克罗尼西亚: 'Micronesia.png',
    库克群岛: 'Cook.png',
    马绍尔群岛: 'Marshall.png',
    科索沃: 'Kosovo.png',
    东帝汶: 'TimorLeste.png',
    黑山: 'Montenegro.png'
  };
  let src = 'default.png';
  for (const key in nationWithFlagPath) {
    if (nation.includes(key)) {
      src = nationWithFlagPath[key];
      break;
    }
  }
  return basePath + src;
};

/**
 * 更改localstorage的值--登录相关
 * @param {Object} obj - 传入的修改的对象
 */
const localstorageSet = obj => {
  if (Object.keys(obj).length === 0) {
    localStorage.setItem('userName', '');
    localStorage.clear();
    return false;
  }
  // 给localstorage添加属性（主要用来保存当前登录用户信息）
  for (const key in obj) {
    localStorage.setItem(key, key === 'token' ? `Bearer ${obj[key]}` : obj[key]);
  }
};

/**
 * 获取localstorage的值，如果不传值则默认获取localstorage的所有键值对，传值默认返回指定键名的值
 * @param {string} key - 键名
 * @return {Object|string} 指定键名的值或localstorage的所有键值对
 */
const localstorageGet = (key = '') => {
  if (!key) {
    const obj = {};
    for (const key in localStorage) {
      obj[key] = localStorage.getItem(key);
    }
    return obj.keys(obj).length ? obj : null;
  }
  return localStorage.getItem(key) || '';
};

/**
 * 数组转为字符串的展示
 * @param {Array} arr - 数组
 * @param {string} [sep=','] - 分隔符
 * @param {string} [emptyVal=''] - 数组为空时默认显示
 * @return {string} 转换后的字符串
 */
const arrayToString = (arr, sep = ',', emptyVal = '') => {
  if (Array.isArray(arr)) {
    return arr.length === 0 ? emptyVal : arr.join(sep);
  }
  return arr || emptyVal;
};

/**
 * 将对象中指定属性值设为true/false
 * @param {Object} obj - 传入的对象
 * @param {string|string[]} keys - 需要设置的键名数组
 * @param {boolean} val - 需要设置的值（true/false）
 */
const setObjectKeyIsBooleanValue = (obj, keys, val) => {
  if (Array.isArray(keys)) {
    for (const name of keys) {
      obj[name] = val;
    }
  } else {
    obj[keys] = val;
  }
};

/**
 * 将对象中的属性值置空 （属性值目前只考虑 字符串、数组、对象）
 * @param {Object} obj - 需要处理的对象
 * @param {Object} opt - 额外的重置默认值
 */
const resetObject = (obj, opt = {}) => {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = [];
    } else if (typeof obj[key] === 'object') {
      obj[key] = {};
    } else {
      obj[key] = '';
    }
    undefined !== opt[key] && (obj[key] = opt[key]);
  }
};

/**
 * 给对象属性赋值 不改变对象属性数量，赋值源对象就算是空值也会修改目标数据
 * @param {Object} target - 传入目标对象，被赋值对象 target
 * @param {Object} source - 传入源对象，赋值对象，有基础数据 source
 * @param {boolean} [isExtend=false] - 是否需要继承source其它属性
 * @return {Object} 返回赋值后的对象
 */
const setObject = (target, source, isExtend = false) => {
  if (!target) return false;
  if (isExtend) return Object.assign(target, source);
  for (const key in target) {
    target[key] = source[key] === undefined ? target[key] : source[key];
  }
  return target;
};

/**
 * 判断对象是否为空对象
 * @param {Object} obj - 传入对象
 * @return {boolean} 返回对象是否为空对象
 */
const isEmptyObject = obj => {
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  return true;
};

/**
 * 拿到对象属性值去掉的两端空格后的值，不改变原对象本身
 * @param {Object} obj - 目标对象
 * @return {Object}
 */
const trimObject = obj => {
  const res = {};
  for (const name in obj) {
    res[name] = obj[name].trim();
  }
  return res;
};

/**
 * 传入的字符串首字母大写
 * @param {string} str - 传入字符串
 * @return {string} 返回首字母大写后的字符串
 */
const upperFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 返回指定dom对象 自己或其祖先节点 含有指定的类选择器 的dom
 * @param {Object} dom - 传入对象
 * @param {string} selector - class选择器
 * @return {Object} 返回符合的dom或者null
 */
const getParentNodeByClass = (dom, selector) => {
  if (dom.getAttribute('class') && dom.getAttribute('class').includes(selector)) return dom;
  do {
    dom = dom.parentNode;
    const cls = dom.getAttribute('class');
    if (cls && cls.includes(selector)) return dom;
  } while (dom.parentNode);
  return null;
};

/**
 * 用千分位表示数字 以','隔开
 * @param {number|string} x - 待转换的值
 * @return {string} 返回千分位表示的数字
 */
const numberWithCommas = x => {
  if (x === undefined) {
    return '0';
  }
  if (typeof x !== 'number') x = parseInt(x);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 取小数
 * @param {number|string} val - 目标数据
 * @param {number} [fixedLen=2] - 保留小数长度，默认保留2位
 * @param {boolean} [isCeil=true] - 是否四舍五入
 * @return {string}
 */
const numberFixed = (val, fixedLen = 2, isCeil = true) => {
  if (isCeil) return parseFloat(val).toFixed(fixedLen);
  let str = val + '';
  const index = str.lastIndexOf('.') + 1;
  // 小数部分的长度
  const fractionalPartLen = str.length - index;
  if (index > 0) str = str.substring(0, index + fixedLen);
  if (fractionalPartLen < fixedLen) {
    str += '0'.repeat(fixedLen - fractionalPartLen);
  }
  return str;
};

/**
 * 获取完整的（接口）请求地址
 * @param {string} url - 接口地址，以'/'开头的接口地址
 * @param {string} [base='VUE_APP_AXIOS_BASE_URL'] - 环境变量名，指代代理地址
 * @return {string}
 */
const getFullUrl = (url, base = 'VUE_APP_AXIOS_BASE_URL') => {
  return (process.env[base] || '/api') + url;
};

/**
 * 简单过滤字符串输入输出，将部分字符转换为字符实体，避免XSS攻击（URL请用 encodeURI() encodeURIComponent()来处理）
 * @param {string} str - 需要过滤的字符串
 * @return {string}
 */
const escapeStr = str => {
  const signs = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  const reg = /[&<>"'/]/g;
  return str && reg.test(str) ? str.replace(reg, chr => signs[chr]) : str;
};

export default {
  hasToken,
  showMessage,
  hideMessage,
  objectDeepClone,
  formatByteSize,
  formatDate,
  isDomain,
  isValidPassword,
  isPhone,
  isIp,
  isPort,
  isHash,
  isEmail,
  isUrl,
  isUri,
  isSpecifiedFile,
  getNationalFlagSrc,
  localstorageSet,
  localstorageGet,
  arrayToString,
  setObjectKeyIsBooleanValue,
  resetObject,
  setObject,
  isEmptyObject,
  trimObject,
  upperFirstLetter,
  getParentNodeByClass,
  numberWithCommas,
  numberFixed,
  getFullUrl,
  escapeStr
};
