%%begin highlights%%
or region in regions.iter()

关注下 println 后面的 !，如果你有 Ruby 编程经验，那么你可能会认为这是解构操作符，但是在 Rust 中，这是 宏 操作符，你目前可以认为宏是一种特殊类型函数

println 来说，我们没有使用其它语言惯用的 %s、%d 来做输出占位符，而是使用 {}，因为 Rust 在底层帮我们做了大量工作，会自动识别输出数据的类型，例如当前例子，会识别为 String 类型

和其它语言不同，Rust 的集合类型不能直接进行循环，需要变成迭代器（这里是通过 .iter() 方法）

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://course.rs/first-try/hello-world.html)
更新时间: 2024-01-11 20:14