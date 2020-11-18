// pages/feedback/index.js
Page({
  data: {
    // tab 栏数组
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    collect: [],
    // 被选中的图片路径
    chooseImgs: [],
    // 文本框内容
    textVal: ""
  },
  // 外网的图片路径数组
  UploadImages: [],
  onShow () {
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
  // 点击 +
  handleChooseImg () {
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片格式  原图      压缩
      sizeType: ['original', 'compressed'],
      // 图片来源  相册      照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });

  },
  // 点击 x 自定义图片组件
  handleRemoveImg (e) {
    // 获取被点击的组件索引
    const { index } = e.currentTarget.dataset;
    // 获取 data 中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput (e) {
    this.setData({
      textVal: e.detail.value
    });
  },
  // 提交
  handleFormSubmit () {
    // 获取文本域的内容
    const { textVal, chooseImgs } = this.data;
    // 合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        // 准备上传图片
        // 上传文件的 api 不支持多个文件同时上传，所以使用遍历数组，挨个上传
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件路径
          filePath: v,
          // 上传的文件名称  后台获取文件
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url;
            this.UploadImages.push(url);

            // 所有图片都上传完毕才触发
            if (i === chooseImgs.length - 1) {
              // 关闭正在上传中
              wx.hideLoading();
              // 重置页面
              this.setData({
                textVal: '',
                chooseImgs: []
              });
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    } else {
      // 关闭正在上传中
      wx.hideLoading();
      // 重置页面
      this.setData({
        textVal: ''
      });
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }


  }
})