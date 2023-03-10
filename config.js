var config = {
    appUrl: "https://cjetkfgl.com",
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
                console.log('s', data)
                if(data.code == 200) {
                    var myUrl = data.parameter
                    resolve(myUrl);
                }else {
                    showRequestInfo()
                    console.log('f', res)
                    reject(res);
                }
            },
            fail: res => {
                console.log('e', res)
                reject(res);
            }
          })
    });
}

getMyUrl().then(res => {
    config.myUrl = res;
});

export {config};