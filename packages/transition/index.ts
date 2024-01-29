/*
enter-class : "enter enter-active"
enter-active-class : "enter-active enter-to"
enter-to-class : "enter-to"

leave-class
leave-active-class
leave-to-class
*/

import { isDefine, requestAnimationFrame } from 'packages/common/utils'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        name: {
            type: String,
            value: '',
        },
        show: {
            type: Boolean,
            value: false,
            observer: 'init',
        },
    },

    lifetimes: {
        ready() {
            const { show } = this.data
            this.init(show, false)
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        classNames: '',
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 初始化项目
         * @param val
         * @param old
         */
        init(val: boolean, old: boolean) {
            if (isDefine(val) && val !== old) {
                val ? this.enter() : this.leave()
            }
        },
        /**
         * 进入操作
         */
        enter() {
            this.setData({
                classNames: 'enter enter-active',
            })
            requestAnimationFrame(() => {
                this.setData({ classNames: 'enter-active enter-to' })
            })
        },
        /**
         * 离开操作
         */
        leave() {
            this.setData({
                classNames: 'leave leave-active',
            })
            requestAnimationFrame(() => {
                this.setData({
                    classNames: 'leave-active leave-to',
                })
            })
        },

        /**
         * 动画结束
         */
        onTransitionEnd() {
            this.setData({ classNames: '' })
        },
    },
})
