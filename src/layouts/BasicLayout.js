import React from 'react';
import Media from 'react-media';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { Layout, message, Drawer, Button, Tabs, Dropdown, Menu, Icon } from 'antd';

import Link from 'umi/link';
import router from 'umi/router';
import Redirect from 'umi/redirect';

import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { connect } from 'dva';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { inArray } from '@/utils/common';
import { getAuthority } from '@/utils/authority';
import logo from '../assets/logo.png';

// import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';

import styles from './BasicLayout.less';
import TabContent from '@/components/TabContent';

const query = {
  'screen-xs': { maxWidth: 575 },
  'screen-sm': { minWidth: 576, maxWidth: 767 },
  'screen-md': { minWidth: 768, maxWidth: 991 },
  'screen-lg': { minWidth: 992, maxWidth: 1199 },
  'screen-xl': { minWidth: 1200, maxWidth: 1599 },
  'screen-xxl': { minWidth: 1600 },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.systemCode =
      sessionStorage.getItem('systemCode') ||
      (localStorage.getItem('systemCode') && JSON.parse(localStorage.getItem('systemCode'))[0]) ||
      'DRAG_STORE';

    this.state = {
      menuSign: '',
      menuCollapsed: false,
    };

    this.renderMenuSign = memoizeOne(this.renderMenuSign, isEqual);
    // this.getPageTitle = memoizeOne(this.getPageTitle);
    // this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
      location: { pathname },
    } = this.props;
    const menuSign = this.renderMenuSign(routes, pathname);
    this.changeMenuSign(menuSign);
    router.push(
      this.systemCode = '/welcome',
    );

    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
    dispatch({
      type: 'commonData/baseData',
    });
    if(ENVment){
      var cnzz_s_tag = document.createElement('script');
      cnzz_s_tag.type = 'text/javascript';
      cnzz_s_tag.async = true;
      cnzz_s_tag.charset = 'utf-8';
      cnzz_s_tag.src = 'http://w.cnzz.com/c.php?id=1278154115&async=1';
      var root_s = document.getElementsByTagName('script')[0];
      root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
      _czc.push(["_setAccount", "1278154115"]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const routes = nextProps.route.routes,
      pathName = nextProps.location.pathname;
    if (pathName == '/') {
      router.push(
        this.systemCode = '/welcome',
      );
      return;
    }
    const menuSign = this.renderMenuSign(routes, pathName);
    this.changeMenuSign(menuSign);

    // 路由权限
    // const { roleName, pagePermissionIdentify } =
    //   JSON.parse(localStorage.getItem('permission')) || {};
    // if (roleName == 'ROLE_DRAG_STORE_NORMAL') {
    //   const permission = pagePermissionIdentify.split(',');
    //   permission.push('account_password');
    //   let url = pathName.split('/');
    //   url.splice(0, 1);
    //   const code = url.join('_');
    //   if (
    //     code &&
    //     code !== 'account' &&
    //     // code.indexOf('account') == -1 &&
    //     permission.length &&
    //     this.checkPermission(code, permission)
    //   ) {
    //     message.warn('您没有该页面的权限,如有需要请联系店主开通！');
    //     router.push('/');
    //   }
    // }
  }

  renderMenuSign = (routes, pathname) => {
    let menuData = [];
    for (var k in routes) {
      // if (routes[k].authority && routes[k].authority[0] == this.systemCode) {
        menuData.push(routes[k]);
      // }
    }
    let menuSign = '';
    const resetFn = (data, pathname, obj) => {
      for (var k in data) {
        if (data[k].path == pathname) {
          menuSign = obj ? obj.menuSign : data[k].menuSign;
        } else {
          data[k].routes && obj
            ? resetFn(data[k].routes, pathname, obj)
            : resetFn(data[k].routes, pathname, data[k]);
        }
      }
    };
    resetFn(menuData, pathname);
    return menuSign;
  };

  changeMenuSign = params => {
    const { menuSign } = this.state;
    const { dispatch } = this.props;
    if (params !== menuSign) {
      this.setState(
        {
          menuSign: params,
        },
        () => {
          dispatch({
            type: 'menu/setMenuSign',
            payload: { menuSign: params },
          });
        },
      );
    }
  };

  checkPermission = (code, permission) => {
    if (inArray(code, permission)) {
      return false;
    } else {
      let code_ = code.split('_');
      code_.pop();
      code_ = code_.join('_');
      if (inArray(code_, permission)) {
        return false;
      }
    }
    return true;
  };

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path === key) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  // matchParamsPath = (pathname, breadcrumbNameMap) => {
  //   const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  //   return breadcrumbNameMap[pathKey];
  // };

  // getPageTitle = (pathname, breadcrumbNameMap) => {
  //   const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
  //   if (!currRouterData) {
  //     return title;
  //   }
  //   const pageName = currRouterData.name; // 临时修改，可通过 currRouterData.locale 或者 currRouterData.name 拿到当前页面的RouterID
  //   // return `${pageName} - ${title}`;
  //   return `${pageName}`;
  // };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '200px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    this.setState({ menuCollapsed: collapsed });
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  getMenuList = (data, menuSign) => {
    if (menuSign && data.length > 0) {
      for (var k in data) {
        if (data[k].menuSign == menuSign) {
          return data[k].children;
        }
      }
    } else {
      return (data[0] && data[0].children) || [];
    }
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      route: { routes },
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
      menuSign,
    } = this.props;

    let { activeKey, tabList, tabListArr, tabListKey, menuCollapsed } = this.state;

    const menuList = this.getMenuList(menuData, menuSign);

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
console.log(menuData, menuSign, menuList)
    // @ts-ignore
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuList={menuList}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <TabContent {...this.props} menuData={menuData} menuCollapsed={menuCollapsed} />
          {/* {pathname == '/' ? (<Redirectto={this.systemCode == 'SUPERVISE' ? '/workSpaceAdm/dashboardAdm' : '/workSpace/remind'}/>) : (<Authorized authority={routerConfig} noMatch={<Exception404 />}>{children}</Authorized>)} */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        {/* <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}> */}
        <DocumentTitle title={'药械经营企业社会共治监管系统'}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  menuSign: menu.menuSign,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
