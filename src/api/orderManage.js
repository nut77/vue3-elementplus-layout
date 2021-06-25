import * as ajax from '@/utils/request';
export default {
  getPieData: params => ajax.get('/order/statByType', params),
  getLineData: params => ajax.get('/order/trend', params),
  getRatioData: params => ajax.get('/order/stat', params)
};
