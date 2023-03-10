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
    init_spent_year: 0,
    spent: 0,
    max_spend: 2000,
    spent_year: 0,
    max_spend_year: 20000,
    day_max_spend: 2000,
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
        console.log('course', course)
      },
      fail: res => {
        console.log(res);
      }
    });

    //获取预计支付课程费用 年
    var years = date(new Date().getTime()).substr(0, 4);
    http.request({
      url: '/wxCourse/getMoneyOfYear',
      loading: true,
      data: {
        sid: uid,
        year: years
      },
      success: res => {
        console.log('years:', res);
        var spent_year = res.parameter.totalMoney;
        var max_spend_year = res.parameter.maxMoney
        this.setData({
          init_spent_year: spent_year,
          spent_year: spent_year,
          max_spend_year: max_spend_year
        });
      },
      fail: res => {
        console.log("fail:years", res)
      }
    });

    //获取预计支付课程费用 月
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

    //获取每天最大 花费限制
    // var nowDay = date(new Date().getTime()).substr(0, 10);
    // console.log(nowDay)
    // http.request({
    //   url: '/wxCourse/getMoneyOfDay',
    //   loading: true,
    //   data: {
    //     sid: uid,
    //     days: nowDay
    //   },
    //   success: res => {
    //     var day_max_spend = res.parameter.maxMoney;
    //     var day_total_spen = res.parameter.totalMoney;
    //     this.setData({
    //       day_max_spend: max_spend
    //     });
    //   },
    //   fail: res => {
    //     console.log(res)
    //   }
    // });
  },
  checkDaySpent: function (nowDay) {
    return new Promise(async (resolve, reject) => {
      var userInfo = await app.getUserInfo();
      var uid = userInfo.id;
      // 获取每天最大 花费限制
      http.request({
        url: '/wxCourse/getMoneyOfDay',
        loading: true,
        data: {
          sid: uid,
          days: nowDay
        },
        success: res => {
          var day_max_spend = res.parameter.maxMoney;
          var day_total_spend = res.parameter.totalMoney;
          var data = {
            day_max_spand: day_max_spend,
            day_total_spend: day_total_spend
          }
          resolve(data)
        },
        fail: res => {
          console.log(res)
          reject(res)
        }
      });
    })
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
  selectCourse: async function (res) {
    // 选上了
    var index = parseInt(res.currentTarget.id);
    var isSelect = this.data.isSelect;
    isSelect[index] = this.data.isSelect[index] == 0? 1: 0;

    //判断当天费用是否超标
    var course = this.data.course;
    var selectCourse = course[index]
    var currentDay = selectCourse.s_time.substr(0, 10)
    const daySpentData = await this.checkDaySpent(currentDay)
    var currentMoney = daySpentData.day_total_spend;
  
    for(let i in isSelect) {
      if(isSelect[i] == 1 && course[i] && course[i].s_time.substr(0, 10) == currentDay) {
        currentMoney += parseInt(course[i].money);
      }
    }
    console.log(currentMoney)

    if (currentMoney > daySpentData.day_max_spand) {
      wx.showToast({
        title: currentDay + '日课时费已超过' + daySpentData.day_max_spand +'元。!',
        icon: 'none'
      });
      // 2022-12-28 您已选课程的总课时费为150元，已经超过140元。
      isSelect[index] = this.data.isSelect[index] == 0? 1: 0;
      return;
    }
    // 总金额判断
    if (!this.checkCourse(isSelect)) {//超额则返回
      isSelect[index] = this.data.isSelect[index] == 0? 1: 0;
      return;
    }
    // 总金额判断 年
    if (!this.checkCourseYear(isSelect)) {//超额则返回
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
  //检查课时费是否超额 年
  checkCourseYear: function (isSelect) {
    var spent = parseInt(this.data.init_spent_year);
    var max_spend = parseInt(this.data.max_spend_year);
    var course = this.data.course;
    for(let i in isSelect) {
      if(isSelect[i] == 1) {
        spent += parseInt(course[i].money);
      }
    }
    if(spent > max_spend) {
      wx.showToast({
        title: '年可选课程已达到最高!',
        icon: 'none'
      });
      return false;
    }else {
      this.setData({
        spent_year: spent
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