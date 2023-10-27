// components/privacy/index.ts

const weakMap = new WeakMap<any, IResolveCallback>()

Component({
    externalClasses: [
        'custom-class',
        'custom-header-class',
        'custom-content-class',
        'custom-footer-class',
    ],

    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 标题
         */
        title: {
            type: String,
            value: null,
        },
        /**
         * 内容区域
         */
        contents: {
            type: Array,
            value: null,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow: false,
        privacyTitle: '',
        privacyContents: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setContent(data: Partial<IContents>) {
            const { title, contents } = this.data

            this.setData({
                privacyTitle: title ?? data?.title,
                privacyContents: contents ?? data?.contents,
            })
        },
        /**
         * 打开隐私协议合同
         */
        doOpenPrivacyContract() {
            wx.openPrivacyContract({})
        },

        /**
         * 打开弹窗
         */
        show(callback: IResolveCallback) {
            weakMap.set(this, callback)
            this.setData({ isShow: true })
        },
        /**
         * 隐藏弹窗
         */
        hide() {
            weakMap.delete(this)
            this.setData({ isShow: false })
        },
        /**
         * 同意
         */
        onAgree(e: WechatMiniprogram.BaseEvent) {
            const { id } = e.currentTarget,
                fn = weakMap.get(this)
            typeof fn === 'function' && fn({ buttonId: id, event: 'agree' })
            this.hide()
            // 触发bind:agree
            this.triggerEvent('agree')
        },
        /**
         * 拒绝
         */
        onDisagree() {
            const fn = weakMap.get(this)
            typeof fn === 'function' && fn({ event: 'disagree' })
            this.hide()
            // 触发bind:disagree
            this.triggerEvent('disagree')
        },
        /**
         * 触发事件
         */
        doAction(e: WechatMiniprogram.BaseEvent) {
            const { item } = e.currentTarget.dataset
            if (item && item?.action) {
                if (Reflect.has(this, item?.action)) {
                    // 执行内部自定义action
                    Reflect.get(this, item?.action)()
                }
                // 触发bind:action
                this.triggerEvent(item?.action, item)
            }
        },
    },
})
