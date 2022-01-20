// pages/me/evaluation/evaluation.js
const app = getApp();
import {HTTP} from "../../../utils/http.js";
import {date} from "../../../utils/util.js";
import {config} from "../../../config.js";
var http = new HTTP()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    imagesList: [],
    type: ["入训评估", "中期评估", "结训评估"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();
    console.log(userInfo)
    http.request({
      url: '/wxStudent/getMyAssess',
      loading: true,
      data: {
        sid: userInfo.id
      },
      success: res => {
        var data = res.parameter;
        var imagesList = [];
        for(let i in data) {
          data[i].s_time = date(data[i].createTime);
          var images = data[i].url;
          images = images.split(",");
          imagesList[i] = images;
        }
        console.log(data)
        this.setData({
          data: data,
          imagesList: imagesList
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    this.setData({
      baseUrl: config.appUrl
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
  back: res => {
    wx.navigateBack({
      delta: 1,
    });
  },
  //预览图片
  previewImage: function(e) {
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var images = this.data.imagesList[index];
    var baseUrl = config.appUrl;
    for(let i in images) {
      if(images[i].indexOf(baseUrl) == -1) {
        images[i] = baseUrl + images[i];
      }
    }
    wx.previewImage({
      current: images[id],
      urls: images
    });
  },
})