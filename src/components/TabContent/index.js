import React, { PureComponent } from 'react';
import { Layout, message, Drawer, Button, Tabs, Dropdown, Menu, Icon } from 'antd';

import { Route } from 'react-router-dom';
import Authorized from '@/utils/Authorized';
import Exception404 from '@/pages/Exception/404';

import { connect } from 'dva';
import router from 'umi/router';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import styles from '@/layouts/BasicLayout.less';
import { array_bind_key } from '@/utils/common';

const { TabPane } = Tabs;
const { Content } = Layout;

@connect(({ refresh }) => ({
  refresh: refresh.refresh,
}))
export default class TabContent extends PureComponent {
  constructor(props) {
    super(props);

    this.systemCode =
      sessionStorage.getItem('systemCode') ||
      (localStorage.getItem('systemCode') && JSON.parse(localStorage.getItem('systemCode'))[0]) ||
      'DRAG_STORE';

    const { routes } = props.route;
    const routeKey = '/welcome',
        // this.systemCode == 'SUPERVISE' ? '/workSpaceAdm/dashboardAdm' : '/workSpace/remind',
      // tabName = this.systemCode == 'SUPERVISE' ? '统计分析' : '首页';
      tabName = '首页';
    const tabLists = this.updateTree(routes);
    let tabList = [],
      tabListArr = [];
    tabLists.map(v => {
      // if (v.key == routeKey) {
      //   if (tabList.length == 0) {
      //     v.closable = false;
      //     v.tab = tabName;
      //     tabList.push(v);
      //   }
      // }
      if (v.key) {
        tabListArr.push(v.key);
      }
    });

    this.state = {
      tabList: tabList,
      tabListKey: [routeKey],
      activeKey: routeKey,
      tabListArr,
      routeKey,
      menuSign: '',
      tabParams: {
        [routeKey]: '',
      },
      tabParam: {
        key: '',
        search: '',
      },
    };

    this.updateTree = memoizeOne(this.updateTree, isEqual);
    this.getMenuList = memoizeOne(this.getMenuList, isEqual);
  }

  getMenuList = () => {
    const { menuData } = this.props
    let reData = {}
    const fun = data => {
      for(var k in data){
        if(data[k].children) {
          fun(data[k].children)
        }else{
          reData[data[k].path] = data[k]
        }
      }
      
    }
    fun(menuData)
    return reData
  }
  
  componentWillReceiveProps(nextProps) {
    const search = nextProps.location.search,
      pathName = nextProps.location.pathname;
    pathName != '/' && this.onHandlePage({ key: pathName, search });
  }

  updateTree = data => {
    const treeData = data;
    const treeList = [];
    const getTreeList = data => {
      data.forEach(node => {
        if (!node.menuSign) {
          treeList.push({
            tab: node.name,
            key: node.path,
            locale: node.locale,
            content: node.component,
            closable: true,
          });
        }
        if (node.routes && node.routes.length > 0) {
          getTreeList(node.routes);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  onHandlePage = ({ key, search = '' }) => {
    let { tabParams, tabParam } = this.state;

    if (key == tabParam.key && search == tabParam.search) return;
    if ((tabParams[key] || tabParams[key] == '') && search && search !== tabParams[key])
      this.closeTab(key);

    tabParams[key] = search;
    this.setState({ tabParams, tabParam: { key, search } }, () => {
      const { routes } = this.props.route;
      const tabLists = this.updateTree(routes);

      const { tabListKey, tabListArr, tabList } = this.state;

      if (tabListArr.includes(key)) {
        router.push(`${key}${search}`);
      } 
      // else {
      //   key = '/404';
      //   router.push(key);
      // }
      this.setState({ activeKey: key });
      tabLists.map(v => {
        if (v.key === key) {
          if (tabList.length === 0) {
            v.closable = false;
            this.setState({ tabList: [...tabList, v] });
          } else {
            if (!tabListKey.includes(v.key)) {
              this.setState({
                tabList: [...tabList, v],
                tabListKey: [...tabListKey, v.key],
              });
            }
          }
        }
      });
    });
    const {
      refresh: { fun, params },
    } = this.props;
    fun[key] && fun[key](params[key]);
  };

  // 切换 tab页 router.push(key);
  onChange = key => {
    const { tabParams, tabList } = this.state;
    const menuList = this.getMenuList();
    const item = menuList[key]
    this.setState({ activeKey: key });
    _czc.push(['_trackEvent', '侧边栏', '点击', item ? item.locale : '---']);
    router.push(`${key}${tabParams[key]}`);
  };

  onEdit = (targetKey, action) => {
    console.log(action)
    this[action](targetKey);
  };

  onClickHover = e => {
    let { key } = e,
      { activeKey, tabList, tabListKey, routeKey, tabParams } = this.state;

    // message.info(`Click on item ${key}`);
    if (key === '1') {
      _czc.push(['_trackEvent', 'Tab功能', '点击', `关闭当前`])
      tabList = tabList.filter(v => v.key !== activeKey || v.key === routeKey);
      tabListKey = tabListKey.filter(v => v !== activeKey || v === routeKey);
      delete tabParams[activeKey];
      this.setState({
        activeKey: routeKey,
        tabList,
        tabListKey,
        tabParams,
      });
    } else if (key === '2') {
      _czc.push(['_trackEvent', 'Tab功能', '点击', `关闭其他`])
      tabList = tabList.filter(v => v.key === activeKey || v.key === routeKey);
      tabListKey = tabListKey.filter(v => v === activeKey || v === routeKey);

      tabParams = {
        [activeKey]: '',
        [routeKey]: '',
      };

      this.setState({
        activeKey,
        tabList,
        tabListKey,
        tabParams,
      });
    } else if (key === '3') {
      _czc.push(['_trackEvent', 'Tab功能', '点击', `关闭全部`])
      tabList = tabList.filter(v => v.key === routeKey);
      tabListKey = tabListKey.filter(v => v === routeKey);
      tabParams = { [routeKey]: '' };
      this.setState({
        activeKey: routeKey,
        tabList,
        tabListKey,
        tabParams,
      });
    }
    this.reWriteRefresh(tabParams)
  };

  remove = targetKey => {
    let { activeKey, tabParams } = this.state;
    let lastIndex;
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const tabList = [],
      tabListKey = [];
    this.state.tabList.map(pane => {
      if (pane.key !== targetKey) {
        tabList.push(pane);
        tabListKey.push(pane.key);
      }
    });
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = tabList[lastIndex].key;
    }
    router.push(activeKey);
    delete tabParams[targetKey];
    this.reWriteRefresh(tabParams)
    this.setState({ tabList, activeKey, tabListKey, tabParams });
  };

  reWriteRefresh = tabParams => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refresh/rewrite',
      payload: {
        data: tabParams
      },
    });
  }

  closeTab = closeTab => {
    let { activeKey, tabList, tabListKey, routeKey } = this.state;

    tabList = tabList.filter(v => v.key !== (closeTab || activeKey) || v.key === routeKey);
    tabListKey = tabListKey.filter(v => v !== (closeTab || activeKey) || v === routeKey);

    this.setState({
      activeKey: closeTab || '',
      tabList,
      tabListKey,
    });
    !closeTab && router.goBack();
  };

  render() {
    const { fixedHeader, menuCollapsed } = this.props;
    let { activeKey, tabList, tabListKey } = this.state;
    this.props.location.closeTab = this.closeTab;

    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前</Menu.Item>
        <Menu.Item key="2">关闭其他</Menu.Item>
        <Menu.Item key="3">关闭全部</Menu.Item>
      </Menu>
    );
    const operations = (
      <Dropdown overlay={menu}>
        <div className="ant-dropdown-link" style={{ cursor: 'pointer', marginRight: '10px' }}>
          <Icon type="setting" />
          {/* <Icon type="down" /> */}
        </div>
      </Dropdown>
    );

    // const menuItems = (
    //   <Menu onClick={this.onClickHover}>
    //     <Menu.Item key="1"> 关闭当前 </Menu.Item>
    //     <Menu.Item key="2"> 关闭其他 </Menu.Item>
    //     <Menu.Item key="3"> 关闭全部 </Menu.Item>
    //   </Menu>
    // );
    // const renderTabBar = (props, DefaultTabBar) => {
    //   // 提取tab信息
    //   const tabInfo = [];
    //   props.panels.forEach(item => {
    //     tabInfo.push({
    //       key: item.key,
    //       title: item.props.tab,
    //     });
    //   });
    //   console.log(DefaultTabBar)
    //   return (
    //     <Dropdown overlay={menuItems} trigger={['contextMenu']}>
    //       <div style={{ display: 'flex', marginBottom: 16 }}>
    //         {tabInfo.map((item, index) => (
    //           <div
    //             key={item.key}
    //             onClick={() => this.setState({ activeKey: item.key })}
    //             className={props.activeKey === item.key ? `${styles.activeTab} ${styles.normalTab}` : `${styles.normalTab}`}
    //           >
    //             <div style={{ padding: '0 16px' }}>{item.title}</div>
    //           </div>
    //         ))}
    //       </div>
    //     </Dropdown>
    //   );
    // };
    return (
      <div>
        {this.state.tabList && this.state.tabList.length ? (
          <div className={menuCollapsed ? styles.smallTab : styles.bigTab}>
            <Tabs
              // className={styles.tabs}
              activeKey={activeKey}
              onChange={this.onChange}
              tabBarExtraContent={operations}
              // renderTabBar={renderTabBar}
              tabBarStyle={{ background: '#fff' }}
              tabPosition="top"
              tabBarGutter={-1}
              hideAdd
              type="editable-card"
              onEdit={this.onEdit}
            >
              {this.state.tabList.map(item => (
                <TabPane tab={item.tab} key={item.key} closable={item.closable}>
                  <Content className={styles.content} style={contentStyle}>
                    <Authorized noMatch={<Exception404 />}>
                      <Route
                        key={item.key}
                        path={item.path}
                        component={item.content}
                        exact={item.exact}
                      />
                    </Authorized>
                  </Content>
                </TabPane>
              ))}
            </Tabs>
          </div>
        ) : null}
      </div>
    );
  }
}
