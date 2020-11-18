// pages/search/index.js
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import { request } from '../../request/index.js'
/**
 * 防抖（定时器） 一般用在输入框中，防止重复输入，重复发送请求
 * 节流 一般是用在页面下拉和上拉
 */
Page({
  data: {
    goods: [],
    // 取消按钮 是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值改变触发的事件
  handleInput (e) {
    // 获取输入框的值
    const { value } = e.detail;
    // 检测合法性
    if (!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      });
      return;
    }
    this.setData({
      isFocus: true
    });
    // 清除定时器
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 准备发生请求，获取数据
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求，获取搜索建议的数据
  async qsearch (query) {
    const res = await request({ url: '/goods/qsearch', data: { query } });
    this.setData({
      goods: res
    })
  },
  // 取消
  handleCancel () {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})