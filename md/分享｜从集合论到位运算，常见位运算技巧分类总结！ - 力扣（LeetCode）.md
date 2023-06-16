> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [leetcode.cn](https://leetcode.cn/circle/discuss/CaOJ45/)

> 前言 本文将扫清位运算的迷雾，在集合论与位运算之间建立一座桥梁。

[](#前言)前言
---------

本文将扫清位运算的迷雾，在集合论与位运算之间建立一座桥梁。

在高中，我们学了集合论（set theory）的相关知识。例如，包含若干整数的集合 S={0,2,3}。在编程中，通常用哈希表（hash table）实现集合。例如 Java 中的 `HashSet`，C++ STL 中的 `unordered_set`。

在集合论中，有交集 ∩、并集 ∪、包含于 ⊆ 等等概念。如果编程实现「求两个哈希表的交集」，需要一个个地遍历哈希表中的元素。有没有效率更高的做法呢？

该二进制上场了。

集合可以用二进制表示，二进制**从低到高**第 i 位为 1 表示 i 在集合中，为 0 表示 i 不在集合中。例如集合 {0,2,3} 可以用二进制数 1101 表示；反过来，二进制数 1101 就对应着集合 {0,2,3}。

正式地说，包含非负整数的集合 S 可以用如下方式「压缩」成一个数字：

 f(S)=i∈S∑​2i

上面举例的 {0,2,3} 就可以压缩成 20+22+23=13，也就是二进制数 1101。

利用位运算「并行计算」的特点，我们可以高效地做一些和集合有关的运算。按照常见的应用场景，可以分为以下四类：

1.  集合与集合
2.  集合与元素
3.  遍历集合
4.  枚举集合

[](#一、集合与集合)一、集合与集合
-------------------

其中 & 表示按位与，∣ 表示按位或，⊕ 表示按位异或，∼ 表示按位取反。

其中「对称差」指仅在其中一个集合的元素。

<table><thead><tr><th>术语</th><th>集合</th><th>位运算</th><th>举例</th><th>举例</th></tr></thead><tbody><tr><td>交集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∩</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\cap B</annotation></semantics></math>A∩B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mi>b</mi></mrow><annotation encoding="application/x-tex">a\&amp;b</annotation></semantics></math>a&amp;b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∩</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\cap\ &amp;\{0,1,2\}\\=\ &amp;\{0,2\}\end{aligned}</annotation></semantics></math>∩&nbsp;=&nbsp;​{0,2,3}{0,1,2}{0,2}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0101</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\&amp;\ &amp;0111\\=\ &amp;0101\end{aligned}</annotation></semantics></math>&amp;&nbsp;=&nbsp;​110101110101​</td></tr><tr><td>并集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∪</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\cup B</annotation></semantics></math>A∪B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mi>b</mi></mrow><annotation encoding="application/x-tex">a\ \vert\ b</annotation></semantics></math>a&nbsp;∣&nbsp;b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∪</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\cup\ &amp;\{0,1,2\}\\=\ &amp;\{0,1,2,3\}\end{aligned}</annotation></semantics></math>∪&nbsp;=&nbsp;​{0,2,3}{0,1,2}{0,1,2,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">∣</mi><mtext>&nbsp;&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1111</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\vert\ \ &amp;0111\\=\ &amp;1111\end{aligned}</annotation></semantics></math>∣&nbsp;&nbsp;=&nbsp;​110101111111​</td></tr><tr><td>对称差</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">Δ</mi><mtext>&nbsp;</mtext><mi>B</mi></mrow><annotation encoding="application/x-tex">A\ \Delta\ B</annotation></semantics></math>A&nbsp;Δ&nbsp;B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>⊕</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\oplus b</annotation></semantics></math>a⊕b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">Δ</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\Delta\ &amp;\{0,1,2\}\\=\ &amp;\{1,3\}\end{aligned}</annotation></semantics></math>Δ&nbsp;=&nbsp;​{0,2,3}{0,1,2}{1,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>⊕</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1010</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\oplus\ &amp;0111\\=\ &amp;1010\end{aligned}</annotation></semantics></math>⊕&nbsp;=&nbsp;​110101111010​</td></tr><tr><td>差</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∖</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\setminus B</annotation></semantics></math>A∖B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\&amp;\sim b</annotation></semantics></math>a&amp;∼b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∖</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\setminus\ &amp;\{1,2\}\\=\ &amp;\{0,3\}\end{aligned}</annotation></semantics></math>∖&nbsp;=&nbsp;​{0,2,3}{1,2}{0,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1001</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1001</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\&amp;\ &amp;1001\\=\ &amp;1001\end{aligned}</annotation></semantics></math>&amp;&nbsp;=&nbsp;​110110011001​</td></tr><tr><td>差（子集）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∖</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\setminus B</annotation></semantics></math>A∖B（<math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>B</mi><mo>⊆</mo><mi>A</mi></mrow><annotation encoding="application/x-tex">B\subseteq A</annotation></semantics></math>B⊆A）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>⊕</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\oplus b</annotation></semantics></math>a⊕b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∖</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\setminus\ &amp;\{0,2\}\\=\ &amp;\{3\}\end{aligned}</annotation></semantics></math>∖&nbsp;=&nbsp;​{0,2,3}{0,2}{3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>⊕</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1000</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\oplus\ &amp;0101\\=\ &amp;1000\end{aligned}</annotation></semantics></math>⊕&nbsp;=&nbsp;​110101011000​</td></tr><tr><td>包含于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>⊆</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\subseteq B</annotation></semantics></math>A⊆B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mi>b</mi><mo>=</mo><mi>a</mi></mrow><annotation encoding="application/x-tex">a\&amp; b = a</annotation></semantics></math>a&amp;b=a<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mi>b</mi><mo>=</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\ \vert\ b = b</annotation></semantics></math>a&nbsp;∣&nbsp;b=b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo><mo>⊆</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2\}\subseteq \{0,2,3\}</annotation></semantics></math>{0,2}⊆{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0101</mn><mi mathvariant="normal">&amp;</mi><mn>1101</mn><mo>=</mo><mn>0101</mn></mrow><annotation encoding="application/x-tex">0101\&amp; 1101 = 0101</annotation></semantics></math>0101&amp;1101=0101<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0101</mn><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mn>1101</mn><mo>=</mo><mn>1101</mn></mrow><annotation encoding="application/x-tex">0101\ \vert\ 1101 = 1101</annotation></semantics></math>0101&nbsp;∣&nbsp;1101=1101</td></tr></tbody></table>

> 注 1：按位取反的例子中，仅列出最低 4 个比特位取反后的结果，即 0110 取反后是 1001。
> 
> 注 2：包含于的两种位运算写法是等价的，在编程时只需判断其中任意一种。
> 
> 注 3：编程时，请注意运算符的优先级。例如 `==` 在某些语言中优先级更高。

[](#二、集合与yuan素)二、集合与元素
----------------------

通常会用到位移运算。

其中 << 表示左移，>> 表示右移。

> 注：左移 i 位相当于乘 2i，右移 i 位相当于除 2i。

<table><thead><tr><th>术语</th><th>集合</th><th>位运算</th><th>举例</th><th>举例</th></tr></thead><tbody><tr><td>空集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∅</mi></mrow><annotation encoding="application/x-tex">\varnothing</annotation></semantics></math>∅</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0</mn></mrow><annotation encoding="application/x-tex">0</annotation></semantics></math>0</td><td></td><td></td></tr><tr><td>单元素集合</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{i\}</annotation></semantics></math>{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi></mrow><annotation encoding="application/x-tex">1\ \texttt{&lt;&lt;}\ i</annotation></semantics></math>1&nbsp;&lt;&lt;&nbsp;i</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{2\}</annotation></semantics></math>{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn></mrow><annotation encoding="application/x-tex">1\ \texttt{&lt;&lt;}\ 2</annotation></semantics></math>1&nbsp;&lt;&lt;&nbsp;2</td></tr><tr><td>全集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>U</mi><mo>=</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mo>⋯</mo><mi>n</mi><mo>−</mo><mn>1</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">U=\{0,1,2,\cdots n-1\}</annotation></semantics></math>U={0,1,2,⋯n−1}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>n</mi><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1\ \texttt{&lt;&lt;}\ n) - 1</annotation></semantics></math>(1&nbsp;&lt;&lt;&nbsp;n)−1</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,1,2,3\}</annotation></semantics></math>{0,1,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>4</mn><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1\ \texttt{&lt;&lt;}\ 4)-1</annotation></semantics></math>(1&nbsp;&lt;&lt;&nbsp;4)−1</td></tr><tr><td>补集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi mathvariant="normal">∁</mi><mi>U</mi></msub><mi>S</mi></mrow><annotation encoding="application/x-tex">\complement_US</annotation></semantics></math>∁U​S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>∼</mo><mi>s</mi></mrow><annotation encoding="application/x-tex">\sim s</annotation></semantics></math>∼s 或者<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>n</mi><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mi>s</mi></mrow><annotation encoding="application/x-tex">((1\ \texttt{&lt;&lt;}\ n) - 1)\&amp;\sim s</annotation></semantics></math>((1&nbsp;&lt;&lt;&nbsp;n)−1)&amp;∼s</td><td></td><td></td></tr><tr><td>属于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>∈</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">i\in S</annotation></semantics></math>i∈S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>s</mi><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(s\ \texttt{&gt;&gt;}\ i)\ \&amp;\ 1 =1</annotation></semantics></math>(s&nbsp;&gt;&gt;&nbsp;i)&nbsp;&amp;&nbsp;1=1</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mo>∈</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">2\in \{0,2,3\}</annotation></semantics></math>2∈{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1101</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1101\ \texttt{&gt;&gt;}\ 2)\ \&amp;\ 1 =1</annotation></semantics></math>(1101&nbsp;&gt;&gt;&nbsp;2)&nbsp;&amp;&nbsp;1=1</td></tr><tr><td>不属于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo mathvariant="normal">∉</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">i\notin S</annotation></semantics></math>i∈/​S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>s</mi><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">(s\ \texttt{&gt;&gt;}\ i)\ \&amp;\ 1 =0</annotation></semantics></math>(s&nbsp;&gt;&gt;&nbsp;i)&nbsp;&amp;&nbsp;1=0</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mo mathvariant="normal">∉</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">1\notin\{0,2,3\}</annotation></semantics></math>1∈/​{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1101</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mn>1</mn><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">(1101\ \texttt{&gt;&gt;}\ 1)\ \&amp;\ 1 =0</annotation></semantics></math>(1101&nbsp;&gt;&gt;&nbsp;1)&nbsp;&amp;&nbsp;1=0</td></tr><tr><td>添加元素</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∪</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">S\cup \{i\}</annotation></semantics></math>S∪{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\ \vert\ (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s&nbsp;∣&nbsp;(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∪</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,3\}\cup \{2\}</annotation></semantics></math>{0,3}∪{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1001</mn><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1001\ \vert\ (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1001&nbsp;∣&nbsp;(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除元素</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∖</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">S\setminus \{i\}</annotation></semantics></math>S∖{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\&amp;\sim (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s&amp;∼(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∖</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2,3\}\setminus \{2\}</annotation></semantics></math>{0,2,3}∖{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1101</mn><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1101\&amp;\sim (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1101&amp;∼(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除元素（一定在集合中）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∖</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">S\setminus \{i\}</annotation></semantics></math>S∖{i}（<math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>∈</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">i\in S</annotation></semantics></math>i∈S）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mo>⊕</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\oplus (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s⊕(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∖</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2,3\}\setminus \{2\}</annotation></semantics></math>{0,2,3}∖{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1101</mn><mo>⊕</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1101\oplus (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1101⊕(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除最小元素</td><td></td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mi mathvariant="normal">&amp;</mi><mo stretchy="false">(</mo><mi>s</mi><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\&amp; (s-1)</annotation></semantics></math>s&amp;(s−1)</td><td></td><td>见下</td></tr></tbody></table>

```
s = 101100
    s-1 = 101011 // 最低位的 1 变成 0，同时 1 右边的 0 都取反，变成 1
s&(s-1) = 101000
```

此外，某些数字可以借助标准库提供的函数算出：

<table><thead><tr><th>术语</th><th>Python</th><th>Java</th><th>C++</th><th>Go</th></tr></thead><tbody><tr><td>集合大小（元素个数）</td><td><code>s.bit_count()</code></td><td><code>Integer.bitcount(s)</code></td><td><code>__builtin_popcount(s)</code></td><td><code>bits.OnesCount(s)</code></td></tr><tr><td>二进制长度（减一得到集合中的最大元素）</td><td><code>s.bit_length()</code></td><td><code>32-Integer.numberOfLeadingZeros(s)</code></td><td><code>32-__builtin_clz(s)</code></td><td><code>bits.Len(s)</code></td></tr><tr><td>集合中的最小元素</td><td><code>(s&amp;-s).bit_length()-1</code></td><td><code>Integer.numberOfTrailingZeros(s)</code></td><td><code>__builtin_ctz(s)</code></td><td><code>bits.TrailingZeros(s)</code></td></tr></tbody></table>

特别地，只包含最小元素的子集，即二进制最低 1 及其后面的 0，也叫 lowbit，可以用 `s & -s` 算出。举例说明：

```
s = 101100
    ~s = 010011
(~s)+1 = 010100 // 根据补码的定义，这就是 -s   最低 1 左侧取反，右侧不变
s & -s = 000100 // lowbit
```

[](#三、遍历集合)三、遍历集合
-----------------

设元素范围从 0 到 n−1，挨个判断元素是否在集合 s 中：

*   Python3
*   Java
*   C++
*   Go

```
for i in range(n):
    if (s >> i) & 1:  # i 在 s 中
        # 处理 i 的逻辑
```

```
for (int i = 0; i < n; i++) {
    if (((s >> i) & 1) == 1) { // i 在 s 中
        // 处理 i 的逻辑
    }
}
```

```
for (int i = 0; i < n; i++) {
    if ((s >> i) & 1) { // i 在 s 中
        // 处理 i 的逻辑
    }
}
```

```
for i := 0; i < n; i++ {
    if s>>i&1 == 1 { // i 在 s 中
        // 处理 i 的逻辑
    }
}
```

[](#四、枚举集合)四、枚举集合
-----------------

设元素范围从 0 到 n−1，从空集枚举到全集：

*   Python3
*   Java
*   C++
*   Go

```
for s in range(1 << n):
    # 处理 s 的逻辑
```

```
for (int s = 0; s < (1 << n); s++) {
    // 处理 s 的逻辑
}
```

```
for (int s = 0; s < (1 << n); s++) {
    // 处理 s 的逻辑
}
```

```
for s := 0; s < 1<<n; s++ {
    // 处理 s 的逻辑
}
```

设集合为 s，**从大到小**枚举 s 的所有非空子集 sub：

*   Python3
*   Java
*   C++
*   Go

```
sub = s
while sub:
    # 处理 sub 的逻辑
    sub = (sub - 1) & s
```

```
for (int sub = s; sub > 0; sub = (sub - 1) & s) {
    // 处理 sub 的逻辑
}
```

```
for (int sub = s; sub; sub = (sub - 1) & s) {
    // 处理 sub 的逻辑
}
```

```
for sub := s; sub > 0; sub = (sub - 1) & s {
    // 处理 sub 的逻辑
}
```

为什么要写成 `sub = (sub - 1) & s` 呢？

暴力做法是从 s 出发，不断减一直到 0，但这样中途会遇到很多并不是 s 的子集的情况。例如 s=10101 时，减一得到 10100，这是 s 的子集。但再减一就得到 10011 了，这并不是 s 的子集，下一个子集应该是 10001。

把所有的合法子集按顺序列出来，会发现我们做的相当于「压缩版」的二进制减法，例如

 10101→10100→10001→10000→00101→⋯

如果忽略掉 10101 中的两个 0，数字的变化和二进制减法是一样的，即

 111→110→101→100→011→⋯

如何快速找到下一个子集呢？以 10100→10001 为例说明，普通的二进制减法会把最低位的 1 变成 0，同时 1 右边的 0 变成 1，即 10100→10011。「压缩版」的二进制减法也是类似的，把最低位的 1 变成 0，但同时对于 1 右边的 0，只保留在 s=10101 中的 1，所以是 10100→10001。怎么保留？& 10101 就行。

> 注：还可以枚举 s 的所有大小**恰好**为 k 的子集，这一技巧叫做 Gosper's Hack，具体可以看我在 b 站的讲解（搜索 Gosper's Hack）。

[](#练习)练习
---------

用位运算完成如下题目：

*   [78. 子集](https://leetcode.cn/problems/subsets/)
*   [77. 组合](https://leetcode.cn/problems/combinations/)
*   [46. 全排列](https://leetcode.cn/problems/permutations/)

然后是一些状态压缩 DP。这类题目通常和排列 / 子集有关，可以先从暴力回溯开始思考，再过渡到记忆化搜索和递推。

*   [1879. 两个数组最小的异或值之和](https://leetcode.cn/problems/minimum-xor-sum-of-two-arrays/)
*   [2172. 数组的最大与和](https://leetcode.cn/problems/maximum-and-sum-of-array/)
*   [1125. 最小的必要团队](https://leetcode.cn/problems/smallest-sufficient-team/)，[题解](https://leetcode.cn/problems/smallest-sufficient-team/solution/zhuang-ya-0-1-bei-bao-cha-biao-fa-vs-shu-qode/)
*   [1986. 完成任务的最少工作时间段](https://leetcode.cn/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)
*   [1494. 并行课程 II](https://leetcode.cn/problems/parallel-courses-ii/)

> 有空把这些题目的题解补上（挖坑

更多题目，可以在题库中同时选上「动态规划」和「位运算」这两个标签：[链接](https://leetcode.cn/problemset/all/?page=1&topicSlugs=dynamic-programming%2Cbit-manipulation)。

* * *

如您有任何问题和建议，欢迎在评论区留言。

制作不易，欢迎点赞！另外欢迎关注 b 站 @灵茶山艾府，高质量算法教学，持续更新中~