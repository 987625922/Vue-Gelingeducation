import axios from 'axios';
import store from "@/store";
import { MessageBox, Message } from 'element-ui'
import { getToken } from '@/utils/auth'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

//http request 拦截器
service.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers['token'] = getToken()
    }
    // 设置参数格式
    if (!config.headers['Content-Type'] && config.method === 'post') {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);


//http response 拦截器
service.interceptors.response.use(
  res => {
    if (res.data.code == 200) {
      return res.data;
    } else {
      Message({
        message: res.data.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
