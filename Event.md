# 字体
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',// 用来标识
})
subsets 表示包含哪些字符，这里只对拉丁符号进行字体的设置
使用时在 className 用 poppins.variable


#tailwind 
在 Tailwind CSS 中，@layer 指令用于定义样式层级，以便更好地组织和管理你的样式
@layer utilities：这个层级用于定义实用工具类，例如 bg-red-500、p-4 等。这些类通常用于快速应用一些常见的样式规则，如间距、颜色、背景等。
@layer components：在这个层级中，你可以定义组件级别的样式规则，例如按钮、卡片、导航栏等组件的样式。
@layer base：这个层级用于定义基础层级的样式规则，包括全局样式、文本样式、链接样式等。这些样式会在其他层级的样式之前加载和应用，确保了全局一致性。


# Home
#next/page/读取参数 
Params : slash 后面的参数
	app/shop/[slug]/page.js	/shop/1	{ slug: '1' }
	app/shop/[category]/[item]/page.js	/shop/1/2	{ category: '1', item: '2' }
SeachParams： 问号 后面的参数

#可选链和强制链
？防止前面的对象是空对象
!. 是空对象强制执行。
	 如果对象为 null 或 undefined，它会强制执行操作，即使这可能导致错误
#\?\?的使用
与 || 操作符相比，?? 更适合处理严格的空值情况，
	因为 || 在左侧的值为假值（false、0、空字符串等）时也会返回右侧的值，
	而 ?? 只在左侧的值为 null 或 undefined 时才返回右侧的值

#css/background-size
background-size用于指定背景的现实方式，通常和background-image一起用
cover：背景图像会被等比例缩放,会裁切
contain: 比例裁切，不会裁切
(这些值 object-fit也用，object-fit用在img标签上 )