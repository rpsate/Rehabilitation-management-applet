// pages/mycourse/notice/notice.js
const app = getApp()
import { HTTP } from "../../utils/http.js";
var http = new HTTP();

const MAX = 20

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //没有获取用户信息叫跳转到注册页面
    // app.getUserInfo({
    //   error: res => {
    //     var code = res.code;
    //     if(code == "108") {
    //       wx.navigateTo({
    //         url: '/pages/login/register/register'
    //       });
    //     }
    //   }
    // });

    var notice_unread = await app.getNoticeUnread(true) || [];
    var notice_read = wx.getStorageSync('notice_read') || [];
    notice_read = notice_unread.concat(notice_read);
    if(notice_read.length > MAX) {
      notice_read.splice(MAX, notice_read.length - MAX)
    }
    console.log(notice_read.length)
    console.log(notice_unread)
    //渲染数据
    this.setData({
      notice: notice_read,
    });
    //保存数据
    wx.setStorage({
      key: "notice_read",
      data: notice_read
    });

    //改变消息状态
    for(let i in notice_unread) {
      http.request({
        url: '/wxMessage/updateStatus',
        data: {
          id: notice_unread[i].id
        },
        success: res => {
          console.log(res)
        },
        fail: res => {
          console.log(res);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})