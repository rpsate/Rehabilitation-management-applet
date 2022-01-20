// pages/attend/attend/attend.js
const app = getApp();
import { HTTP } from "../../../utils/http.js";
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();
    var sid = userInfo.id;
    http.request({
      url: "/wxAttendance/my",
      loading: true,
      data: {
        sid: sid
      },
      success: res => {
        var data = res.parameter;
        for(let i in data) {
          var s_months = data[i].months;
          s_months = s_months.substr(0, 4) + "年" + s_months.substr(6, 2) + "月";
          data[i].s_months = s_months;
        }
        console.log(data)
        this.setData({
          data: data
        });
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    });

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

  },
  getDetail: function(res) {
    var sid = res.target.dataset.sid;
    var months = res.target.dataset.months;
    wx.navigateTo({
      url: '/pages/attend/detail/detail?sid=' + sid + '&months=' + months
    });
  }
})