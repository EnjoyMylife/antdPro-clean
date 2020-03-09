import request from '@/utils/request';
import axios from 'axios';

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export const fakeAccountLogin = params => {
  return axios('/api/authenticate', {
    method: 'POST',
    data: params,
  });
};
