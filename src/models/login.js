import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getPageQuery } from '@/utils/utils';
import { setAuthority, getAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { fakeAccountLogin } from '@/services/login';
import { message } from 'antd';

// const delay = ms => new Promise(resolve => {
//   setTimeout(resolve, ms)
// })

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      // Login successfully
      if (response.status == '200' && response.data.resultCode == 1) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.status,
            tokenData: response.data.data,
          },
        });
        if (response.data.data && response.data.data.systemCode) {
          sessionStorage.setItem('systemCode', response.data.data.systemCode);
        }
        reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield call(delay, 1)
        // window.location.href = "/setUp";
        yield put(routerRedux.replace('/setUp'));
      } else if (response.status == '200' && response.data.resultCode == 2) {
        message.error(response.data.errMsg);
      }
    },
    // 获取验证码
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          tokenData: {
            systemCode: 'guest',
          },
        },
      });
      reloadAuthorized();
      // const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' /*  && !redirect */) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            // search: stringify({
            //   redirect: window.location.href,
            // }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.tokenData);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
