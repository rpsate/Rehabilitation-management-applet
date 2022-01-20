// pages/mycourse/commentDetail/commentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: [],
    evaluate: "",
    remark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var course = options.course;
    if(options.course) {
      course = JSON.parse(course);
      const comment = ["请选择","优秀","良好","一般","很差"];
      console.log(course.evaluateList);
      var evaluate = comment[course.evaluateList[0].evaluate];
      var remark = course.evaluateList[0].remark
      this.setData({
        course: course,
        evaluate: evaluate,
        remark: remark
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

  },
  goBack: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})