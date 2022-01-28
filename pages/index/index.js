// index.js
const app = getApp()
import { HTTP } from "../../utils/http";
import {config} from "../../config";

Page({
  data: {
    notice_count: ""
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
    wx.navigateTo({
      url: '/pages/me/myinfo/myinfo'
    });
  },
  myAttend: res => {
    wx.navigateTo({
      url: '/pages/attend/attend/attend'
    });
  },
  reAttend: res => {
    wx.navigateTo({
      url: '/pages/attend/reattend/reattend'
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
            if(res.statusCode == 200) {
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
                content:'上传失败!'
              });
            }
            console.log(res);
          },
          complete: res => {
            wx.hideLoading({
              success: (res) => {},
            });
          }
        });

      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  myProcess: res => {
    wx.navigateTo({
      url: '/pages/login/process/process'
    });
  }
})
