import React, { PureComponent, Suspense } from 'react';
import { Layout, Icon } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { title } from '@/defaultSettings';
// import IconFont from '@/utils/IconFont';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuList } = this.props;
    return menuList.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    const permission = JSON.parse(localStorage.getItem('permission')) || {};
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={200}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          {permission.roleName == 'ROLE_DRAG_STORE' ||
          permission.roleName == 'ROLE_DRAG_STORE_NORMAL' ? (
            <Link to="/workSpace/remind">
              <img src={logo} alt="logo" />
              {/* <h1  style={{float: 'left'}}>logo`12</h1> */}
            </Link>
          ) : (
            <Link to="/workSpaceAdm/dashboardAdm">
              <img src={logo} alt="logo" />
              {/* <h1  style={{float: 'left'}}>logo`12</h1> */}
            </Link>
          )}
        </div>

        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          />
        </Suspense>
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          {/*<IconFont type="icon-tabledaochu" />*/}
        </span>
      </Sider>
    );
  }
}
