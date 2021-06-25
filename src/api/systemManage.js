import * as ajax from '@/utils/request';
export default {
  addCustomer: params => ajax.post('/customer/create', params),
  editCustomer: params => ajax.put('/customer/update', params),
  delCustomer: params => ajax.del(`/customer/delete/${params}`),
  getCustomer: params => ajax.post('/customer/queryPage', params),
  checkCustomer: params => ajax.get(`/Customer/queryByUsername/${params}`),

  addUser: params => ajax.post('/user/create', params),
  editUser: params => ajax.put('/user/update', params),
  delUser: params => ajax.del(`/user/delete/${params}`),
  getUser: params => ajax.post('/user/queryPage', params),
  checkUser: params => ajax.get(`/user/queryByUsername/${params}`),
  checkUnique: params => ajax.get(`/user/queryByValue/${params}`),

  getSystemLog: params => ajax.post('/systemLog/queryPage', params),
  getSystemLogDetail: params => ajax.get(`/systemLog/detail?id=${params}`),
  downloadSystemLog: params => ajax.get('/systemLog/download', params)
};
