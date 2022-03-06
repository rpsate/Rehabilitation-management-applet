import { config} from "../config.js";
import { HTTP} from "../utils/http.js";
class LoginModel extends HTTP {
    //获取openid
    _login(params) {
        wx.login({
            success: res => {
                params.that.request({
                    url: "/wxStudent/getOpenId",
                    loading: params.loading,
                    requestType: "json",
                    data: {
                        code: res.code,
                        appId: config.appID,
                        appSecret: config.appSecret
                    },
                    success: res => {
                        var parameter = res.parameter;
                        var openid = JSON.parse(parameter).openid;
                        wx.setStorageSync('openid', openid);
                        params.resolve(openid);
                    },
                    fail: res => {
                        params.reject(res);
                    }
                })
            }
        });
    }

    login(loading=false) {
        var that = this;
        return new Promise((resolve, reject) => {
            this._login({
                that: that,
                resolve: resolve,
                reject: reject,
                loading: loading
            });
        });
    }

    //获取用户信息
    _getUserInfo(params) {
        params.that.request({
            url: "/wxStudent/getMyInfo",
            loading: params.loading,
            data: {
                openId: params.openid
            },
            success: res => {
                params.resolve(res);
            },
            fail: res => {
                params.reject(res);
            },
            error: res => {
                params.error && params.error(res);
            }
        });
    }

    getUserInfo(params) {
        console.log("dddddddddddddd", params)
        var openid = params.openid;
        var loading = params.loading || false;
        var that = this;
        return new Promise((resolve, reject) => {
            this._getUserInfo({
                that: that,
                resolve: resolve,
                reject: reject,
                loading: loading,
                openid: openid,
                error: params.error
            });
        });
    }
}

export {LoginModel}