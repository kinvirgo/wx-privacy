/*
enter-class : "enter enter-active"
enter-active-class : "enter-active enter-to"
enter-to-class : "enter-to"

leave-class
leave-active-class
leave-to-class
*/

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        name: {
            type: String,
            value: '',
            observer: 'init',
        },
        show: {
            type: Boolean,
            value: false,
        },
    },
    /**
     * 组件的初始数据
     */
    data: {},
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 进入操作
         */
        enter() {
            this.setData({
                classNames: 'enter',
            })
        },
    },
})
