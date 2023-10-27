/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="miniprogram-api-typings/index" />

type IResolveCallback = (data: { buttonId?: string; event: string }) => void

type ContentStyle = Record<string, string> | string

interface IContentItem {
    text: string
    className?: string
    action?: string
    style?: ContentStyle | ContentStyle[]
}

interface IContents {
    title: string
    contents: IContentItem[]
}
