// pages/mycourse/mycourse/mycourse.js
const app = getApp();
import { HTTP } from "../../../utils/http.js";
import { date } from "../../../utils/util.js"
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_status: 0, //0 显示未完成课程 1显示已完成课程
    s_data: [],//自选课程
    r_data: []//推荐课程
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();
    var uid = userInfo.id;
    //获取自选课程
    http.request({
      url: "/wxCourse/getMyCourseList",
      loading: true,
      data: {
        uid: uid,
        type: 1
      },
      success: res => {
        console.log("select", res);
        var data = res.parameter;
        var s_data = [[], []];
        for(let i in data) {
          data[i].c_type = this.checkCourseStatus(data[i]);
          data[i].s_time = date(data[i].startTime);
          // isComplete == 0 未完成, == 1 完成
          // course_status == 0 显示已完成课程 == 1显示未完成课程
          if(data[i].isComplete == 0 ) {
            s_data[0].push(data[i]);
          }else {
            s_data[1].push(data[i]);
          }
        }
        console.log(data)
        console.log("s_data", s_data)
        this.setData({
          s_data: s_data
        });
      },
      fail: res => {
        console.log(res);
      }
    });

    //获取推荐课程
    http.request({
      url: "/wxCourse/getMyCourseList",
      loading: true,
      data: {
        uid: uid,
        type: 0
      },
      success: res => {
        var data = res.parameter;
        var r_data = [[], []];
        for(let i in data) {
          data[i].c_type = this.checkCourseStatus(data[i]);
          data[i].s_time = date(data[i].startTime);
          // isComplete == 0 未完成, == 1 完成
          // course_status == 0 显示已完成课程 == 1显示未完成课程
          if(data[i].isComplete == 0 ) {
            r_data[0].push(data[i]);
          }else {
            r_data[1].push(data[i]);
          }
        }
        console.log("r_data", r_data)
        this.setData({
          r_data: r_data
        });
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
  getIncompleteCourse: function() {    
    this.setData({
      course_status: 0
    });
  },
  getCompleteCourse: function() {
    this.setData({
      course_status: 1
    });
  },
  checkCourseStatus: res => {
    // 1 未完成，不能评价
    // 2 未完成，能评价
    // 3 已完成，已评价
    // isComplet  0：未完成 1：已完成
    var type = 3;
    var status = res.isComplete;
    if(status == 0) {
      var end_time = res.endTime;
      if(end_time == null || end_time == "") {
        var newDate = new Date(res.startTime)
        newDate.setHours(newDate.getHours()+parseInt(res.hours));
        end_time = newDate.getTime();
      }
      var now = new Date().getTime();
      type = end_time > now? 1: 2;
    }
    return type
  },
  getDetail: function(res) {
    var course = this.getCourseData(res);
    course = JSON.stringify(course)
    wx.navigateTo({
      url: '/pages/mycourse/courseDetail/courseDetail?course=' + course,
    });
  },
  doComment: function(res) {
    var course = this.getCourseData(res);
    course = JSON.stringify(course)    
    wx.navigateTo({
      url: '/pages/mycourse/commentPost/commentPost?course=' + course,
    });
  },
  viewComment: function(res) {
    var course = this.getCourseData(res);
    course = JSON.stringify(course);
    wx.navigateTo({
      url: '/pages/mycourse/commentDetail/commentDetail?course=' + course,
    });
  },
  getCourseData: function (res) {
    var a_data = res.target.dataset.data;
    var data;
    if(a_data == "r_data") {
      data = this.data.r_data;
    }else {
      data = this.data.s_data;
    }
    var course_status = res.target.dataset.status;
    var id = res.target.id;
    var course_data = data[course_status][id];
    course_data.index = id;
    return course_data;
  }
})