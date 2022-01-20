// app.js
import { LoginModel} from "./models/login.js";
import { HTTP } from "./utils/http.js";
import { date } from "./utils/util.js"
var http = new HTTP();
var loginModel = new LoginModel();
App({
  onLaunch() {

  },
  globalData: {
    userInfo: null
  },
  //获取openid
  getOpenid: function (params) {
    var openid = wx.getStorageSync('openid');
    if(openid == undefined || openid == "") {
      wx.navigateTo({
        url: "/pages/error/error"
      });
      return;
    }
    return openid
  },
  //获取用户信息函数
  getUserInfo: async function (params) {
    if (params == undefined) {
      var params = new Object();
    }
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo == "" || userInfo == undefined) {
      //没有就来获取
      try {
        var openid = params.openid;
      }catch {
        var openid = null;
      }
      console.log("openid",openid)
      if(openid == null || !openid) {
        params.openid = await this.getOpenid()
      }
      console.log("params.openid ", params.openid)
      var getUserInfoFun = function (params) {
        console.log("aaa", params)
        return new Promise((resolve, reject) => {
          loginModel.getUserInfo(params).then(res => {
            console.log("success", res)
            resolve(res.parameter);
          }).catch(res => {
            console.log("fail", res)
            reject(res.res.parameter);
          });
        });
      }
      try {console.log("abb", params)
        userInfo = await getUserInfoFun(params);
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        });
      }catch {
        console.log("fail")
        userInfo = ""
      }
    }
    return userInfo
  },
  checkPhoneNumber: function(e) {
    var phoneNumber = e;
    if (phoneNumber.length == 0) {
        wx.showToast({
            title: '请输入电话号码',
            icon: 'none'
        });
        return false;
    } else if (phoneNumber.length != 11 || phoneNumber.charAt(0) != '1') {
        wx.showToast({
            title: '电话号码格式不正确',
            icon: 'none'
        });
        return false;
    }else {
        return true;
    }
  },
  checkOpenid: function(e) {
    var result = false;
    var openid = wx.getStorageSync('openid')
    if(openid != "") {
      result = true
    }
    return result;
  },
  getNoticeUnread: async function(loading=false) {
    //获取用户id
    var userInfo = await this.getUserInfo();
    var sid = userInfo.id;
    //获取消息
    var getNoticeUnread = function () {
      return new Promise((resovle, reject) => {
        http.request({
          url: '/wxMessage/my',
          loading: loading,
          data: {
            sid: sid
          },
          success: res => {
            var notice = res.parameter;
            for(let i in notice) {
              notice[i].s_time = date(notice[i].createTime, true);
            }
            resovle(notice);
          },
          fail: res => {
            reject([]);
          }
        });
      });
      
    }
    var notice_unread = await getNoticeUnread();
    return notice_unread;
  }
})
