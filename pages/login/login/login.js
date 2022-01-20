// pages/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: true,
    phone: "",
    verifyCode: "",
    verifyDisable: false,
    verifyText: "获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //获取验证码
  getVerifyCode: function (e) {
    if (this.data.verifyDisable) {
      return;
    }else if(!app.checkPhoneNumber(this.data.phone)){
      return;
    }else {
      this.setData({
        verifyText: "60秒",
        verifyDisable: true
      });
    }
    this.checkVerifyBtn();
  },
  //电话号码
  changePhone: function (e) {
    var value = e.detail.value;
    this.setData({
      phone: value
    });
    this.check(value, this.data.verifyCode);
  },
  //验证码
  changeVerifyCode: function (e) {
    var value = e.detail.value;
    this.setData({
      verifyCode: value
    });
    this.check(this.data.phone, value);
  },
  //电话与验证码是否填好
  check: function (phone, verifyCode) {
    var disable = true;
    if(phone.length == 11 && verifyCode.length == 6) {
      disable = false;
    }
    if (this.data.disable != disable) {
      this.setData({
        disable: disable
      });
    }
  },
  //控制验证码获取频率
  checkVerifyBtn: function (e) {
    var n = 60;
    var invertal = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(invertal);
        this.setData({
            verifyDisable: false,
            verifyText: "获取验证码"
        })
      } else {
        this.setData({
          verifyText: n + "秒"
        })
      }
    }, 1000);
  }
  
})