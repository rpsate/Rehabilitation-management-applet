// index.js
const app = getApp()
import { HTTP } from "../../utils/http";
import {config} from "../../config";

Page({
  data: {
    notice_count: "",
    isRegister: true
  },
  onLoad(options) {
    // app.getUserInfo({
    //   error: res => {
    //     console.log("dddddddddddddddddddddddddddd;",res)
    //     var code = res.code;
    //     if(code == "108") {
    //       wx.navigateTo({
    //         url: '/pages/login/register/register'
    //       });
    //     }
    //   }
    // });

    var openid = wx.getStorageSync('openid');
    app.getUserInfo({
      openid: openid,
      error: res => {
        var code = res.code;

        if(code == "108") {
          this.setData({
            isRegister: false
          })
        }
      }
    });
  },
  onShow: async function () {
    //判断未读信息条数
    wx.getStorage({
      //获取信息存在才读取信息
      key: 'userInfo',
      success: async res => {
        var noticeNotice = await app.getNoticeUnread();
        var notice_count = noticeNotice.length;
        if(Number.isInteger(notice_count) && notice_count > 0) {
          this.setData({
            notice_count: notice_count
          });
        }else {
          this.setData({
            notice_count: ""
          });
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    // 
  },
  myCourse: res => {
    wx.navigateTo({
      url: '/pages/mycourse/mycourse/mycourse',
    });
  },
  selectCourse: res => {
    wx.navigateTo({
      url: '/pages/mycourse/selectCourse/selectCourse'
    });
  },
  commentCourse: res => {
    wx.navigateTo({
      url: '/pages/mycourse/recommendCourse/recommendCourse'
    });
  },
  notice: res => {
    wx.navigateTo({
      url: '/pages/mycourse/notice/notice',
    });
  },
  myinfo: res => {
    wx.showModal({
      cancelText: '拒绝',
      confirmText: '允许',
      content: '为了核对您的注册信息是否正确，查看"我的档案"会要显示您的姓名、性别、身份证号、家长姓名、联系方式、关系、户籍地、常住地、残疾类别、所选机构等信息。',
      showCancel: true,
      title: '残疾儿童康复服务管理 申请',
      success: (result) => {
        var confirm = result.confirm;
        if (confirm) {
          wx.navigateTo({
            url: '/pages/me/myinfo/myinfo'
          });
        }
      }
    });
  },
  myAttend: res => {
    wx.navigateTo({
      url: '/pages/attend/attend/attend'
    });
  },
  reAttend: res => {
    wx.navigateTo({
      url: '/pages/attend/reattend2/reattend2'
    });
  },
  uploadFace: async res => {
    var userInfo = await app.getUserInfo();

    wx.chooseImage({
      count: 1,
      sizeType: ["compresses"],
      //sourceType: [],
      success: (result) => {
        var filePath = result.tempFilePaths[0];
        var appUrl = config.appUrl;
        
        wx.showLoading({
          title: '上传中······',
          mask: true
        });

        wx.uploadFile({
          url: appUrl + "/wxStudent/addFacePicture",
          filePath: filePath,
          name: 'personphotos',
          header: { "contentType": "multipart/form-data" },
          formData: {
            "sid": userInfo.id,
          },
          success: (res)=> {
            console.log("uploadFace:", res);
            var resData = JSON.parse(res.data);
            if(resData.code == 200) {
              wx.showModal({
                confirmColor: '#1a8be9',
                showCancel: false,
                title: '提示',
                content:'上传成功!'
              });
            }else {
              wx.showModal({
                confirmColor: '#1a8be9',
                showCancel: false,
                title: '提示',
                content: resData.message
              });
            }
            console.log(res);
          },
          complete: res => {
            wx.hideLoading({
              success: (res) => {},
            });

            //刷新faceURL
            wx.removeStorageSync('userInfo');
            app.getUserInfo()
          }
        });
      }
    });
  },
  myProcess: res => {
    wx.navigateTo({
      url: '/pages/login/process/process'
    });
  },
  register: res => {
    wx.showModal({
      cancelText: '拒绝',
      confirmText: '允许',
      content: '1.获取残疾儿童的姓名、性别、身份证号、家长姓名、联系方式、关系、户籍地、常住地、残疾类别，市残联、区残联对上述信息进行核实，如果符合条件，可以免费为该儿童进行免费的康复服务。\r\n2.残疾儿童可以选择相应的机构进行免费的康复训练。\r\n3.需获取残疾儿童的头像用于康复训练时进行打卡。',
      showCancel: true,
      title: '残疾儿童康复服务管理 申请',
      success: (result) => {
        var confirm = result.confirm;
        if (confirm) {
          wx.navigateTo({
              url: '/pages/login/register/register'
          });
        }
      }
    });
  }
})
