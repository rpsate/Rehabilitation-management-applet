// pages/attend/process/process.js
const app = getApp();
import {HTTP} from "../../../utils/http.js"
import {date} from "../../../utils/util.js"
var http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "2020-10-01",
    reason: "",
    result: ["等待审批", "审批通过", "审批驳回"],
    level: ["","培训机构审批", "区残联审批"],
    raw_data: [
      {
        type: 0,
        title: "提交申请",
        tip: "您已提交申请",
        time: "",
        persion: "",
        reason: "",
        active: true
      },
      {
        type: 0,
        title: "培训机构审批",
        tip: "未审批",
        time: "",
        persion: "",
        reason: "",
        active: false
      },
      {
        type: 0,
        title: "区残联审批",
        tip: "未审批",
        time: "",
        persion: "",
        reason: "",
        active: false
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var time = options.time || ""
    if(!id) {
      return;
    }

    //初始化数据
    var result = this.data.result;
    var level = this.data.level;
    var data = this.data.raw_data;
    data[0].time = "2020-20-20";

    http.request({
      url: '/wxAttendance/getMyApprove',
      loading: true,
      data: {
        id: id
      },
      success: res => {
        console.log(res);
        var parameter = res.parameter.list;
        parameter = parameter.reverse();
        var reason = res.parameter.reason || "";
        var create_time = res.parameter.createTime || new Date().getTime();
        create_time = date(create_time).substr(0, 10);
        data[0].time = create_time;
        console.log("create_time:",create_time)
        console.log(parameter);
        

        for(let i in parameter) {
          var index = parseInt(i) + 1;
          console.log("index:", index);
          data[index] = {
            type: parameter[i].remark==null? 0: 1,
            title: level[parameter[i].level],
            tip: result[parameter[i].result],
            time: date(parameter[i].createTime),
            persion: parameter[i].createName,
            reason: parameter[i].remark,
            active: true
          }
        }
        console.log(reason)
        this.setData({
          reason: reason,
          data: data,
          time: time
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
  back: function (res) {
    wx.navigateBack({
      delta: 1
    });
  }
})