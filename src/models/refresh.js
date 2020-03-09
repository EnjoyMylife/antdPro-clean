import { arrayKeyBind } from '@/utils/common';

export default {
  namespace: 'refresh',

  state: {
    refresh: {
      fun: {},
      params: {},
    },
  },

  effects: {
    *fetch({ payload }, { put, select }) {
      const refresh = yield select(state => state.refresh);
      let { refresh: { fun, params } } = refresh;
      if (!fun[payload.key]) {
        fun[payload.key] = payload.fn;
        params[payload.key] = payload.params || '';
      }
      yield put({
        type: 'save',
        payload: refresh,
      });
    },
    *rewrite({ payload }, { put, select }) {
      const { refresh: { fun, params } } = yield select(state => state.refresh)
      const { data } = payload
      let newFun = {},
        newParams = {}
      for(var i in data){
        newFun[i] = fun[i]
        newParams[i] = params[i]
      }
      yield put({
        type: 'save',
        payload: {
          refresh: {
            fun: newFun,
            params: newParams
          }
        },
      });
    }
  },

  reducers: {
    save(state, { payload }) {
      // console.log(state, payload)
      return {
        // ...state,
        ...payload
      };
    },
  },
};
