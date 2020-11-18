// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asycWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow () {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);
    this.setData({
      address
    })
  },
  onLoad: function (options) {

  },
  // 点击 收货地址
  async handleChooseAddress () {
    /**
     * 获取收货地址
     * 先获取 收货地址 所授予的权限 scope
     *  1.确认  scope 值为 true
     *  2.取消  scope 值为 false
     *  3.没有调用  scope 值为 undefined
     */

    /** 
     wx.getSetting({
       success: (result) => {
         // 获取权限状态
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1)
            }
          });
        } else {
          // 用户以前拒绝过授予权限，先诱导用户打开用户权限
          wx.openSetting({
            success: (result2) => {
              // 可以调用 收货地址代码
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3)
                }
              });
            }
          });

        }
      }
    });
    */

    try {
      const res1 = await getSetting();
      // 获取权限状态
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        // 用户以前拒绝过授予权限，先诱导用户打开用户权限
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 缓存数据
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }

  },
  // 商品选中事件
  handleItemChange (e) {
    // 获取被修改的商品 id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 重新设置到 data 和 缓存中 
    this.setCart(cart);
  },
  // 设置购物车状态，重新计算全选、总价格、总数量
  setCart (cart) {
    // 全选
    // every 数组方法 会遍历 会接收一个回调函数 
    // 每一个回调函数都返回 true,every 方法的返回值就为 true,只要有一个回调函数返回了 false，就不再循环执行，直接返回 false
    // 空数组 调用 every,返回值就是 true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    let allChecked = true;

    // 总价格
    let totalPrice = 0;
    // 总数量
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    wx.setStorageSync("cart", cart);
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
  },
  // 全选和反选
  handleItemAllCheck () {
    // 获取 data 中的数据
    let { cart, allChecked } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 修改 cart 数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  // 商品数量的编辑 加 减 
  async handleItemNumEdit (e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } else if (res.cancel) {
        cart[index].num = 1;
        this.setCart(cart);
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 结算
  async handlePay () {
    const { address, totalNum } = this.data;
    // 判断收货地址
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})