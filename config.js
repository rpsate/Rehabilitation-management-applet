var config = {
    appUrl: "https://4414t9c284.zicp.vip",
    appID: "wx2718ae64d58fe090",
    appSecret: ""
};

const md5 = require('./utils/md5.js');

var timestamp = new Date();
timestamp = timestamp.getTime();
var randomStr = "cjetkfgl";
var secretStr = config.appID + timestamp + randomStr;
secretStr = md5.hexMD5(secretStr);


function getAppSecret() {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.appUrl + '/wxStudent/getAppInfo',
            data: {
                key: secretStr,
                timestamp: timestamp
            },
            success: res => {
                var data = res.data;
                if(data.code == 200) {
                    var appSecret = data.parameter
                    resolve(appSecret);
                }else {
                    reject(res);
                }
            },
            fail: res => {
                reject(res);
            }
          })
    });
}

getAppSecret().then(res => {
    config.appSecret = res;
});

export {config};