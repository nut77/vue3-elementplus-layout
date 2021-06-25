import * as ajax from '@/utils/request';
export default {
  login: params => ajax.post('/login', params, {contentType: 'application/json'}),
  loginOut: params => ajax.get('/loginOut', params),
  changePassword: params => ajax.post('/changePassword', params)
};
