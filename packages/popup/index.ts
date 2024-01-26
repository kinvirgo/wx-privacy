import { classNames } from './config'
import { requestAnimationFrame } from '../common/utils'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: 'observerShow',
        },
        /**
         * 动画时长
         */
        duration: {
            type: Number,
            value: 350,
        },
        /**
         * 弹窗层级
         */
        zIndex: {
            type: Number,
            value: 1000,
        },
        /**
         * 弹窗位置，暂只支持center
         */
        position: {
            type: String,
            value: 'center',
        },
        /**
         * 锁定背景滚动
         */
        lockScroll: {
            type: Boolean,
            value: true,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isInit: false,
        display: false,
        classes: '',
        opacity: 0,
    },

    ready() {
        const { show } = this.data
        if (show) {
            this.observerShow(true, false)
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 展示隐私信息
         */
        observerShow(value: boolean, old: boolean) {
            if (value === old) {
                return
            }
            value ? this.enter() : this.leave()
        },
        /**
         * 展示
         */
        enter() {
            // enter-from
            this.setData({
                isInit: true,
                display: true,
                classes: classNames.ENTER,
                opacity: 0,
            })
            // enter-to
            requestAnimationFrame(() => {
                this.setData({
                    classes: classNames.ENTERTO,
                    opacity: 1,
                })
            })
        },
        /**
         * 隐藏
         */
        leave() {
            const { duration } = this.data
            // leave-from
            this.setData({
                classes: classNames.LEAVE,
                opacity: 1,
            })

            // leave-to
            requestAnimationFrame(() => {
                setTimeout(_ => {
                    this.onTransitionEnd()
                }, duration)
                this.setData({
                    classes: classNames.LEAVETO,
                    opacity: 0,
                })
            })
        },
        /**
         * 动画结束
         */
        onTransitionEnd() {
            const { display, show } = this.data
            if (!show && display) {
                this.setData({
                    classes: '',
                    display: false,
                })
            } else {
                this.setData({ classes: '' })
            }
        },
        /**
         * noop fn
         */
        noop() {
            /* noop function */
        },
    },
})
