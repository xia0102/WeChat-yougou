// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // 获取参数goods_id
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodsDetail(goods_id);
  },
  // 获取数据
  async getGoodsDetail (goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;

    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机不识别 webp 图片格式
        // 确保后台存在 1.webp  =>  1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage (e) {
    // 图片预览
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接收传递过来的图片 url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });

  },
  // 点击加入购物车
  handleCartAdd () {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断 商品对象是否存在购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在
      // 数量
      this.GoodsInfo.num = 1;
      // 选中状态
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 存在 num++
      cart[index].num++;
    }
    // 把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // mask: true 防止用户手抖，疯狂点击
      mask: true
    });

  },
  // 点击收藏
  handleCollect () {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index != -1) {
      // 已经收藏,在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    } else {
      // 没收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改 data 中的属性
    this.setData({
      isCollect
    })
  }
})