# stepper

-   步进器

## 用法

```json
{
    "usingComponents": {
        "stepper": "@jxb/union-sub/stepper/index"
    }
}
```

```html
<!-- 基础用法 -->
<stepper value="{{value}}" />
```

## Props

| 参数                  | 说明                                       | 类型           | 默认值 |
| --------------------- | ------------------------------------------ | -------------- | ------ |
| value                 | 输入值                                     | String、Number | 最小值 |
| min                   | 最小值                                     | String、Number | 1      |
| max                   | 最大值                                     | String、Number | -      |
| step                  | 步长                                       | String、Number | 1      |
| integer               | 是否只允许输入整数                         | Boolaen        | false  |
| digits                | 固定显示的小数位数                         | Number         | -      |
| async                 | 是否开启异步变更，开启后需要手动控制输入值 | Boolaen        | false  |
| disabled              | 是否禁用                                   | Boolaen        | false  |
| disable-minus         | 是否禁用减少按钮                           | Boolaen        | false  |
| disable-input         | 是否禁用输入框                             | Boolaen        | false  |
| disable-plus          | 是否禁用增加按钮                           | Boolaen        | false  |
| show-minus            | 是否显示减少按钮                           | Boolaen        | false  |
| show-plus             | 是否显示增加按钮                           | Boolaen        | false  |
| cursor-spacing        | input原生cursor-spacing属性                | Number         | 0      |
| always-embed          | input原生always-embed属性                  | Boolean        | false  |
| adjust-position       | input原生adjust-position属性               | Boolean        | false  |
| hold-keyboard         | input原生hold-keyboard属性                 | Boolean        | false  |
| long-press            | 是否开启长按手势                           | Boolean        | true   |
| long-press-start-time | 长按触发时间                               | Number         | 600    |
| long-press-interval   | 长按频率时间                               | Number         | 200    |

# Events

| 事件名         | 说明                     | 参数                       |
| -------------- | ------------------------ | -------------------------- |
| bind:change    | 当绑定值变化时触发的事件 | event.detail: 当前输入的值 |
| bind:overlimit | 点击不可用的按钮时触发   | -                          |
| bind:minus     | 点击减少按钮时触发       | -                          |
| bind:plus      | 点击增加按钮时触发       | -                          |
| bind:focus     | 输入框聚焦时触发         | -                          |
| bind:blur      | 输入框失焦时触发         | -                          |

## Custom-class

| 类名               | 说明           |
| ------------------ | -------------- |
| custom-class       | 根节点样式类   |
| custom-minus-class | 减号按钮样式类 |
| custom-input-class | 输入框样式类   |
| custom-plus-class  | 加号按钮样式类 |
