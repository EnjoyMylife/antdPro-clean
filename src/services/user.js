import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function queryNotices() {
  return request('/api/notices');
}

export async function saveEnrolment(params) {
  return request({
    url: 'api/public/rdts-drag-store',
    method: 'POST',
    data: params,
  });
}

export const getBusinessType = async () => {
  return request({
    url: '/api/public/system-dictionary-all?dicType.equals=BUSINESS_TYPE',
    method: 'GET',
  });
};
