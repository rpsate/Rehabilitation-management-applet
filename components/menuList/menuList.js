// components/menuList/menuList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        lists: {
            type: "Array"
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
        onChice: function(res) {
            var id = res.currentTarget.id;
            this.triggerEvent("chice", {
                id: id
            }, {});
        }
    }
})
