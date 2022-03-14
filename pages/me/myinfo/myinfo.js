// pages/me/myinfo/myinfo.js
const app = getApp();
import { date } from "../../../utils/util";
import {config} from "../../../config.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ["", "男", "女"],
    ageGroup: ["", "0-6岁", "7-14岁"],
    cjType: ['', '听障言语', '孤独症', '智力', '脑瘫'],
    istrain: ['未参加', '已参加'],
    baseUrl: "",
    imagesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var userInfo = await app.getUserInfo();

    //格式化生日
    var s_birthday = date(userInfo.birthday);
    s_birthday = s_birthday.substr(0, 7);
    userInfo.s_birthday = s_birthday;

    //格式化注册日期
    var s_createTime = date(userInfo.createTime);
    s_createTime = s_createTime.substr(0, 10);
    userInfo.s_createTime = s_createTime;

    //格式化图片
    var images = userInfo.fileURL;
    if(images.length > 0) {
      images = images.split(",");
    }else {
      images = [];
    }
    userInfo.images = images;

    //缓存图片
    // var baseUrl = config.appUrl;
    // var imagesList = [];
    // for(let i in images) {
    //   wx.downloadFile({
    //     url: baseUrl + images[i],
    //     success: res => {
    //       if(res.statusCode == 200) {
    //         imagesList[i] = res.tempFilePath;
    //         console.log(imagesList)
    //         this.setData({
    //           imagesList: imagesList
    //         })
    //       }
    //     }
    //   })
    // }

    //渲染数据
    this.setData({
      userInfo: userInfo,
      baseUrl: config.appUrl
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
  evalute: function (res) {
    wx.navigateTo({
      url: '/pages/me/evaluation/evaluation'
    });
  },
  modifyContent: async function(e) {
    var userInfo = await app.getUserInfo();

    wx.showActionSheet({
      itemList: ['修改人脸信息', '修改我的档案'],
      alertText: 'alertText',
      itemColor: 'itemColor',
      success: (res) => {
        console.log(res);
        var tapIndex = res.tapIndex;
        switch(tapIndex) {
          case 0:
            //修改人脸信息
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
                        content:'修改成功!'
                      });
                    }else {
                      wx.showModal({
                        confirmColor: '#1a8be9',
                        showCancel: false,
                        title: '提示',
                        content:'修改失败!'
                      });
                    }
                    console.log(res);
                  },
                  complete: async res => {
                    wx.hideLoading({
                      success: (res) => {},
                    });
        
                    //刷新faceURL
                    wx.removeStorageSync('userInfo');
                    var newUserInfo = await app.getUserInfo()
                    var userInfo = this.data.userInfo;
                    userInfo.faceURL = newUserInfo.faceURL;
                    this.setData({
                      userInfo: userInfo
                    });
                  }
                });
              }
            });
            break;
          case 1:
            //修改我的档案
            wx.navigateTo({
              url: '/pages/login/register/register?isModify=1',
            });
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  //预览图片
  previewImage: function(e) {
    var id = e.currentTarget.id;
    var images = this.data.userInfo.images;
    var baseUrl = config.appUrl;
    for(let i in images) {
      if(images[i].indexOf(baseUrl) == -1) {
        images[i] = baseUrl + images[i];
      }
    }
    console.log(images)
    console.log(id)
    // var images = this.data.imagesList;
    wx.previewImage({
      current: images[id],
      urls: images
    });
  },
  previewFace: function(e) {
    var url = this.data.baseUrl + this.data.userInfo.faceURL;
    console.log(url);
    wx.previewImage({
      urls: [url],
    });
  }
})