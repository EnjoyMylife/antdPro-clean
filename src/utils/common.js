import moment from 'moment';
import { message } from 'antd';
import LineWrap from '@/components/LineWrap';
import request from '@/utils/request';
import { downLoad } from '../services/commonData';
import { getLodop } from './print';

export const checkPermission = (...params) => {
  // console.log(params)
  return true;
};

export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const noData = value => {
  return value || '--';
};

export const lineWrap = (value, lineClampNum = 1) => {
  value = typeof value == 'number' ? value.toString() : value;
  return <LineWrap title={value} lineClampNum={lineClampNum} />;
};

export const arrayKeyBind = arr => {
  if (arr && arr.length == 0) return [];
  let i = 1;
  for (let k in arr) {
    arr[k]['key'] = i;
    i++;
  }
  return arr;
};

export const array_bind_key = (arr, key) => {
  var newArr = {};
  for (var k in arr) {
    newArr[arr[k][key]] = arr[k];
  }
  return newArr;
};

export const inArray = (search, array) => {
  for (var i in array) {
    if (array[i] == search) {
      return i;
    }
  }
  return false;
};

export const floatTool = (() => {
  function isInteger(obj) {
    return Math.floor(obj) === obj;
  }

  function toInteger(floatNum) {
    var ret = {
      times: 1,
      num: 0,
    };
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    var strfi = floatNum + '';
    var dotPos = strfi.indexOf('.');
    var len = strfi.substr(dotPos + 1).length;
    var times = Math.pow(10, len);
    var intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret;
  }

  function operation(a, b, op) {
    var o1 = toInteger(a);
    var o2 = toInteger(b);
    var n1 = o1.num;
    var n2 = o2.num;
    var t1 = o1.times;
    var t2 = o2.times;
    var max = t1 > t2 ? t1 : t2;
    var result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          result = n1 + n2;
        } else if (t1 > t2) {
          result = n1 + n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'sub':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'mul':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        return (result = (function() {
          var r1 = n1 / n2;
          var r2 = t2 / t1;
          return operation(r1, r2, 'mul');
        })());
    }
  }

  function add(a, b) {
    // 加
    return operation(a, b, 'add');
  }

  function sub(a, b) {
    // 减
    return operation(a, b, 'sub');
  }

  function mul(a, b) {
    // 乘
    return operation(a, b, 'mul');
  }

  function divide(a, b) {
    // 除
    return operation(a, b, 'divide');
  }
  return {
    add: add,
    sub: sub,
    mul: mul,
    divide: divide,
  };
})();
Number.prototype.oldToFixed = Number.prototype.toFixed;
Number.prototype.toFixed = function(len) {
  var changenum = (parseInt(this * Math.pow(10, len) + 0.5) / Math.pow(10, len)).toString();
  var index = changenum.indexOf('.');

  if (index < 0 && len > 0) {
    changenum = changenum + '.';
    for (var i = 0; i < len; i++) {
      changenum = changenum + '0';
    }
  } else {
    index = changenum.length - index;
    for (var i = 0; i < len - index + 1; i++) {
      changenum = changenum + '0';
    }
  }

  return changenum;
};

export const checkReg = (type, val) => {
  let reg = '';
  if (!val) return true;
  switch (type) {
    case 'Decimal1':
      reg = /^\d+((\.)|(\.\d))?$/;
      break;
    case 'Decimal2':
      reg = /^\d+((\.)|(\.\d{1,2}))?$/;
      break;
    case 'Integer':
      reg = /^[1-9]\d*$/;
      break;
    case 'IDCard':
      reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
      break;
    default:
      break;
  }
  if (reg.test(val)) {
    return true;
  }
  return false;
};
export const downloadPhoto = (url, name) => {
  request
    .post(
      '/api/file-download',
      { relativePath: url, name: name },
      {
        responseType: 'blob',
      },
    )
    .then(res => {
      if (!res) return;
      let url = window.URL.createObjectURL(res.data);
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
    });
};

export const downloadFile = (url, name, success, error) => {
  request({
    url,
    method: 'get',
    responseType: 'blob',
  })
    .then(res => {
      success && success(res);
      const r = new FileReader();
      r.onload = function() {
        try {
          const resData = JSON.parse(this.result);
          if (resData && resData.resultCode && resData.resultCode == 2) {
            message.error(resData.errMsg);
          }
        } catch (err) {
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = window.URL.createObjectURL(res.data);
          link.setAttribute('download', `${name} - ${moment().format('YYYY-MM-DD')}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
      };
      r.readAsText(res.data);
    })
    .catch(err => {
      error && error(err);
    });
};

export const downloadFilePost = (url, data, name, success, error) => {
  request({
    url,
    data,
    method: 'post',
    responseType: 'blob',
  })
    .then(res => {
      success && success(res);
      const r = new FileReader();
      r.onload = function() {
        try {
          const resData = JSON.parse(this.result);
          if (resData && resData.resultCode && resData.resultCode == 2) {
            message.error(resData.errMsg);
          }
        } catch (err) {
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = window.URL.createObjectURL(res.data);
          link.setAttribute('download', `${name} - ${moment().format('YYYY-MM-DD')}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
      };
      r.readAsText(res.data);
    })
    .catch(err => {
      error && error(err);
    });
};

export const print = content => {
  let LODOP;
  LODOP = getLodop();
  if (LODOP) {
    LODOP.PRINT_INIT('');
    LODOP.SET_PRINT_MODE('NOCLEAR_AFTER_PRINT', false);
    LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true); //已打印机的物理边缘打印
    LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true);
    LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true);
    LODOP.SET_PRINT_PAGESIZE(3, 700, 0, 'CreateCustomPage');
    LODOP.NEWPAGEA();
    LODOP.ADD_PRINT_HTM('10px', '8px', '95%', '95%', content);

    LODOP.PRINT(); // 直接打印
    // LODOP.PREVIEW() // 预览
  }
};
