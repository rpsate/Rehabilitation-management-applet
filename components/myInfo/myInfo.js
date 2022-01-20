// components/myInfo/myInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      src: {
          type: "String",
          value: "./images/user_img_default.png"
      },
      name: {
          type: "String",
          value: ""
      },
      login: {
          type: "Boolean",
          value: false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      getUserInfo: function(res) {
        wx.getUserProfile({
          desc: 'desc',
          success: res => {
            this.triggerEvent("getUserInfo", {
                userData: res
            }, {});
          }
        })
          
      }
  }
})
