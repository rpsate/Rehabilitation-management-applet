import {config} from "../config.js";

//错误提示
var tips = {
    "-1": "",
    1: "网络错误",
    100: "登录错误",
    101: "数据获取失败",
    102: "参数为空",
    //108: "用户不存在",
    114: "该用户已存在",
    110: "学院id不能为空",
    111: "文件类型不能为空",
    112: "下载文件名不能为空",
    113: "openId不能为空",
    114: "该用户已存在",
    115: "数据删除失败",
    116: "添加数据失败",
    117: "数据修改失败",
}

var requestTypes = {
    json: {
        "content-type": "application/json;charset=utf-8"
    },
    form: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
}

class HTTP {
    request(params) {
        if(params.loading) {
            wx.showLoading({
                title: '加载中······',
                mask: true
            });
        }

        var requestType = requestTypes["form"]
        if (params.requestType) {
            requestType = requestTypes[params.requestType]
        }

        wx.request({
            url: config.appUrl + params.url,
            data: params.data,
            method: "POST",
            dataType: 'json',
            responseType: 'text',
            header: requestType,
            success: (res)=> {
                if (params.loading) {
                    wx.hideLoading();
                }
                var statusCode =  res.statusCode.toString();
                if(statusCode.startsWith('2')) {
                    var code = res.data.code.toString();
                    if(code.startsWith('2')) {
                        params.success && params.success(res.data);
                    }else {
                        console.log(res)
                        params.error && params.error(res.data);
                        this._showError(code);
                    }
                }else {
                    this._showError(1);
                }
            },
            fail: (res)=> {
                if (params.loading) {
                    wx.hideLoading();
                }
                this._showError(1);
                params.fail && params.fail(res);
            },
            complete: res => {
                params.complete && params.complete(res);
            }
        });
    }

    //上传单个文件
    upload(params) {
        wx.uploadFile({
          url: config.appUrl + params.url,
          filePath: params.filePath,
          name: 'myFile',
          header: { "contentType": "multipart/form-data" },
          success: (res)=> {
            var code = res.statusCode.toString();
            params.success && params.success(res);
            if(!code.startsWith('2')) {
                this._showError(res.data.error_code);
            }
          },
          fail: (res)=> {
              this._showError(1);
              params.fail && params.fail(res);
            }
        })
    }

    //多文件异步上传
    _async_uploads(params) {
        return new Promise((resovle, reject) => {
            this.upload({
                url: params.url,
                filePath: params.filePath,
                success: res => {
                    resovle(res);
                },
                fail: res => {
                    reject(res);
                }
            });
        });
    }

    async uploads(params) {
        var result = [];
        for(var index in params.filePaths) {
            result[index] = this._async_uploads({
                url: params.url,
                filePath: params.filePaths[index]
            });
        }
        try {
            var res = await Promise.all(result);
            params.success && params.success(res);
        }catch(res) {
            params.fail && params.fail(res);
        }
    }

    _showError(error_code) {
        if(!error_code) {
            error_code = 1;
        }
        wx.showToast({
            title: tips[error_code],
            icon: 'none',
            duration: 2000
        })
    }
};

export {HTTP};