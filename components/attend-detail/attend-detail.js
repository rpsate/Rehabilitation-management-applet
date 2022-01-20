// components/attend-detail/attend-detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: "Array",
      value: [
        ['09-03','12:41', 0],
        ['09-03','12:41', 1],
        ['09-03','12:41', 2],
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    state: [
      "已打卡",
      "未打卡",
      "审批中",
      "审批驳回",
      "审批通过"
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reAttend: function(res) {
      var id = res.currentTarget.id
      if(this.data.data[id][2] != 0) {
        console.log(id)
        this.triggerEvent("reAttend",{
          id: id
        }, {});
      }
    }

  }
})
