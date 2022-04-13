// components/attend-list/attend-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: "String",
      value: ""
    },
    times: {
      type: "String",
      value: "0"
    },
    timesLess: {
      type: "String",
      value: '0'
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
    getDetail: function(e) {
      this.triggerEvent("getDetail", {
      }, {});
    }
  }
})
