// pages/auth/index.js
import { request } from "../../request/index.js";
import { login } from "../../utils/asycWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  //  获取用户信息
  async handleGetUserInfo (e) {
    try {
      // const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取小程序登录成功后的 code 值
      // const { code } = await login();
      // const loginParams = { encryptedData, rawData, iv, signature, code };
      // 发送请求，获取用户的 token
      // const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');

      // wx.setStorageSync("token", code);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})