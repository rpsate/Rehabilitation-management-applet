// pages/home/home.js
const app = getApp()
import { LoginModel} from "../../models/login.js";
var loginModel = new LoginModel();
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        // 登录
        var openid = wx.getStorageSync('openid');
        var getOpenidFun;
        if(openid == "" || openid == undefined) {
            getOpenidFun = function (params) {
                return new Promise(resolve => {
                    loginModel.login().then(res => {
                        if(res == "" || res == undefined) {
                            wx.navigateTo({
                                url: '/pages/error/error',
                            });
                            return;
                        }else {
                            resolve(res);
                        }
                    }).catch(res => {
                        wx.navigateTo({
                        url: '/pages/error/error',
                        });
                        return;
                    });  
                });
            }
        }
        if(getOpenidFun) {
            //从登陆函数中获取openid
            openid = await getOpenidFun();
        }

        //获取用户信息
        var userInfo = await app.getUserInfo({
            openid: openid,
            error: res => {
                var code = res.code;

                if(code == "108") {
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/login/register/register'
                        });
                    }, 1000);
                    return;
                }
            }
        });

        if(userInfo != "" && userInfo != null) {
            //判断是否出于审批过程中，如果正在审批中则自动跳转到审批进度页面
            // try {
            //     var registerStatus = wx.getStorageSync('registerStatus');
            //     console.log("registerStatus", registerStatus)

            //     if(registerStatus == "" || parseInt(registerStatus) == 0) {
            //         setTimeout(() => {
            //             wx.navigateTo({
            //                 url: '/pages/login/process/process'
            //             });
            //         }, 1000);
            //         return;
            //     }
            // }catch {
            // }
            console.log(userInfo)
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/index/index'
                });
            }, 1000);
        }
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

    }
})