// pages/category/index.js
//引入
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口返回的数据
  Cates: [],
  onLoad: function (options) {
    // 缓存技术
    const Cates = wx.getStorageSync("cates");
    // 是否有本地缓存
    if (!Cates) {
      this.getCates();
    } else {
      // 是否过期
      if (Date.now() - Cates.time > 1000 * 600) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCates () {
    // request({ url: "/categories" })
    //   .then(res => {
    //     this.Cates = res.data.message;
    //     // 把接口数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     // console.log(Cates);
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    // 使用 es7 的 async await 来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap (e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的 scroll-view 标签距离顶部的距离
      scrollTop: 0
    })
  }
})