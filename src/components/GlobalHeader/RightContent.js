import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Icon, Avatar, Dropdown } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { NoticeIcon } from 'ant-design-pro';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import { getAccountPermission } from '@/pages/account/service';
import IconFont from '@/utils/IconFont';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      // currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const permission = JSON.parse(localStorage.getItem('permission')) || {};
    const currentUser = JSON.parse(localStorage.getItem('userInfo'));
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <span>修改密码</span>
        </Menu.Item>
        {permission.roleName == 'ROLE_SUPERVISE' || permission.roleName == 'ROLE_DRAG_STORE' ? (
          <Menu.Item key="userinfo">
            <Icon type="setting" />
            <span>账户设置</span>
          </Menu.Item>
        ) : (
          ''
        )}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    const menuList = (
      <Menu>
        <Menu.Item>
          <Link to="/erpManage/invSa/wm" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '药品销售'])}>药品销售</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/erpManage/invSa/tcm" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '中药饮片销售'])}>中药饮片销售</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/erpManage/invPo/wm" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '药品采购'])}>药品采购</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/erpManage/invPu/wm" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '药品入库'])}>药品入库</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/data/saleReport/saleFlow" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '药品销售流水'])}>药品销售流水</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/data/epidemic/coughAbout" onClick={() => _czc.push(['_trackEvent', '快捷入口', '点击', '退烧止咳药记录'])}>退烧止咳药记录</Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.right}>
        {/* <Link style={{display: 'inline-block', marginRight: 14, color: '#fff' }} to="/drugStore" target="_blank">
          <Icon type="area-chart" style={{ fontSize: 16 }} /> 数据概览
        </Link> */}
        {(permission.roleName == 'ROLE_DRAG_STORE' ||
          permission.roleName == 'ROLE_DRAG_STORE_NORMAL') && (
          <span className={styles.menuList}>
            <Dropdown overlay={menuList}>
              <span className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                <IconFont type="iconkuaijierukou" />
                <i>快捷入口</i>
              </span>
            </Dropdown>
          </span>
        )}
        {(permission.roleName == 'ROLE_DRAG_STORE' ||
          permission.roleName == 'ROLE_DRAG_STORE_NORMAL') && (
          <a
            href="http://i.youku.com/i/UNzEwMjU5MTk2MA==/videos?spm=a2hzp.8244740.0.0"
            target="_blank"
            style={{ fontSize: '18px', marginRight: 20, color: '#fff' }}
            onClick={() => _czc.push(['_trackEvent', '帮助', '点击', '帮助'])}
          >
            <IconFont type="iconwentiqiuzhu" />
            <i style={{ marginLeft: 6, fontStyle: 'normal', fontSize: '14px' }}>问题求助</i>
          </a>
        )
        }
       
        {currentUser !== null && currentUser.login ? (
          <HeaderDropdown overlay={menu} trigger={['click']}>
            <span className={`${styles.action} ${styles.account}`}>
              {/* <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              /> */}
              <Icon type="user" className={styles.avatar} />
              <span className={styles.name}>{currentUser.login}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
