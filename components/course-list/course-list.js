// components/course-list/course-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //0 未选课程 1 不能评价 2可以评价 3已经评价
    type: {
      type: "String",
      value: 0
    },
    course: {
      type: "String",
      value: "资本论"
    },
    teacher: {
      type: "String",
      value: "马克思"
    },
    time: {
      type: "String",
      value: '2021-10-10'
    },
    price: {
      type: "Number",
      value: 0
    },
    isSelect: {
      // 0 未选 ,1 已选
      type: "String",
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    btnText: [
      ["未选", "已选"],
      "确认", // type=1 不能评价
      "确认", // type=2 能评价
      "查看确认"  // type=3 已经评价
    ],
    btnStyle: [
      ["not-select", ""],
      "disable",
      "",
      ""
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeSelect: function (res) {
      // var isSelect = this.data.isSelect;
      // if (isSelect == 0) {
      //   isSelect = 1;
      // }else {
      //   isSelect = 0;
      // }
      // this.setData({
      //   isSelect: isSelect
      // });
      var id = res.currentTarget.id;
      this.triggerEvent("selectCourse", {
          id: id,
          // isSelect: isSelect
      }, {});
    },
    getDetail: function (res) {
      var id = res.currentTarget.id;
      this.triggerEvent("getDetail", {
        id: id,
      }, {});
    },
    getCancel: function (res) {
      var id = res.currentTarget.id;
      this.triggerEvent("getCancel", {
        id: id,
      }, {});
    },
    comment: function (res) {
      var type = this.data.type;
      if(type == 2) {//评价
        var id = res.currentTarget.id;
        this.triggerEvent("doComment", {
          id: id,
        }, {});
      }else if(type == 3) {//查看评价
        var id = res.currentTarget.id;
        this.triggerEvent("viewComment", {
          id: id,
        }, {});
      }
    }
  }
})
