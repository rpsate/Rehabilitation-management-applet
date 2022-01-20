// pages/mycourse/commentPost/commentPost.js
import { HTTP } from "../../../utils/http.js";
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {},
    text: "",
    comment: [
      "请选择",
      "优秀",
      "良好",
      "一般",
      "很差"
    ],
    comment_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var course = options.course;
    if(options.course) {
      course = JSON.parse(course);
      this.setData({
        course: course
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
  changeComment: function (e) {
    this.setData({
      comment_index: e.detail.value
    });
  },
  inputText: function (e) {
    var data = e.detail.value;
    this.setData({
      text: data
    });
  },
  submit: function (e) {
    var evaluate = this.data.comment_index;
    console.log(evaluate)

    if (evaluate == 0) {
      wx.showToast({
        title: '请选择评价等级',
        icon: 'none'
      });
      return;
    }
    var comment = this.data.text;
    var course = this.data.course;
    var cid = course.cid;
    var sid = course.sid;

    http.request({
      url: "/wxCourse/evaluate",
      loading: true,
      data: {
        sid: sid,
        cid: cid,
        evaluate: evaluate,
        remark: comment
      },
      success: res => {
        //修改上级页面数据，将未评价改成已经评价
        this.setCourseComplete(evaluate, comment);
        //弹出提示框
        wx.showModal({
          confirmColor: '#1a8be9',
          showCancel: false,
          title: '提示',
          content:'评价成功',
          complete: (res) => {
            wx.navigateBack({
              delta: 1
            });
          },
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  setCourseComplete: function (evaluate, remark) {
    //将上一级目录中该课程修改为已完成
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var course = this.data.course;
    var evaluateList = [{
      evaluate: evaluate,
      remark: remark
    }];
    course.isComplete = 1;//修改为已评价
    course.c_type = 3 //按钮方式
    course.evaluateList = evaluateList;
    console.log(course);
    
    if (course.type == 0) {//推荐课程 r_data
      var pre_r_data_0 = prevPage.data.r_data[0];
      var pre_r_data_1 = prevPage.data.r_data[1];
      pre_r_data_0.splice(course.index, 1);
      pre_r_data_1.unshift(course);
      prevPage.setData({
        r_data: [pre_r_data_0, pre_r_data_1]
      });

    }else if(course.type == 1) {//自选课程 s_data
      var pre_s_data_0 = prevPage.data.s_data[0];
      var pre_s_data_1 = prevPage.data.s_data[1];
      pre_s_data_0.splice(course.index, 1);
      pre_s_data_1.unshift(course);
      prevPage.setData({
        s_data: [pre_s_data_0, pre_s_data_1]
      });
    }
  }
})