// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('systemCode') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority; /* || ['admin']; */
}

export function setAuthority(data) {
  localStorage.clear();
  const proAuthority = typeof data.systemCode == 'string' ? [data.systemCode] : data.systemCode;
  localStorage.setItem('systemCode', JSON.stringify(proAuthority));

  data.id_token && localStorage.setItem('Authorization', 'Bearer ' + data.id_token);
  (data.login || data.name) &&
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        login: data.login,
        name: data.name,
        dragStoreName: data.dragStoreName,
        loginTime: data.loginTime,
      }),
    );
  if (data.roleName == 'ROLE_DRAG_STORE_NORMAL') {
    localStorage.setItem(
      'permission',
      JSON.stringify({
        roleName: data.roleName,
        pagePermissionIdentify:
          data.pagePermissionIdentify == '' ? 'workSpace_remind' : data.pagePermissionIdentify,
      }),
    );
  } else {
    localStorage.setItem(
      'permission',
      JSON.stringify({
        roleName: data.roleName,
        pagePermissionIdentify: data.pagePermissionIdentify,
      }),
    );
  }

  return true;
}
