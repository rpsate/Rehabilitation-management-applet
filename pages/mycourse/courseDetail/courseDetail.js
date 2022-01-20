// pages/mycourse/courseDetail/courseDetail.js
import { HTTP } from "../../../utils/http.js";
import { date } from "../../../utils/util.js"
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var course = options.course;
    if(course) {
      course = JSON.parse(course);
      if(course.remark == null) {
        course.remark = "";
      }
      this.setData({
        course: course
      });
    }

    // var cid = options.cid
    // if(cid) {
    //   http.request({
    //     url: "/wxCourse/getCourseInfo",
    //     loading: true,
    //     data: {
    //       cid: cid
    //     },
    //     success: res => {
    //       var data = res.parameter;
    //       if(data.remark == null) {
    //         data.remark = "";
    //       }
    //       data.s_time = date(data.startTime);
    //       this.setData({
    //         course: data
    //       });
    //     },
    //     fail: res => {
    //       console.log(res);
    //     }
      // });

    // }
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
  back: function() {
    wx.navigateBack({
      delta: 1
    });
  }
})