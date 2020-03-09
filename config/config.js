// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';
import pageRoutes from './router.config';
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: { hmr: true },
        targets: { ie: 11 },
        locale: {
          enable: false,
        },
        // default true, when it is true, will use `navigator.language` overwrite default
        dynamicImport: { loadingComponent: './components/PageLoading/index' },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  hash: true,
  urlLoaderExcludes: [/\.(png|jpe?g|gif|svg)$/],
  chainWebpack(config, { webpack }) {
    //  svg 使用 file-loader 引入
    config.module.rule('svg-with-file')
      .test(/.svg$/)
      .use('svg-with-file-loader')
      .loader('file-loader')
      .options({
        name: 'static/[name].[hash:8].[ext]'
      });

    //  png|jpe?g|gif 使用 file-loader 引入
    config.module.rule('image-file')
      .test(/\.(png|jpe?g|gif)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'static/[name].[hash:8].[ext]'
      });
  },
  targets: { ie: 11 },
  /**
   * 路由相关配置
   */
  routes: pageRoutes,
  disableRedirectHoist: true,
  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    BaseUrl: process.env.http_env == 'prod' ? '' : 'http://192.168.50.150:10010/',
    ENVment:  process.env.http_env == 'prod' ? 'prod' : '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: { 'primary-color': "#374AFB" },
  externals: { '@antv/data-set': 'DataSet' },
  ignoreMomentLocale: true,
  lessLoaderOptions: { javascriptEnabled: true },
  proxy: {
    '/api': {
      // 'target': process.env.http_env == 'prod' ? '' : 'http://192.168.50.150:10010', // 局域测试
      'target': process.env.http_env == 'prod' ? '' : 'http://192.168.50.150:10013', // 局域测试 - super
      // 'target': process.env.http_env == 'prod' ? '' : 'http://106.14.238.30:8081', // 云测试
      // 'target': process.env.http_env == 'prod' ? '' : 'http://114.220.74.22:22466', // 正式
      'changeOrigin': true,
    },
  },
  history: 'hash',
};
