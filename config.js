var config = {
    appUrl: "https://4414t9c284.zicp.vip",
    appID: "wx2718ae64d58fe090",
    myUrl: ""
};

const md5 = require('./utils/md5.js');

var timestamp = new Date();
timestamp = timestamp.getTime();
var randomStr = "cjetkfgl";
var secretStr = config.appID + timestamp + randomStr;
secretStr = md5.hexMD5(secretStr);


function getMyUrl() {
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
                    var myUrl = data.parameter
                    resolve(myUrl);
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

getMyUrl().then(res => {
    config.myUrl = res;
});

export {config};