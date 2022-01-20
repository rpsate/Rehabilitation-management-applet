// index.js
const app = getApp()

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
  myProcess: res => {
    wx.navigateTo({
      url: '/pages/login/process/process'
    });
  }
})
