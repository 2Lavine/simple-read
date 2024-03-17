%%begin highlights%%
i8 可存储数字范围是 -(27) ~ 27 - 1，即 -128 ~ 127。无符号类型可以存储的数字范围是 0 ~ 2n - 1，所以 u8 能够存储的数字为 0 ~ 28 - 1，即 0 ~ 255。

Rust 整型默认使用 i32

在当使用 --release 参数进行 release 模式构建时，Rust 不检测溢出。相反，当检测到整型溢出时，Rust 会按照补码循环溢出（two’s complement wrapping）的规则处理。简而言之，大于该类型最大值的数值会被补码转换成该类型能够支持的对应数字的最小值。

要显式处理可能的溢出，可以使用标准库针对原始数字类型提供的这些方法：
使用 wrapping_* 方法在所有模式下都按照补码循环溢出规则处理，例如 wrapping_add
如果使用 checked_* 方法时发生溢出，则返回 None 值
使用 overflowing_* 方法返回该值和一个指示是否存在溢出的布尔值
使用 saturating_* 方法使值达到最小值或最大值

浮点数陷阱

Rust 的 HashMap 数据结构，是一个 KV 类型的 Hash Map 实现，它对于 K 没有特定类型的限制，但是要求能用作 K 的类型必须实现了 std::cmp::Eq 特征，因此这意味着你无法使用浮点数作为 HashMap 的 Key，来存储键值对，但是作为对比，Rust 的整数类型、字符串类型、布尔类型都实现了该特征，因此可以作为 HashMap 的 Key。

通过类型后缀的方式进行类型标注：22是i32类型
let twenty_two = 22i32;

Rust 提供了一个非常简洁的方式，用来生成连续的数值，例如 1..5，生成从 1 到 4 的连续数字，不包含 5 ；1..=5，生成从 1 到 5 的连续数字，包含 5

for i in 1..=5

序列只允许用于数字或字符类型，原因是：它们可以连续，同时编译器在编译期可以检查该序列是否为空，

字符和数字值是 Rust 中仅有的可以用于判断是否为空的类型。

for i in 'a'..='z' {
println!("{}",i);
}

有理数和复数并未包含在标准库中

社区已经开发出高质量的 Rust 数值库：num。

在 Cargo.toml 中的 [dependencies] 下添加一行 num = "0.4.0"

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://course.rs/basic/base-type/numbers.html)
更新时间: 2024-01-11 20:44