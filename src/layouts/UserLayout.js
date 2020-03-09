import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
import styles from './UserLayout.less';
import logo from '../assets/logo_ts.png';
import DocumentTitle from 'react-document-title';

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <DocumentTitle title={'药械经营企业社会共治超管平台'}>
        <div className={styles.adminContainer}>
          <div className={styles.content}>
            <div>
              <div className={styles.top}>
                <div className={styles.header}>
                  <img alt="logo" className={styles.logo} src={logo} />
                </div>
              </div>
              {children}
            </div>
          </div>
          <div className={styles.beian}>
            <span>© {new Date().getFullYear()} 泰克赛威 </span> ·
            <span
              className={styles.icp}
              onClick={() => {
                window.open('http://www.beian.miit.gov.cn');
              }}
            >
              苏ICP备18068552号
            </span>
            ·
            <span
              className={styles.icp}
              onClick={() => {
                window.open('http://www.beian.miit.gov.cn');
              }}
            >
              苏ICP备18068552号
            </span>
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
