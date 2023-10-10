> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7283018190594572328?utm_source=gold_browser_extension)

Vue3 + Fabricjs 实现定制头像 2.0🌈
============================

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86b5e36a1b5441e8bed0860114b48e79~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1000&h=495&s=888187&e=png&b=ebdad4)

> 生在国旗下，长在春风里！国庆将至，采黎为大家带来 **定制头像 2.0（国庆头像）**，让我们用代码的形式为祖国庆生！欢迎大家**点赞收藏加关注哦**

前言
--

想看效果或者想定制春节头像的小伙伴请直奔 **效果**区域；  
想一睹**定制头像 2.0** 小工具的原理及实现思路请耐心阅读，本文代码片段较多~

### **在评论区晒定制头像，看看谁的头像最好看！🤣**

在线定制
----

🚀🚀🚀 **[定制头像入口, 体验地址](https://link.juejin.cn?target=https%3A%2F%2Fwww.xiaoli.vip%2Fcustom-avatar "https://www.xiaoli.vip/custom-avatar")** 🚀🚀🚀

🚀🚀🚀 **[github 项目地址（欢迎⭐）](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaoli1999%2Fcustom-avatar "https://github.com/xiaoli1999/custom-avatar")** 🚀🚀🚀

喜欢这个小工具的话，动动小手点个 star⭐哦，谢谢！

关于迭代
----

继 `定制兔年春节头像` 上线后，很多小伙伴体验后第一时间就给了建议、反馈；在大家的帮助下，工具也在不断的完善；比如导出图片不够清晰、不能设置透明度等等，迭代到 1.4.0 后，已经可以保证正常的使用了，这里采黎给大家说声谢谢！

由于当时聚焦在**兔年**、**春节头像**上，工具风格单一，功能还不够完善，内部逻辑有点大材小用等等，于是便有了大版本的**定制头像 2.0** 迭代。

更新内容
----

### 仓库名称

*   [x]  由 **custom-rabbitImage** 改为 **custom-avatar**

### 页面

*   [x]  重构页面整体风格，调整为通用型风格
*   [x]  兼容 pc、移动端
*   [x]  移动端头像墙采用瀑布流

### 画布相关

*   [x]  用户上传的原图做短边适配，保证不变形
*   [x]  优化元素控件效果，增加删除控件
*   [x]  优化绘制逻辑，减少无用运算。

### 新增功能

*   [x]  增加多主题选项（中秋节、国庆节、春节等，其他传统节日敬请期待）
*   [x]  增加贴纸效果，可多选、可删除
*   [x]  增加快速切换头像框功能
*   [x]  增加通知功能（xx 用户在 3 分钟前定制了国庆头像）
*   [x]  增加分享海报功能
*   [x]  增加头像墙功能，用户可预览他人定制的头像

### 修复已知问题

*   [x]  修复 qq 浏览器无法选择文件
*   [x]  修复微信浏览器无法保存图片

项目架构
----

```
vue3 | vite | ts | less | Elemenu UI | eslint | stylelint | husky | lint-staged | commitlint
```

所需素材
----

头像框、贴纸正在设计中，会一点一点补起来。

### 中秋主题

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be50eebf61b84b51b126ac31a31345b8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1344&h=314&s=178133&e=png&b=fefafa)

### 国庆主题

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/026e22eef5ae421a9434754afd749d30~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1371&h=340&s=171160&e=png&b=fdf9f8)

### 春节主题

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e09a89a568a47c9b88e3bde7c9cfa63~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1336&h=379&s=227629&e=png&b=fdf9f8)

思路
--

基本思路不变，[定制兔年春节头像](https://juejin.cn/post/7189425070291288121 "https://juejin.cn/post/7189425070291288121")中已经讲过，这里就不再赘述了。

### 画布交互逻辑优化

这是第一版的逻辑梳理 ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2e2b6b594b54822a1362d4375577453~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

考虑到定制头像工具图层不会过多，功能不会太复杂，于是 在新版中做了如下优化

*   删除绘制多个图层逻辑（监听图层列表变化，进而绘制图层）
*   绘制头像框改为主动调用，减少无用调用频次；
*   绘制贴纸为主动调用，可绘制多个
*   删除画布操作同步逻辑（不需要回显数据到页面，也不用二次绘制，故删除）

做完上述优化后，代码量明显下来了；只怪当时没有过多的思考，就将其他项目的实现方式生搬硬套了。

代码实现
----

### 画布

1.  初始化画布及控件

```
const init = () => {
    /* 初始化控件 */
    initFabricControl()

    /* 初始化画布 */
    Canvas = initCanvas(CanvasId.value, canvasSize, false)

    // 元素缩放事件
    Canvas.on('object:scaling', canvasMouseScaling)
}


/* 初始化控件 */
const initFabricControl = () => {
    fabric.Object.prototype.set(control)
    // 设置缩放摇杆偏移
    fabric.Object.prototype.controls.mtr.offsetY = control.mtrOffsetY
    // 隐藏不需要的控件
    hiddenControl.map((name: string) => (fabric.Object.prototype.controls[name].visible = false))

    /* 添加删除控件 */
    const delImgElement = document.createElement('img')
    delImgElement.src = new URL('./icons/delete.png', import.meta.url).href

    const size = 52

    const deleteControlHandel = (e, transform:any) => {
        const target = transform.target
        const canvas = target.canvas
        canvas.remove(target).renderAll()
    }

    const renderDeleteIcon = (ctx:any, left:any, top:any, styleOverride:any, fabricObject:any) => {
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(delImgElement, -size / 2, -size / 2, size, size)
        ctx.restore()
    }

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cornerSize: size,
        offsetY: -48,
        offsetX: 48,
        cursorStyle: 'pointer',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mouseUpHandler: deleteControlHandel,
        render: renderDeleteIcon
    })
}
```

2.  监听原图（用户上传的头像）改变，并进行短边适配

```
/* 更改原图 */
watch(() => props.bg, async (val) => (await drawBackground(Canvas, val)))

/**
 * @function drawBackground 绘制背景
 * @param { Object } Canvas 画布实例
 * @param { String } bgUrl 用户上传得原图片链接
 */
export const drawBackground = async (Canvas, bgUrl: string) => {
    return new Promise((resolve: any) => {
        if (!bgUrl) return resolve()

        fabric.Image.fromURL(bgUrl, (img: any) => {

            img.set({
                left: Canvas.width / 2,
                top: Canvas.height / 2,
                originX: 'center',
                originY: 'center'
            })

            /* 短边适配 */
            img.width > img.height ? img.scaleToHeight(Canvas.height, true) : img.scaleToWidth(Canvas.width, true)
            Canvas.setBackgroundImage(img, Canvas.renderAll.bind(Canvas))

            resolve()
        }, { crossOrigin: 'Anonymous' })
    })
}
```

3.  绘制头像框，并隐藏删除按钮控件

```
const frameName = 'frame'

/**
 * @function addFrame 添加头像框图层
 * @param { String } url 头像框链接
 */
const addFrame = async (url = '') => {
    if (!url) return

    const frameLayer: any = await drawImg(`${ url }!frame`)
    frameLayer.set({
        left: Canvas.width / 2,
        top: Canvas.height / 2
    })

    /* 隐藏删除按钮 */
    frameLayer.setControlVisible('deleteControl', false)

    frameLayer.scaleToWidth(Canvas.width, true)

    frameLayer.name = frameName
    addOrReplaceLayer(Canvas, frameLayer)
}
```

4.  设置头像框透明度

```
/**
 * @function setFrameOpacity 设置头像框透明度
 * @param { Number } opacity 透明度
 */
const setFrameOpacity = (opacity = 1) => {
    const frameLayer: any = findCanvasItem(Canvas, frameName)[1] || ''

    if (!frameLayer) return

    frameLayer.set({ opacity })
    Canvas.renderAll()
}
```

5.  绘制贴纸

```
/**
 * @function addMark 添加贴纸
 * @param { String } url 贴纸链接
 */
const addMark = async (url) => {
    if (!url) return

    const markLayer: any = await drawImg(url)
    markLayer.set({
        left: Canvas.width / 2,
        top: Canvas.height / 2
    })

    markLayer.width > markLayer.height ? markLayer.scaleToHeight(200, true) : markLayer.scaleToWidth(200, true)

    markLayer.name = `mark-${ createUuid() }`
    addOrReplaceLayer(Canvas, markLayer)
}
```

6.  保存图片，导出 base64

```
/**
 * @function save 保存效果图
 * @return { String } result base64 保存/预览时返回
 */
const save = async (): Promise<string> => {
    return Canvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: Canvas.width,
        height: Canvas.height
    })
}
```

现在代码明朗了很多，犹如柳暗花明。

### 页面交互

1.  用户上传图片，生成本地短链，然后绘制原头像，并默认绘制第一个头像框。

```
const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    const url = getCreatedUrl(file) ?? ''
    /* 用户初次上传头像默认选中第一个头像框 */
    if (!originAvatarUrl.value) {
        originAvatarUrl.value = url
        selectFrame(0)
    } else {
        originAvatarUrl.value = url
    }

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}
```

2.  用户点击头像框或点击快速切换按钮，绘制头像框

```
/* 快速切换头像框 */
const changeFrame = (isNext) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    const frameList =  picList[styleIndex.value].frameList
    if (isNext) {
        (selectFrameIndex.value === frameList.length - 1) ? selectFrameIndex.value = 0 : (selectFrameIndex.value as number)++
    } else {
        (selectFrameIndex.value === 0) ? selectFrameIndex.value = frameList.length - 1 : (selectFrameIndex.value as number)--
    }
    selectFrame(selectFrameIndex.value as number)
}

/* 绘制头像框-调用画布绘制函数 */
const selectFrame = (index: number) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    opacity.value = 1
    selectFrameIndex.value = index
    frameUrl.value = picList[styleIndex.value].frameList[index]
    DrawRef.value.addFrame(frameUrl.value)
}
```

3.  设置头像框透明度

```
const opacity = ref<number>(1)
const opacityChange = (num: number) => DrawRef.value.setFrameOpacity(num)
```

4.  点击贴纸，绘制贴纸

```
const selectMark = (index: number) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    const markUrl = picList[styleIndex.value].markList[index]
    DrawRef.value.addMark(markUrl)
}
```

页面的交互逻辑相对简单，一步一步走就 ok。

### 滚动通知动画效果

这里使用 vue 的过渡动画，模拟了滚动的效果， 本质就是 key 变了后，会触发弹入弹出效果。

```
<transition >
    <div v-if="avatarList && avatarList.length" class="notice" :key="avatarList[noticeIndex].last_modified">
        <p>
            <span style="color: #409eff;">游客{{ (avatarList[noticeIndex].last_modified + '').slice(-5) }} </span>
            <span style="padding-left: 2px;">{{ calcOverTime(avatarList[noticeIndex].last_modified) }}前</span>
            <span style="padding-right: 2px;">制作了</span>
            <span style="color: #f56c6c;">{{ styleEnums[avatarList[noticeIndex].id] }}头像 </span>
            <span style="padding-left: 4px;"></span>
        </p>
        <img :src="avatarList[noticeIndex].url" alt="">
    </div>
</transition>
```

### 海报功能

这个用 **html2canvas** 库就好了，用正常的 css 属性，他都可以实现。

```
<!-- 生成海报 -->
<div id="poster" class="poster">
    <!-- 内容省略 -->
</div>
```

```
/* 注意图片跨域 */
await nextTick(() => {
    /* 生成海报 */
    const posterDom = document.getElementById('poster') as HTMLElement
    html2canvas(posterDom, { useCORS: true }).then((canvas) => {
        shareUrl.value = canvas.toDataURL('image/png')
        shareShow.value = true
        loading.value = false
    })
})
```

### 移动端瀑布流实现

pc 和移动端都是 grid 布局，我们给移动端的行列份数随机，pc 端强制设为 1，保证行、列所占的份数一致就好（定制头像导出都是正方形的）

**grid-auto-flow: dense;** 这个样式是关键，

```
<div class="wall">
    <div class="wall-list">
        <el-image v-for="(url, index) in avatarPageUrlList" :key="url" :src="url" 
        :style="{ gridColumn: `span ${ avatarList[index].span}`, gridRow: `span ${ avatarList[index].span }` }" />
    </div>
</div>
```

```
.wall {
    .wall-list {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        grid-auto-flow: dense;
    }

    .wall-more {
        padding-top: 16px;
        text-align: center;
    }
}

/* pc端不使用瀑布流，强覆盖行列份数 */
@media only screen and (min-width: 769px) {
    .wall {
        .wall-list {
            > div {
                grid-row: span 1 !important;
                grid-column: span 1 !important;
            }
        }
    }
}
```

到这里，基本核心、细节的点都实现了；若想知道更多代码设计、开发思路，请移步 github，代码已开源。

关于开源
----

这一路走来实属不易，其中苦涩不禁言说；我也深知，这个项目还有许多的不足，这并不能够一蹴而就的；大家在使用的过程中，有什么建议或意见，可以告诉我。这也是我觉得开源项目更有魅力的点，可以集思广益，集百家之众长。希望这个工具能愈发完善，得到更多人的喜欢！

余音
--

最近有个想法，准备做个创意工具专栏，这个还得再斟酌斟酌。

祝祖国节日快乐，也祝大家国庆快乐哦，再会！