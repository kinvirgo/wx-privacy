import { getCustomEventDetail, getEventDataSet } from '../common/utils'

/**
 * 操作类型
 */
const actionTypes = {
    minus: 'minus',
    plus: 'plus',
}

Component({
    externalClasses: [
        'custom-class',
        'custom-minus-class',
        'custom-input-class',
        'custom-plus-class',
    ],

    properties: {
        // 当前值
        value: {
            type: null,
            optionalTypes: [Number],
            value: null,
            observer: 'check',
        },
        // 最小值
        min: {
            type: Number,
            value: 1,
            observer: 'check',
        },
        // 最大值
        max: {
            type: Number,
            value: Number.MAX_SAFE_INTEGER,
            observer: 'check',
        },
        // 步长
        step: {
            type: Number,
            value: 1,
        },
        // 是否只允许输入整数
        integer: {
            type: Boolean,
            value: false,
        },
        // 固定显示的小数位数
        digits: {
            type: null,
            optionalTypes: [Number],
            value: null,
            observer: 'check',
        },
        // 是否异步变更
        async: {
            type: Boolean,
            value: false,
        },
        // 禁用
        disabled: {
            type: Boolean,
            value: false,
        },
        // 展示减
        showMinus: {
            type: Boolean,
            value: true,
        },
        // 禁用减
        disableMinus: {
            type: Boolean,
            value: false,
        },
        // 禁用输入
        disableInput: {
            type: Boolean,
            value: false,
        },
        // 展示加
        showPlus: {
            type: Boolean,
            value: true,
        },
        // 禁用加
        disablePlus: {
            type: Boolean,
            value: false,
        },
        // 指定光标与键盘的距离
        cursorSpacing: {
            type: Number,
            value: 0,
        },
        // 强制 input 处于同层状态
        alwaysEmbed: {
            type: Boolean,
            value: false,
        },
        // 键盘弹起时，是否自动上推页面
        adjustPosition: {
            type: Boolean,
            value: false,
        },
        // focus时，点击页面的时候不收起键盘
        holdKeyboard: {
            type: Boolean,
            value: false,
        },
        // 是否长按
        longPress: {
            type: Boolean,
            value: true,
        },
        // 长按开始时间
        longPressStartTime: {
            type: Number,
            value: 600,
        },
        // 触发长按频率
        longPressInterval: {
            type: Number,
            value: 200,
        },
    },
    data: {
        actionTypes,
        currentValue: '' as any,
        timer: 0,
    },

    lifetimes: {
        attached() {
            this.init()
        },
    },

    methods: {
        check() {
            let { value, currentValue } = this.data
            value = this.format(value)
            if (currentValue !== value) {
                this.setData({ currentValue: value })
            }
        },
        /**
         * 初始化项目
         */
        init() {
            const { value } = this.data
            this.setData({ currentValue: this.format(value) })
        },
        /**
         * 加减事件
         * @param event
         */
        onTap(event: WechatMiniprogram.CustomEvent) {
            const { type } = getEventDataSet(event)
            this.onChange(type)
        },
        /**
         * 监听变化
         * @param type
         */
        onChange(type: string) {
            if (this.isDisabled(type)) {
                this.triggerEvent('overlimit', type)
            } else {
                const { step, currentValue } = this.data,
                    diff = type === actionTypes.minus ? -step : +step,
                    value = this.format(this.add(+currentValue, diff))
                this.emitChange(value)
                this.triggerEvent(type)
            }
        },
        /**
         * 是否可以操作
         * @param type
         * @returns
         */
        isDisabled(type: string) {
            const {
                currentValue,
                min,
                max,
                disabled,
                disableMinus,
                disablePlus,
            } = this.data
            return type === actionTypes.minus
                ? disabled || disableMinus || +currentValue <= min
                : disabled || disablePlus || +currentValue >= max
        },
        /**
         * 聚焦事件
         * @param event
         */
        onFocus(event: WechatMiniprogram.CustomEvent) {
            this.triggerEvent('focus', event.detail)
        },
        /**
         * input事件
         * @param event
         * @returns
         */
        onInput(event: WechatMiniprogram.CustomEvent) {
            let { value } = getCustomEventDetail(event)
            if (value !== '') {
                value = this.filter(value)
                const { digits } = this.data
                if (this.isDefine(digits) && value.includes('.')) {
                    const [integer, decimal] = value.split('.')
                    value = `${integer}.${decimal.slice(0, digits)}`
                }
                this.emitChange(value)
            }
        },
        /**
         * 失去焦点事件
         * @param event
         */
        onBlur(event: WechatMiniprogram.CustomEvent) {
            let { value } = getCustomEventDetail(event)
            value = this.format(value)
            this.setData({ currentValue: value })
            this.emitChange(value)
            this.triggerEvent(
                'blur',
                Object.assign({}, event.detail, { value }),
            )
        },
        /**
         * 触发change事件
         * @param value
         */
        emitChange(value: number) {
            const { async } = this.data
            if (!async) {
                this.setData({ currentValue: value })
            }
            this.triggerEvent('change', value)
        },
        /**
         * 过滤非数组
         * @param value
         * @returns
         */
        filter(value: any) {
            const { integer } = this.data
            value = String(value).replace(/[^0-9.-]/g, '')
            if (integer && value.includes('.')) {
                value = value.split('.')[0]
            }
            return value
        },
        /**
         * 格式化数据
         * @param value
         * @returns
         */
        format(value: any) {
            const { digits, min, max } = this.data
            value = this.filter(value)
            // format range
            value = value === '' ? 0 : +value
            value = Math.max(Math.min(max, value), min)
            // format decimal
            if (this.isDefine(digits)) {
                value = value.toFixed(digits)
            }
            return value
        },
        /**
         * 判断props是否定义
         * @param value
         * @returns
         */
        isDefine(value: unknown) {
            return value !== undefined && value !== null
        },
        /**
         * 处理进度问题
         * @param num1
         * @param num2
         * @returns
         */
        add(num1: number, num2: number) {
            const cardinal = Math.pow(10, 10)
            return Math.round((num1 + num2) * cardinal) / cardinal
        },
        /**
         * 开始长按
         */
        onTouchStart(event: WechatMiniprogram.BaseEvent) {
            const { longPress, timer, longPressStartTime } = this.data
            if (longPress) {
                // 支持长按
                timer && clearTimeout(timer)
                const { type } = getEventDataSet(event)
                this.setData({
                    timer: setTimeout(() => {
                        this.onChange(type)
                        this.longPressStep(type)
                    }, longPressStartTime),
                })
            }
        },
        /**
         * 长按
         * @param type
         */
        longPressStep(type: string) {
            const { longPressInterval } = this.data
            this.setData({
                timer: setTimeout(() => {
                    this.onChange(type)
                    this.longPressStep(type)
                }, longPressInterval),
            })
        },
        /**
         * 结束长按
         */
        onTouchEnd() {
            const { longPress, timer } = this.data
            if (longPress && timer) {
                clearTimeout(timer)
            }
        },
    },
})
