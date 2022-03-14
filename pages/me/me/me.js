import { HTTP } from "../../../utils/http";
const app = getApp()
// pages/me/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: {
      avatarUrl:null,
      nickName: "学霸同学"
    },
    login: false,
    otherList: [
      ["./images/my_course.png", "我的课程", "/pages/mycourse/mycourse/mycourse"],
      ["./images/select_course.png", "选择课程", "/pages/mycourse/selectCourse/selectCourse"],
      ["./images/recommend.png", "课程推荐", "/pages/mycourse/recommendCourse/recommendCourse"],
      ["./images/attendance.png", "我的考勤", "/pages/attend/attend/attend"],
      ["./images/supplement.png", "补打卡", "/pages/attend/reattend/reattend"],
      ["./images/message.png", "上课提醒", "/pages/mycourse/notice/notice"],
      ["./images/me.png", "我的档案", "/pages/me/myinfo/myinfo"],
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (!this.data.login) {
      this.login();
    }
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
  getLoginInfo: function(res) {
    console.log(res)
    var loginInfo = res.detail.userData.userInfo;
    console.log(loginInfo)
    if(loginInfo) {
        wx.setStorage({
            key: 'loginInfo',
            data: loginInfo
        });
        this.setData({
            loginInfo: loginInfo,
            login: true
        });

    }
  },
  goOther: function(res) {
    var id = res.detail.id;
    var url = this.data.otherList[id][2];
    wx.navigateTo({
      url: url
    });
  },
  login: function(res) {
    wx.getStorage({
        key: 'loginInfo',
        success: res => {
          if (res.data != undefined && res.data != "") {
              this.setData({
                  loginInfo: res.data,
                  login: true
              });
          }
        }
    });
  }
})