// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  /**
    * 页面的初始数据
    */
  data: {
    // tab 栏数组
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表的数据
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pageSize: 20
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // tab 栏 点击事件
  handleTabsItemChange (e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList () {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res);
    // 获取总条数
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pageSize);
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口，直接关闭也不会报错
    wx.stopPullDownRefresh();
  },
  // 页面上滑 滚动条触底事件
  onReachBottom () {
    // 判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据'
      });

    } else {
      // 有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  /**
   * 下拉刷新 
   * json 中开启下拉刷新  "enablePullDownRefresh": true
   *  下拉刷新的小圆点   "backgroundTextStyle": "dark"
  */
  onPullDownRefresh () {
    // 重置数组  重置页码  发送请求
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  }

})