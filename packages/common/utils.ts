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
