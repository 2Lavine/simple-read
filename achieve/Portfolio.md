## Layout
#tailwind
!开头 表示!important
scroll-behavior: smooth; 来让滚动更流畅（通常情况下auto 会直接的跳转过去）

#tailwind/dark 
dark 样式的编写： 直接在 className里面写 “dark:bg-color” 加上dark前缀
在tailwind.config 里面添加 darkmode:class 这样我们在html里面的 className 添加"dark" 会自动选在 dark 前缀的样式

# Context
1. 该文档下的文件用来提供 context.Provider 给组件
步骤：
1. 在组件外 createContext
2. 在组件内使用 Provider 包裹 children
3. 在 Provider 内侧使用 Value ，表示你要传给 children 的值
```jsx
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
```

## theme-switch
伪类
link：表示链接在正常情况下（即页面刚加载完成时）显示的颜色。
visited：表示链接被点击后显示的颜色。
hover：表示鼠标悬停时显示的颜色。
focus：表示元素获得光标焦点时使用的颜色，主要用于文本框输入文字时使用（鼠标松开时显示的
active：表示当所指元素处于激活状态（鼠标在元素上按下还没有松开）时所显示的颜色。


## Header
用inset-0 和 absolute  快速给 背景上颜色
inset-0表示上、右、下和左边界都定位在距离其最近的非静态（非默认）定位的祖先元素的边界为 0 的位置，

Frame motion 用来 Nav 的切换：
在layoutId 属性被设置为 "activeSection"，这样在相同的 activeSection 之间切换，frame motion 会自动实现切换效果

Scroll-margin-top:
将scroll 的区域添加 margin 的长度。
即当跳转到#hash的对应 section 时，会在上方留出这段长度

#图片
展示图片
父元素用 div 或者其他弄好形状
图片使用object-cover 或者其他来填充
#tailwind/line-height 
leading 表示 lineheight

#html/a/下载文件
使用download 属性来下载文件
\<a href="example.pdf" download="custom-filename.pdf">下载自定义文档名</a\>

#html/a 
target="\_blank" 意味着链接将在新的浏览器窗口或标签页中打开

# frame motion
type sping 弹簧
可以通过custom 给 variant 传参

# projects
从常量数组中读取类型
type ProjectProps = (typeof projectsData)\[number\];

如何在 project 组件中判断出现的个数来分配样式：：
使用 在 project 组件加上group
通过 group-even来判断

小写 uppercase
    text-transform: uppercase;
tracking-normal 控制字母间距
	letter-spacing:



当中的 project 宽度
42rem （672px）


# Server action 
FormData 读取数据要用方法
Formdata.get("keyName")

# Form 的 submit btn
useFormStatus 来获取 form 的状态

![[Pasted image 20231224162300.png]]