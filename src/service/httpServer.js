import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';

// 线上环境配置axios.defaults.baseURL，生产环境则用proxy代理
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = ''; // 地址确定后更换或定义变量
}

axios.defaults.timeout = 30000; // 超时时间
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    if (response.data.message == '非法访问') {
      response.data.message = '您的登录已过期，请重新登录！';
      store.commit('LOGOUT');
      router.push('/');
    }
    return response.data;
  },
  (error) => {
    if (error.response.status && error.response.status === 500) {
      Message.error('服务器异常!');
    } else if (error.response.status && error.response.status === 404) {
      Message.error('找不到访问的地址!');
    } else {
      Message.error('网络错误！');
    }
    // 对响应错误做点什么
    Promise.reject(error);
  }
);
export default {
  post(url, params) {
    return axios({
      method: 'post',
      url: `${url}`,
      data: params || {},
      headers: {
        'Content-Type': 'application/json '
      }
    });
  },
  // formData数据请求
  postFormData(url, params) {
    const data = new FormData();
    for (const key in params) {
      data.append(key, params[key]);
    }
    return axios({
      method: 'post',
      url: `${url}`,
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  // 文件上传
  uploadFile(url, params, header) {
    const data = new FormData();
    for (const key in params) {
      data.append(key, params[key]);
    }
    return axios({
      method: 'post',
      url: `${url}`,
      data,
      headers: {
        ...header,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  // 向指定资源位置上传其最新内容
  put(url, params) {
    return axios({
      method: 'put',
      url: `${url}`,
      data: params || {},
      transformRequest: [
        function (data) {
          let ret = '';
          for (const it in data) {
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`; // 字符串作为 URI 组件进行编码。
          }
          return ret;
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  // 请求服务器删除Request-URI所标识的资源
  delete(url, params) {
    return axios({
      method: 'delete',
      params: params || {},
      url: `${url}`
    });
  },
  get(url, params) {
    const tempParams = {
      ...(params || {}),
      _timer: +new Date() // 解决IE缓存添加一个随机时间戳
    };
    return axios({
      method: 'get',
      params: tempParams,
      url: `${url}`
    });
  }
};
