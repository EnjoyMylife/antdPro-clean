import request from '@/utils/request';

export const getRdtsDrag = async params => {
  let url = '/api/rdts-drag?interNo=page';
  url += `&page=${(params && params.current) || 1}`;
  if (params && params.orderBy) {
    url += '&orderBy=' + params.orderBy;
  } else {
    url += '&orderBy=insertTime';
  }
  // 首营药品查询
  if (params && params.fristCamp) {
    url += '&fristCamp.equals=' + params.fristCamp;
  }
  // 查询分页参数
  if (params && params.size) {
    url += '&size=' + params.size;
  }
  // 字段查询参数
  if (params && params.name) {
    url += '&nameOrApprovalOrDragCodeLike=' + params.name;
  }
  if (params && params.bigCategoryCode) {
    url += '&bigCategoryCode.equals=' + params.bigCategoryCode;
  }
  if (params && params.currentStock) {
    url += '&currentStock.greaterThan=' + params.currentStock;
  }

  // 中西药区分
  if (params && params.tcmWm) {
    url += '&tcmWm.equals=' + params.tcmWm;
  }

  return request({
    url: url,
    method: 'GET',
  });
};

export const baseData = () => {
  return request({
    url: '/api/system-dictionary-all',
    method: 'GET',
  });
};
