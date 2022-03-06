// pages/login/register/register.js
const app = getApp();
import { HTTP } from "../../../utils/http.js";
var http = new HTTP()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    idcard: "",
    birthday: "",
    parent_name: "",
    parent_relation: "",
    parent_phone: "",
    household: "",
    residence: "",
    default_household: ['湖南省'],
    default_residence: ['湖南省'],
    gender: ['未选择', '男', '女'],
    organ: [["请先选择残疾类别"]],
    category: ['未选择', '听障言语', '孤独症', '智力', '脑瘫'],
    istrain: ['未选择', '未参加', '已参加'],
    gender_index: 0,
    organ_index: 0,
    category_index: 0,
    istrain_index: 0,
    household_detail: "",
    residence_detail: "",
    remarks: "",
    images: [],
    organ_data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getOrganInfo();

    //修改用户信息
    var isModify = options.isModify;
    if(isModify == 1) {
      var userInfo = await app.getUserInfo();
      var organ_index = wx.getStorageSync('organ_index') || 0;
      console.log(organ_index);
      this.setData({
        name: userInfo.name,
        gender_index: userInfo.sex,
        idcard: userInfo.idCard,
        parent_name: userInfo.guardian,
        parent_phone: userInfo.mobile,
        parent_relation: userInfo.guanxi,
        household: userInfo.hjSheng + "," + userInfo.hjShi + "," + userInfo.hjQu,
        default_household: [userInfo.hjSheng, userInfo.hjShi, userInfo.hjQu],
        household_detail: userInfo.hjAddress,
        residence: userInfo.czSheng + "," + userInfo.czShi + "," + userInfo.czQu,
        default_residence: [userInfo.czSheng, userInfo.czShi, userInfo.czQu],
        residence_detail: userInfo.czAddress,
        category_index: userInfo.cjType,
        organ_index: organ_index,
        istrain_index: userInfo.isExists + 1,
        remarks: userInfo.remark
      });
    }
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
  //姓名
  changeName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  //性别
  changeGender: function (e) {
    this.setData({
      gender_index: e.detail.value
    });
  },
  //身份证号
  chnageIdcard: function (e) {
    this.setData({
      idcard: e.detail.value
    });
  },
  //出生日期
  changeBirthday: function (e) {
    this.setData({
      birthday: e.detail.value
    });
  },
  //家长姓名
  changeParentName: function (e) {
    this.setData({
      parent_name: e.detail.value
    });
  }, 
  //家长的联系方式
  changePhone: function(e) {
    this.setData({
      parent_phone: e.detail.value
    });
  },
  //家长与学员的关系
  changeRelation: function (e) {
    this.setData({
      parent_relation: e.detail.value
    });
  },
  //户籍
  changeHousehold : function (e) {
    this.setData({
      household: e.detail.value
    });
  },
  //户籍地详细地址
  changeHouseholdDetail: function (e) {
    this.setData({
      household_detail: e.detail.value
    });
  },
  //常住地
  changeResidence: function (e) {
    this.setData({
      residence: e.detail.value
    });
  },
  //常住地详细地址
  changeResidenceDetail: function (e) {
    this.setData({
      residence_detail: e.detail.value
    });
  },
  //培训机构
  changeOrgan: function (e) {
    var category_index = this.data.category_index;
    if(category_index != 0) {
      wx.navigateTo({
        url: '/pages/login/orgin/organ'
      });
    }
    // this.setData({
    //   organ_index: e.detail.value,
    // });
    // //修改注册信息是方便获取该数据
    // wx.setStorage({
    //   key: 'organ_index',
    //   data: e.detail.value
    // });
  },
  //残疾类别
  changeCategory: function (e) {
    this.setData({
      category_index: e.detail.value,
      organ_index: 0 //残疾类别改变，培训机构也将改变
    });
  },
  //是否参加培训
  changeIstrain: function (e) {
    this.setData({
      istrain_index: e.detail.value
    });
  },
  //选择图片
  chooseImages: function(e) {
    var maxLength = 20;
    var images = this.data.images;
    var imagesLength = images.length;
    if (maxLength - imagesLength <= 0) {
      wx.showToast({
        title: '最多上传4张图片',
        icon: 'none'
      });
      return;
    }
    wx.chooseImage({
        count: maxLength-imagesLength,
        sizeType: ["compresses"],
        success: e => {
            for (var i = 0; i < e.tempFilePaths.length;i++) {
                images.push(e.tempFilePaths[i]);
            }
            this.setData({
                images: images
            });
        }
    })
  },
  //关闭一张图片
  closeImage: function(e) {
      var id = e.currentTarget.id;
      var images = this.data.images;
      images.splice(id,1);
      this.setData({
          images: images
      })
  },
  //预览图片
  previewImage: function(e) {
      var id = e.currentTarget.id;
      wx.previewImage({
          current: this.data.images[id],
          urls: this.data.images
      });
  },
  //备注
  changeRemarks: function (e) {
    this.setData({
      remarks: e.detail.value
    });
  },
  //提交注册信息
  submit: function(e) {
    //检查数据是否合法
    if(!this.check()) {
      return;
    }
    
    //获取培训机构id和openid
    var category_index = this.data.category_index
    var orgain_index = this.data.organ_index
    var schoolId = this.data.organ_data[category_index][orgain_index].id
    var openid = app.getOpenid();


    //显示加载框
    wx.showLoading({
      title: '正在上传图片',
      mask: true
    });

    //先上传图片
    var uploadImages = new Promise(resolve => {
      http.uploads({
        url: "/wxStudent/addpicture",
        filePaths: this.data.images,
        success: res => {
          wx.hideLoading();
          resolve(res);
        },
        fail: res => {
          wx.hideLoading();
          return;
        }
      });
    });

    //上传成功后上传注册数据
    uploadImages.then(res => {
      var images = [];
      for(let index in res) {
        if(res[index].statusCode == "200") {
          var data = JSON.parse(res[index].data);
          images[index] = data.parameter;
        }
      }
      var imagesUrl = images.join(",");

      // var data = {
      //   openId: openid,
      //   sex: "2",
      //   ageGroup: "1",
      //   birthday: "2019-08-12",
      //   cjType: "2",
      //   czAddress: "宝塔路",
      //   czQu: "芙蓉区",
      //   czSheng: "湖南省",
      //   czShi: "长沙市",
      //   guanxi: "父子关系",
      //   guardian: "张大三",
      //   hjAddress: "红旗路",
      //   hjQu: "荷塘区",
      //   hjSheng: "湖南省",
      //   hjShi: "株洲市",
      //   idCard: "430381201908125053",
      //   isExists: "1",
      //   mobile: "17369284386",
      //   name: "张三",
      //   remark: "",
      //   schoolId: "11"
      // }

      //获取数据
      var data = {
        openId: openid,
        name: this.data.name,
        sex: this.data.gender_index, //1：男  2：女
        idCard: this.data.idcard,
        hjSheng: this.data.household[0],
        hjShi: this.data.household[1],
        hjQu: this.data.household[2],
        hjAddress: this.data.household_detail,
        czSheng: this.data.residence[0],
        czShi: this.data.residence[1],
        czQu: this.data.residence[2],
        czAddress: this.data.residence_detail,
        cjType: this.data.category_index, // 1：听障言语 2.孤独症 3.智力 4脑瘫
        guardian: this.data.parent_name,
        guanxi: this.data.parent_relation,
        mobile: this.data.parent_phone,
        isExists: this.data.istrain_index-1, // 0未参加培训 1已参加培训 
        birthday: this.getBirthday(this.data.idcard),
        ageGroup: this.getAgeBracket(this.data.idcard),
        schoolId: schoolId,
        remark: this.data.remarks
      }

      console.log("post data:", data);

      //对数据进行编码
      for (let i in data) {
        data[i] = encodeURI(data[i])
      }
      //将图片地址加入data中
      if(imagesUrl) {
        data.fileURL = imagesUrl;
      }

      var post_data = JSON.stringify(data);
      //提交数据
      http.request({
        url: "/wxStudent/register",
        requestType: "json",
        loading: true,
        data: post_data,
        success: res => {
          //提交新数据或修改数据，修改则删除原来数据缓存
          wx.removeStorageSync('userInfo');
          wx.reLaunch({
            url: '/pages/login/process/process',
          });
        },
        error: res => {
          //上传图片成功，注册不成功，删除图片
          if(imagesUrl) {
            http.request({
              url: "/wxStudent/delpicture",
              loading: true,
              data: {
                way: imagesUrl
              }
            });
          }
        }
      });
    });
  },
  check: function (e) {
    var message = "";
    if (this.data.name == "") {
      message = "姓名不能为空";
    }else if (this.data.gender_index == 0) {
      message = "请选择性别";
    }else if (this.data.idcard == "") {
      message = "请填写身份证号";
    }else if (this.data.idcard.length != 18) {
      message = "请填写正确格式的身份证号";
    }else if (this.getAgeBracket(this.data.idcard) == 0) {
      message = "年龄不符合要求，无法注册！";
    }else if (this.data.parent_name == "") {
      message = "请填写家长姓名"
    }else if (this.data.parent_phone == "") {
      message = "请填写家长的联系方式"
    }else if (this.data.parent_phone.length < 11) {
      message = "请填写正确的手机号码"
    }else if (this.data.parent_relation == "") {
      message = "请填写家长与学员的关系"
    }else if (this.data.household == "") {
      message = "请选择户籍地";
    }else if (this.data.household_detail == "") {
      message = "请填写户籍地详细地址";
    }else if (this.data.residence == "") {
      message = "请选择常住地";
    }else if (this.data.residence_detail == "") {
      message = "请填写常住地详细地址";
    }else if (this.data.category_index == 0) {
      message = "请选择残疾类别"
    }else if (this.data.organ_index == 0) {
      message = "请选择培训机构"
    }else if (this.data.istrain_index == 0) {
      message = "请选择是否已参加培训"
    }else if (this.data.istrain_index == 1) {
      if (this.data.images.length == 0) {
        message = "请上传证明材料"
      }
    }
    if (message != "") {
      wx.showToast({
        title: message,
        icon: 'none'
      });
      return false;
    }else {
      return true;
    }
  },
  //从身份证中获取生日
  getBirthday: function(idcard) {
    var birthday = idcard.substr(6,8)
    birthday = birthday.substr(0, 4) + "-" + birthday.substr(4, 2) + "-" + birthday.substr(6, 2)
    return birthday
  },
  //从身份证中获取年龄段
  getAgeBracket: function(idcard) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - idcard.substring(6, 10) - 1;
    if (idcard.substring(10, 12) < month || idcard.substring(10, 12) == month && idcard.substring(12, 14) <= day) {
      age++;
    }
    //1:0-6岁  2:7-14岁
    var ageBracket = 0
    if(age >= 0 && age < 7) {
      ageBracket = 1
    }else if(age >= 7 && age < 15) {
      ageBracket = 1
    }
    return ageBracket
  },
  getOrganInfo: function(params) {
    //获取培训机构
    for(let index = 1; index < 5; index++) {
      http.request({
        url: "/wxStudent/getSchoolList",
        data: {
          cjType: this.data.category[index]
        },
        success: res => {
          console.log(res);
          var organ_data = this.data.organ_data
          var organ = this.data.organ
          //将培训机构数据放入数组中
          organ_data[index] = res.parameter
          organ_data[index].unshift({name: "未选择"})
          //将培训机构名称单独放在一个数组中
          organ[index] = []
          for(let key in organ_data[index]) {
            organ[index].push(organ_data[index][key].name)
          }
          this.setData({
            organ: organ,
            organ_data: organ_data
          });
        }
      });
    }
  }
})
