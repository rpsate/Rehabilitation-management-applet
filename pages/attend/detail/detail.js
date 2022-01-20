// pages/attend/detail/detail.js
import { HTTP } from "../../../utils/http.js"
import { date } from "../../../utils/util.js"
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attend: [],
    data: [],
    sid: "",
    months: "",
    isFresh: false,
    canReAttend: true,
    count: 20//每月最多补卡次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sid = options.sid;
    var months = options.months;
    if(!options.sid || !months) {
      return;
    }else {
      this.setData({
        sid: sid,
        months: months,
        isFresh: false
      });
      console.log("months,sid", months, sid);
    }
    http.request({
      url: '/wxAttendance/info',
      loading: true,
      data: {
        sid: sid,
        months: months
      },
      success: res => {
        console.log(res)
        var count = 0;
        var canReAttend = true;
        var data = res.parameter;
        var attend = [];
        for(let i in data) {
          var time = date(data[i].attendanceDate);
          var status = this.getStatus(data[i].status);
          attend.push([time.substr(5, 5), time.substr(11, 5), status])
          if(status == 2 || status == 4) {
            count++;
          }
        }
        if(count >= this.data.count) {
          canReAttend = false;
        }
        this.setData({
          attend: attend,
          data: data,
          canReAttend: canReAttend
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
    console.log("onshow")
    if(this.data.isFresh) {
      this.onLoad({
        sid: this.data.sid,
        months: this.data.months
      });
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
  reAttend: function (res) {
    var index = res.detail.id;
    var course = this.data.data[index]
    var status = this.getStatus(course.status);
    if(status == 1) {
      //未打卡
      var canReAttend = this.data.canReAttend;
      if(!canReAttend) {
        wx.showModal({
          confirmColor: '#1a8be9',
          showCancel: false,
          title: '提示',
          content:'本月补卡以达到上限！'
        });
        return;
      }
      course = JSON.stringify(course);
      wx.navigateTo({
        url: '/pages/attend/reattend/reattend?course=' + course,
      });
    }else {
      //审批中
      var time = date(course.attendanceDate).substr(0, 10);
      wx.navigateTo({
        url: '/pages/attend/process/process?id=' + course.id + "&time=" + time,
      });
    }
  },
  //通过打卡状态获取按钮状态
  getStatus: function(status) {
    /*
      -1: 未打卡
      0：待审批
      1：机构驳回审批
      2：机构通过审批
      3：残联驳回审批
      4：残联通过审批
      5：正常状态
    */
    switch(status) {
      case -1:
        return 1;//未打卡
      case 0:
      case 2:
        return 2;//审批中
      case 1:
      case 3:
        return 3;//审批驳回
      case 5:
        return 0;//已打卡
      default:
        return 4;//审批完成
    }
  }
})