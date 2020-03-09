/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { parse } from 'query-string';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getPageQueryApi() {
  const url = window.location.href.split('?')[0];
  const apis = url.split('//')[1].split('/');
  return apis[1];
}
