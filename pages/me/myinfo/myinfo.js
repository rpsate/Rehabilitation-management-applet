// pages/me/myinfo/myinfo.js
const app = getApp();
import { date } from "../../../utils/util";
import {config} from "../../../config.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ["", "男", "女"],
    ageGroup: ["", "0-6岁", "7-14岁"],
    cjType: ['', '听障言语', '孤独症', '智力', '脑瘫'],
    istrain: ['未参加', '已参加'],
    baseUrl: "",
    imagesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();

    //格式化生日
    var s_birthday = date(userInfo.birthday);
    s_birthday = s_birthday.substr(0, 7);
    userInfo.s_birthday = s_birthday;

    //格式化注册日期
    var s_createTime = date(userInfo.createTime);
    s_createTime = s_createTime.substr(0, 10);
    userInfo.s_createTime = s_createTime;

    //格式化图片
    var images = userInfo.fileURL;
    images = images.split(",");
    userInfo.images = images;

    //缓存图片
    // var baseUrl = config.appUrl;
    // var imagesList = [];
    // for(let i in images) {
    //   wx.downloadFile({
    //     url: baseUrl + images[i],
    //     success: res => {
    //       if(res.statusCode == 200) {
    //         imagesList[i] = res.tempFilePath;
    //         console.log(imagesList)
    //         this.setData({
    //           imagesList: imagesList
    //         })
    //       }
    //     }
    //   })
    // }

    //渲染数据
    this.setData({
      userInfo: userInfo,
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
  evalute: function (res) {
    wx.navigateTo({
      url: '/pages/me/evaluation/evaluation'
    });
  },
  back: function (res) {
    wx.navigateBack({
      delta: 1
    });
  },
  //预览图片
  previewImage: function(e) {
    var id = e.currentTarget.id;
    var images = this.data.userInfo.images;
    var baseUrl = config.appUrl;
    for(let i in images) {
      if(images[i].indexOf(baseUrl) == -1) {
        images[i] = baseUrl + images[i];
      }
    }
    console.log(images)
    console.log(id)
    // var images = this.data.imagesList;
    wx.previewImage({
      current: images[id],
      urls: images
    });
  },
})