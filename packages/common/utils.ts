let systemInfo: WechatMiniprogram.SystemInfo

/**
 * 查询系统信息
 * @returns
 */
export function getSystemInfoSync() {
    if (systemInfo == null) {
        systemInfo = wx.getSystemInfoSync()
    }
    return systemInfo
}

/**
 * requestAnimationFrame方案
 * @returns
 */
export function requestAnimationFrame(cb: () => void) {
    const systemInfo = getSystemInfoSync()
    if (systemInfo.platform === 'devtools') {
        return setTimeout(() => {
            cb()
        }, 1000 / 30)
    }
    return wx
        .createSelectorQuery()
        .selectViewport()
        .boundingClientRect()
        .exec(() => {
            cb()
        })
}

/**
 * 是否定义
 * @param value
 * @returns
 */
export function isDefine(value: unknown) {
    return value !== undefined && value !== null
}

/**
 * 获取组件自定义事件参数
 * @param e
 * @param key
 * @returns
 */
export function getCustomEventDetail<T = any>(
    e: WechatMiniprogram.CustomEvent,
    key?: string,
): T {
    const { detail } = e
    return key ? detail[key] : detail
}

/**
 * 获取默认dataset by currentTarget
 */
export function getEventDataSet(e: WechatMiniprogram.BaseEvent, key?: string) {
    const { dataset } = e.currentTarget
    return key ? dataset[key] : dataset
}
