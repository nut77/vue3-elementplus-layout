import * as ajax from '@/utils/request';
export default {
  getPieData: params => ajax.post('/getPieData', params, {contentType: 'application/json'}),
  getLineData: params => ajax.get('/getLineData', params)
};
