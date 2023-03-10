// index.js
const app = getApp()
import { HTTP } from "../../utils/http";
import {config} from "../../config";

const http = new HTTP();
Page({
  data: {
    notice_count: "",
    isRegister: true,
    isActiveUpload: true
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

    http.request({
      url: "/wxStudent/getIsShow",
      // loading: params.loading,
      success: async res => {
        const userInfo = await app.getUserInfo({
          getNewData: true
        });
        console.log('dd:', userInfo)
        var userStatus = userInfo.status;
        var parameter = res.parameter || 0;
        var isActiveUpload = true;
        console.log('par sts', parameter, userStatus)
        if (parameter == 0 && userStatus <= 1) {
          isActiveUpload = false;
        }
        this.setData({
          isActiveUpload: isActiveUpload
        })
      },
      error: res => {
          console.log(res)
      }
    })
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
  uploadFace: async function userInfo() {
    if (this.data.isActiveUpload == false) {
      wx.showToast({
        title: '机构审核通过之后才能上传头像',
        icon: 'none'
      });
      return;
    }
    var userInfo = await app.getUserInfo();

    wx.showModal({
      confirmColor: '#1a8be9',
      showCancel: true,
      cancelText: "修改",
      title: '提示',
      content:'请检查[' + userInfo.name + ']的身份证号码是否正确：' + userInfo.idCard,
      success: res => {
        if (res.confirm) {
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
        } else {
          //修改我的档案
          wx.navigateTo({
            url: '/pages/login/register/register?isModify=1',
          });
        }
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
      content: '1.获取残疾儿童的姓名、性别、身份证号、家长姓名、联系方式、关系、户籍地、常住地、残疾类别，市残联、区残联对上述信息进行核实，如果符合条件，可以免费为该儿童进行免费的康复服务。\r\n2.残疾儿童可以选择相应的机构进行免费的康复训练。',
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
