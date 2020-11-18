//index.js
//引入
import { request } from "../../request/index.js";

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },
  // 页面开始加载  就会触发
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList () {
    request({ url: "/home/swiperdata" })
      .then(result => {
        result.map(i => i.navigator_url = i.navigator_url.replace(/main/, 'index'));
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取分类导航数据
  getCateList () {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  // 获取楼层数据
  getFloorList () {
    request({ url: "/home/floordata" })
      .then(result => {
        result.forEach(v => v.product_list.forEach(i => i.navigator_url = i.navigator_url.replace('?', '/index?')));
        this.setData({
          floorList: result
        })
      })
  }
})
