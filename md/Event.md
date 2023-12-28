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

#css/image
object-position 用在 img 标签当中，来放置图片的位置
object-position: left bottom
# Header
快速分布在两端
justify-between （space-between）

## NavItem
hooks 读取路径和参数
usePathName
useParams

#shadcn
use the buttonVariants helper to create a link that looks like a button.
asChild 可以起同样的作用
```js
<Link className={buttonVariants({ variant: "outline" })}>Click here</Link>
<Button asChild>
  <Link href="/login">Login</Link>
</Button>
```

# Form
使用revalidatePath来清除对应页面的缓存数据
allows you to purge cached data on-demand for a specific path.


# React hook Form
使用方法 1：
1. 使用 useForm() 获得对应的 form 对象
	1. 可以通过z.infer\<typeof eventFormValidator> 来获取 form 里面的类型
2. 使用 control={form.control} 来控制对应的 FormItem
3. 


# MongoDB 数据库
1. 创建一个Schema
	1. 方法： new Scheme()
	2. 参数对象：形如
		1. {name: { type: String, required: true, unique: true }}
	3. By default Mongoose adds an \_id property to your schemas.
	4. Scheme 可以命名方法
2. 创建一个 Model
	1. 方法： model： model('Category', CategorySchema)
	2. 可以通过models.Category来检验是否已经创建：
		1. models.Category || model('Category', CategorySchema)
数据库 CRUD
3. 创建数据库条目：
	1. Model.create(obj) Category.create({ name: categoryName })
4.  找到所有条目
	1. Const categories = await Category.find();
5. 找到其他条目
	1. find 里面接受一个 condition 可以用来筛选
	2. \$and 表示两个 condtion 都要满足
	3. { title: { $regex: query, $options: 'i' } } 表示匹配 title 是 query 的类型，
		1. option 是 i 表示忽略大小写
	4. {$and: \[titleCondition, categoryCondition ? { category: categoryCondition._id \} : {}],}
6. 更新
	1. const updatedEvent = await Event.findByIdAndUpdate(
7. 删除
	1. const deletedEvent = await Event.findByIdAndDelete(eventId)

Populate方法
populate lets you pull in referenced documents from another collection
它允许你从另一个文档拉取对应的信息，有点类似与left join
```js
const people = await Person.create([{ name: 'James Cameron' }]);
await Movie.create({
  title: 'Terminator 2',
  director: people[0]._id,
  actors: [people[1]._id, people[2]._id]
});

// Load just the movie's director
let movie = await Movie.findOne().populate('director');
movie.director.name; // 'James Cameron'
```

If you call populate() multiple times with the same path, only the last one will take effect.


# 删除操作
#react/startTransition
用途：不阻塞 UI 的情况下更新状态
1. 参数：state update函数（也就是 SetXX函数）
	1. 有时候你可能调用第三方包，不能拥有Set 函数，你可以使用useDeferredValue
		1. useDeferredValue是用来对some prop or a custom Hook return value进行转换的
	2. 参数必须是同步函数。
	3. React 立即执行传入的函数，将其执行时发生的所有状态更新标记为转换
		1. 转换的状态更新将被其他状态更新中断
2. 不提供isPending 状态， 需要可以用 useTransition

# Event Page
grid-cols-1 md:grid-cols-2
表示有一列  md 以上是两列（ grid-template-colums: 1fr）


# 获取页面 路径的传统方法
window.location获取和操作当前浏览器窗口的 URL 信息
1. 当前页面的 URL window.location.href;
2. window.location.pathname;
3. const searchParams = window.location.search;
4. 可以直接修改，然后重定向到另外的界面

new URLSearchParams 把 location.search 转换成一个对象
1. get(key)  has(key) set(key,value)
2. getAllkeys，values

# Search 组件的封装
这里我们希望可以把 Search 的结果进行URL 分享，因此
当 Input 组件变换的时候我们应该在 Path 进行参数的相关修改，然后在 Page 页面根据不同的参数来加载不同的数据
router直接 push

useEffect 在卸载的时候把 timeID 去掉可以直接实现Debounc的效果