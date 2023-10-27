type ContentStyle = Record<string, string> | string

interface IContentItem {
    text: string
    className?: string
    action?: string
    style?: ContentStyle | ContentStyle[]
}

interface IPrivacyInfo {
    title: string
    contents: IContentItem[]
}

/**
 * 查询是否需要隐私弹窗
 */
export function usePrivacy(info: IPrivacyInfo, componentId?: string) {
    // 兼容低版本
    if (Reflect.has(wx, 'getPrivacySetting')) {
        wx.getPrivacySetting({
            success(res) {
                if (res.needAuthorization) {
                    onNeedPrivacyAuthorization(info, componentId)
                }
            },
        })
    }
}

/**
 * 全局监听隐私并且弹窗
 * @param info
 * @param componentId
 */
function onNeedPrivacyAuthorization(info: IPrivacyInfo, componentId?: string) {
    wx.onNeedPrivacyAuthorization(resolve => {
        const [page] = getCurrentPages().slice(-1),
            component = page.selectComponent(`#${componentId || 'privacy'}`)
        if (component) {
            component.setContent(info)
            component.show(resolve)
        } else {
            console.error(`页面没有找到<privacy id="privacy" />组件`)
        }
    })
}
