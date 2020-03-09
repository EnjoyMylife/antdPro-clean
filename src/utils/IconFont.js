import { Icon } from 'antd';
import React, { PureComponent } from 'react';
export default class IconFont extends PureComponent {
  render() {
    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_1263981_nup2o90xc1j.js',
    });
    const { type } = this.props;
    return <IconFont type={type} />;
  }
}
