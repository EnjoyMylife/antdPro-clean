import React, { PureComponent } from 'react';
import { Icon, Radio } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { connect } from 'dva';

// const TabPane = Tabs.TabPane

class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  // toggle = () => {
  //   const { collapsed, onCollapse } = this.props;
  //   onCollapse(!collapsed);
  //   this.triggerResizeEvent();
  // };

  changeMenu = v => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/setMenuSign',
      payload: { menuSign: v.target.value },
    });
  };

  render() {
    const { /* collapsed, */ isMobile, logo, menuData, menuSign, dispatch } = this.props;
    
    // let menuSign_ = '';
    // if (menuSign == 'dashboard' || menuSign == 'account' || menuSign == 'dashboardAdm') {
    //   let systemCode = sessionStorage.getItem('systemCode');
    //   menuSign_ = systemCode == 'SUPERVISE' ? 'workSpaceAdm' : 'workSpace';
    //   dispatch({
    //     type: 'menu/setMenuSign',
    //     payload: { menuSign: menuSign_ },
    //   });
    // } else {
    //   menuSign_ = menuSign;
    // }

    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <Radio.Group onChange={this.changeMenu} value={menuSign} size="large">
          {menuData.map(item => {
            return (
              <Radio.Button value={item.menuSign} key={item.menuSign}>
                {/* <Icon type={item.icon} /> */} {item.name}
              </Radio.Button>
            );
          })}
        </Radio.Group>
        {/* <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span> */}
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default connect(({ menu }) => ({
  menuSign: menu.menuSign,
}))(GlobalHeader);
