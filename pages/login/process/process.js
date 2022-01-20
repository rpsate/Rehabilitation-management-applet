// pages/login/register-process/process.js
const app = getApp();
import { HTTP } from "../../../utils/http.js";
import { date } from "../../../utils/util.js";
import { LoginModel} from "../../../models/login.js";
var http = new HTTP()
var loginModel = new LoginModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: ["等待审批", "审批通过", "审批驳回"],
    level: ["","培训机构审批", "区残联审批"],
    createTime: "",
    status: 0, //0等待审批，1代表审批被驳回
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
      }
    ],
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //初始化数据
    var userInfo = await app.getUserInfo();
    var result = this.data.result
    var level = this.data.level
    var data = this.data.raw_data
    data[0].time = date(userInfo.createTime);
    //获取审批进度
    var sid = userInfo.id;
    http.request({
      url: "/wxStudent/getMyApprove",
      loading: true,
      data: {
        sid: sid
      },
      success: res => {

        var parameter = res.parameter;
        parameter = parameter.reverse();
        try {
          /*
          ** level: 1.机构审批    2.残联审批
          ** result: 0.未审批    1.审批通过    2.审批驳回
           */
          var lastParameter = parameter[parameter.length-1];
          var lastLevel = lastParameter.level;
          var lastResult = lastParameter.result;
          console.log("level:", lastLevel)
          console.log("result", lastResult)
          if(lastLevel == "2" && lastResult == "1") {
            var registerStatus = 1;
          }else {
            var registerStatus = 0
          }
          console.log("registerStatus", registerStatus)
          wx.setStorageSync('registerStatus', registerStatus)
        }catch {
          wx.setStorageSync('registerStatus', 0)
        }
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
          //如果批准
          /*
          ** level: 1.机构审批    2.残联审批
          ** result: 0.未审批    1.审批通过    2.审批驳回
           */
          if(parameter[i].level == 1 && parameter[i].result == 2) {//代表驳回申请
            this.setData({
              status: 1
            });
            break;
          }
        }  
        this.setData({
          lists: data
        });
      },
      fail: res => {
        this.setData({
          lists: data
        });
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
  submit: function(params) {
    wx.navigateBack({
      delta: 1,
    });
  },
  modifyInfo: function(params) {
    wx.navigateTo({
      url: '/pages/login/register/register?isModify=1',
    });
  }
})