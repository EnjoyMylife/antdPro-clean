import React, { Fragment } from 'react';
import { Icon, Card, Form, Row, Col, Input, Select, DatePicker, Button, message } from 'antd';
import DocumentTitle from 'react-document-title';
import styles from './UserEnrolment.less';
import logo from '../assets/logo.svg';
import PageTitle from '@/components/PageTitle';
import router from 'umi/router';
import TextArea from 'antd/lib/input/TextArea';
import { getBusinessType, saveEnrolment } from '@/services/user';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class UserEnrolment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      BUSINESS_TYPE: [],
    };
  }

  async componentDidMount() {
    let res = await getBusinessType();
    this.setState({
      BUSINESS_TYPE: res.data.data,
    });
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['register'] = 1;
        values['licenseEndDate'] = moment(values['licenseEndDate']).format('YYYY-MM-DD');
        saveEnrolment(values).then(res => {
          if (res.data.resultCode == 1) {
            message.success('注册账号成功，请等待监管局审核！');
            router.push('/');
          } else {
            message.error('注册账号失败');
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { BUSINESS_TYPE } = this.state;
    return (
      <DocumentTitle title={'药械经营企业社会共治监管系统-注册'}>
        <div style={{ background: '#eee', height: '100%' }}>
          <div style={{ height: '65px', backgroundColor: '#000' }}>
            <div
              className={styles.logoBox}
              onClick={() => {
                router.push('/user');
              }}
            >
              <img alt="logo" className={styles.logo} src={logo} />
              药械经营企业社会公治监管系统
            </div>
            <div
              className={styles.login}
              onClick={() => {
                router.push('/user');
              }}
            >
              登录
            </div>
          </div>
          <Card style={{ width: '1000px', margin: '24px auto', position: 'relative' }}>
            <PageTitle>注册</PageTitle>
            <Form className={styles.myForm}>
              <Row className={styles.rowStyle}>
                <Col span={8}>
                  <FormItem label="药店名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入药店名称！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入药店名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="营业执照编号">
                    {getFieldDecorator('socialUnifiedCreditCode', {
                      rules: [{ required: true, message: '请输入营业执照编号！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入营业执照编号" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="经营许可证号">
                    {getFieldDecorator('licenseNumber', {
                      rules: [{ required: true, message: '请输入经营许可证号！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入经营许可证号" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={8}>
                  <FormItem label="注册地址">
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: '请输入注册地址！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入注册地址" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="经营方式">
                    {getFieldDecorator('operationMode', {
                      rules: [{ required: true, message: '请选择经营方式！' }],
                    })(
                      <Select style={{ width: 260 }} placeholder="请选择">
                        {BUSINESS_TYPE.map((item, index) => (
                          <Option value={item.dicValue} key={index}>
                            {item.dicValue}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="经营许可证有效期">
                    {getFieldDecorator('licenseEndDate', {
                      rules: [{ required: true, message: '请选择有效期！' }],
                    })(
                      <DatePicker
                        disabledDate={current => current && current < moment().endOf('day')}
                        style={{ width: 260 }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={24}>
                  <FormItem label="仓库地址">
                    {getFieldDecorator('warehouseAddress', {
                      rules: [{ required: true, message: '请输入仓库地址！' }],
                    })(<Input style={{ width: 890 }} placeholder="请输入仓库地址" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={24}>
                  <FormItem label="经营范围">
                    {getFieldDecorator('businessScope', {
                      rules: [{ required: true, message: '请输入经营范围！' }],
                    })(<TextArea style={{ width: 890 }} placeholder="请输入经营范围" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={8}>
                  <FormItem label="GSP认证">
                    {getFieldDecorator('gspCertification', {
                      rules: [{ required: true, message: '请选择GSP认证！' }],
                    })(
                      <Select style={{ width: 260 }} placeholder="请选择">
                        <Option value="1">是</Option>
                        <Option value="2">否</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="GSP证书号">
                    {getFieldDecorator('gspLicenseNumber')(
                      <Input style={{ width: 260 }} placeholder="请输入GSP证书号" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="是否医保点">
                    {getFieldDecorator('medicalInsurance', {
                      rules: [{ required: true, message: '请选择是否医保点！' }],
                    })(
                      <Select style={{ width: 260 }} placeholder="请选择">
                        <Option value="1">是</Option>
                        <Option value="2">否</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={8}>
                  <FormItem label="法人代表">
                    {getFieldDecorator('legalPerson', {
                      rules: [{ required: true, message: '请输入法人代表！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入法人代表" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="企业负责人">
                    {getFieldDecorator('charger', {
                      rules: [{ required: true, message: '请输入企业负责人！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入企业负责人" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="质量负责人">
                    {getFieldDecorator('qualityCharger', {
                      rules: [{ required: true, message: '请输入质量负责人！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入质量负责人" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={8}>
                  <FormItem label="质量管理员">
                    {getFieldDecorator('qualityManager')(
                      <Input style={{ width: 260 }} placeholder="请输入质量管理员" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="管理员手机号">
                    {getFieldDecorator('chargerPhone', {
                      rules: [{ required: true, message: '请输入管理员手机号！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入管理员手机号" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="固定电话">
                    {getFieldDecorator('telephoneNumber', {
                      rules: [{ required: true, message: '请输入固定电话！' }],
                    })(<Input style={{ width: 260 }} placeholder="请输入固定电话" />)}
                  </FormItem>
                </Col>
              </Row>
              <div className={styles.buttons}>
                <Button
                  style={{ marginRight: '14px' }}
                  onClick={() => {
                    router.goBack();
                  }}
                >
                  返回
                </Button>
                <Button type="primary" onClick={this.handleSearch}>
                  提交注册
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserEnrolment;
