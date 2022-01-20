// pages/mycourse/selectCourse/selectCourse.js
const app = getApp();
import { HTTP } from "../../../utils/http";
import { date } from "../../../utils/util.js"
var http = new HTTP();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: [],
    init_spent: 0,
    spent: 0,
    max_spend: 2000,
    isSelect: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();
    var uid = userInfo.id;
    // //获取可选课程信息
    http.request({
      url: '/wxCourse/getCanSelectList',
      loading: true,
      data: {
        uid: uid
      },
      success: res => {
        var course = res.parameter;
        var isSelect = [];
        for(let i in course) {
          course[i].s_time = date(course[i].startTime);
          isSelect[i] = 0;
        }
        this.setData({
          course: course,
          isSelect: isSelect
        });
      },
      fail: res => {
        console.log(res);
      }
    });

    //获取预计支付课程费用
    var months = date(new Date().getTime()).substr(0, 7);
    http.request({
      url: '/wxCourse/getMoneyOfMonth',
      loading: true,
      data: {
        sid: uid,
        months: months
      },
      success: res => {
        console.log(res);
        var spent = res.parameter.totalMoney;
        var max_spend = res.parameter.maxMoney
        this.setData({
          init_spent: spent,
          spent: spent,
          max_spend: max_spend
        });
      },
      fail: res => {
        console.log(res)
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
  getDetail: function (res) {
    var id = res.currentTarget.id;
    var course = this.data.course[id];
    course.courseName = course.name;
    course = JSON.stringify(course)
    wx.navigateTo({
      url: '/pages/mycourse/courseDetail/courseDetail?course=' + course,
    });
  },
  //点击选课按钮，改变选课数据
  selectCourse: function (res) {
    var index = parseInt(res.currentTarget.id);
    var isSelect = this.data.isSelect;
    isSelect[index] = this.data.isSelect[index] == 0? 1: 0;
    if (!this.checkCourse(isSelect)) {//超额则返回
      isSelect[index] = this.data.isSelect[index] == 0? 1: 0;
      return;
    }
    this.setData({
      isSelect: isSelect
    });
  },
  //检查课时费是否超额
  checkCourse: function (isSelect) {
    var spent = parseInt(this.data.init_spent);
    var max_spend = parseInt(this.data.max_spend);
    var course = this.data.course;
    for(let i in isSelect) {
      if(isSelect[i] == 1) {
        spent += parseInt(course[i].money);
      }
    }
    console.log("spent", spent);
    if(spent > max_spend) {
      wx.showToast({
        title: '可选课程已达到最高!',
        icon: 'none'
      });
      return false;
    }else {
      this.setData({
        spent: spent
      });
      return true;
    }
  },
  submit: async function (res) {
      //获取学生id
      var userInfo = await app.getUserInfo();
      var sid = userInfo.id;

      //获取选课id
      var isSelect = this.data.isSelect;
      var course = this.data.course;
      var cids = [];
      for(let i in isSelect) {
        if(isSelect[i] == 1) {
          cids.push(course[i].id);
        }
      }
      cids = cids.join(",");

      //提交数据
      http.request({
        url: '/wxCourse/select',
        loading: true,
        data: {
          cids: cids,
          sid: sid
        },
        success: res => {
          wx.showModal({
            confirmColor: '#1a8be9',
            showCancel: false,
            title: '提示',
            content:'选课成功',
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
  }
})