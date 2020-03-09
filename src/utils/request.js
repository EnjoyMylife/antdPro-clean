import axios from 'axios';
import router from 'umi/router';
import { message } from 'antd';
import { getPageQueryApi } from '@/utils/utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队。',
  204: '删除数据成功。',
  400: '发出的请求有错误。',
  401: '用户没有权限。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '网络错误，请稍后再试。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 创建axios实例
const service = axios.create({
  // baseURL: 'http://192.168.50.150:10010',
  timeout: 600000, // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['x-requested-with'] = 'XMLHttpRequest';
    if (config.method === 'post') {
      config.data = JSON.stringify(config.data);
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    config.headers['Authorization'] = localStorage.getItem('Authorization');
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  },
);
// response拦截器
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response);
    }
    if (response.data.resultCode && response.data.resultCode == 2) {
      message.error(response.data.errMsg);
      return Promise.reject('error');
    }
    return Promise.resolve(response);
  },
  error => {
    console.error(error); // for debug
    let status = error.response && error.response.status;

    if (status === 401) {
      message.warning('登录信息已失效，请重新登录');
      // window.location.href = '/#/user/login';
      router.push('/user/login')
      window.location.reload();
    } else {
      status ? message.error(codeMessage[status]) : message.error('服务器连接错误！');
    }
    return Promise.reject(error);
  },
);
export default service;
