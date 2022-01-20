// pages/attend/reattend/reattend.js
const app = getApp();
import {HTTP} from "../../../utils/http.js"
import {date} from "../../../utils/util.js"
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "选择日期",
    remark: "",
    course: null,
    courseStatus: "200",
    canReAttend: true,
    count: 2,
    isDisabled: false,
    //0：已打卡，1：未打卡，2：审批中，3：审批驳回，4：审批通过
    statusTip: {
      key: ["0", "2", "3", "4"],
      value: {
        "0": "当天已经打卡！",
        "2": "当天打卡审批中！",
        "3": "当天补卡已被驳回！",
        "4": "当天补卡审批已通过！"
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从考勤详细进到次页面
    if(options.course) {
      var course = JSON.parse(options.course);
      var time = date(course.attendanceDate).substr(0, 10);
      this.setData({
        course: course,
        date: time,
        isDisabled: true
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
  changeDate: async function (e) {
    var time = e.detail.value;
    var months = time.substr(0, 7);
    var userInfo = await app.getUserInfo();
    var sid = userInfo.id;
    console.log(months, sid)
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
        var course = null;
        var courseStatus = "";
        for(let i in data) {
          var attendanceTime = date(data[i].attendanceDate);
          var status = this.getStatus(data[i].status);
          attendanceTime = attendanceTime.substr(0, 10);
          console.log("time:", time)
          console.log("date:", attendanceTime)
          if (time == attendanceTime) {
            course = data[i];
            courseStatus = status;
          }
          if(status == 2 || status == 4) {
            count++;
          }
        }
        console.log("course:", course);
        if(count >= this.data.count) {
          canReAttend = false;
        }
        this.setData({
          course: course,
          courseStatus: courseStatus,
          canReAttend: canReAttend,
        });
      },
      fail: res => {
        console.log(res);
      }
    });
    this.setData({
      date: time
    });
  },
  input: function(res) {
    var remark = res.detail.value;
    console.log("remark",remark)
    this.setData({
      remark: remark
    });
  },
  submit: async function(e) {
    //判断是否选择了日期
    var courseStatus = this.data.courseStatus.toString();
    if(courseStatus == "200" && this.data.date == "选择日期") {
      wx.showModal({
        confirmColor: '#1a8be9',
        showCancel: false,
        title: '提示',
        content:'选择日期!'
      });
      return;
    }
    //当月是否补卡达到上限
    if(!this.data.canReAttend) {
      wx.showModal({
        confirmColor: '#1a8be9',
        showCancel: false,
        title: '提示',
        content:'当月补卡以达到上限！'
      });
      return;
    }
    //检查课程是否存在或是是否可以补卡
    var course = this.data.course;
    if(course == null) {
      wx.showModal({
        confirmColor: '#1a8be9',
        showCancel: false,
        title: '提示',
        content:'当天没有课程信息！'
      });
      return;
    }
    var statusTip = this.data.statusTip;

    if(statusTip.key.indexOf(courseStatus) >= 0) {
      wx.showModal({
        confirmColor: '#1a8be9',
        showCancel: false,
        title: '提示',
        content: statusTip.value[courseStatus],
        fail: res => {
          console.log(res)
        }
      });
      return;
    }

    //检查原因字符
    var remark = this.data.remark;
    if(remark.length < 10) {
      wx.showToast({
        title: '原因不能少于10个字！',
        icon: 'none'
      });
      return;
    }
    //获取用户信息
    var userInfo = await app.getUserInfo();
    var sid = userInfo.id;
    var attendanceTime = date(course.attendanceDate).substr(0, 11) + "09:00:00"
    attendanceTime = new Date(attendanceTime).getTime()
    console.log("打卡时间：", date(attendanceTime))
    http.request({
      url: "/wxAttendance/add",
      requestType: 'json',
      loading: true,
      data: {
        sid: sid,
        attendanceTime: attendanceTime,
        schoolid: course.schoolId,
        remark: encodeURI(remark)
      },
      success: res => {
        //补卡成功，返回上级目录
        wx.showModal({
          confirmColor: '#1a8be9',
          showCancel: false,
          title: '提示',
          content:'补卡成功',
          complete: (res) => {
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];
            page.setData({
              isFresh: true
            });
            wx.navigateBack({
              delta: 1
            });
          }
        });
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    });
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