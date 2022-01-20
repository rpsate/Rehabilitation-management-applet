// components/process-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 0  //0 无底部理由字段，1 有底部理由字段
    },
    reason: {
      type: String,
      value: ''
    },
    active: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ""
    },
    persion: {
      type: String,
      value: ""
    },
    tip: {
      type: String,
      value: ""
    },
    time: {
      type: String,
      value: ""
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

  }
})
