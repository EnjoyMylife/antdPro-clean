import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import Authorized from '@/utils/Authorized';
import { inArray } from '@/utils/common';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: item.name, // 此字段是菜单栏的名称了，临时改成item.name，后面根据项目结构再修改
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData 过滤菜单数据
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};

const cleanData = (data, permission, arr = [], i = 0) => {
  data.map(item => {
    if (item.children) {
      let children = cleanData(item.children, permission);
      if (children.length > 0) {
        arr[i] = {
          ...item,
          children,
        };
      }
    } else {
      if (inArray(item.code, permission)) {
        arr.push(item);
      }
    }
    i++;
  });
  return arr;
};

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    menuSign: '',
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority } = payload;
      const { roleName, pagePermissionIdentify } =
        JSON.parse(localStorage.getItem('permission')) || {};
      const originData = memoizeOneFormatter(routes, authority);

      // 权限过滤
      let menuData = filterMenuData(originData);
      if (roleName == 'ROLE_DRAG_STORE_NORMAL') {
        const permission = pagePermissionIdentify.split(',');
        menuData = cleanData(menuData, permission);
      }

      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
    *setMenuSign({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
