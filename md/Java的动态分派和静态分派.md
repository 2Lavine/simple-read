> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844904084835663885)

> Java 方法执行时的动态分派和静态分派是 Java 实现多态的本质

背景
==

Java 的动态分派和静态分派也是 Java 方法的执行原理。 Java 源代码的编译之后，方法之间的调用是使用符号引用来表示的。当字节码被 JVM 加载之后，符号引用才会被替换为对应方法在方法区的真实内存地址。那么在替换之前，由于 Java 的方法重写、重载，就导致符号引用对应的方法可能是一个虚方法，那么方法的真实实现在运行时就可能有多个。 所以在将符号引用替换为真实地址时，还需要做一件事情：那就是确定符号引用要替换的方法的版本。

运行时方法帧
======

与 C,C++ 一样，JVM 在运行时也会维护一个运行栈，用于方法的调用和返回。当调用一个方法时，会为方法在栈上分配一块内存区域作为方法的帧。_方法调用帧_又分为下面几个区域：

**局部变量表**

存储方法参数和方法体中的局部变量，其容量在编译期就已确定。容量的最小单位是 variable slot(变量槽)。 静态方法的局部变量数就是方法体中声明的变量数；实例方法的局部变量数会**多一个**，多出的一个就是我们平时在实例方法中访问的`this`。`this` 其实是编译器在编译时悄悄加到实例方法上的，而且是作为第一个参数。

**操作数栈**

JVM 的字节码指令执行机制是基于栈的，所以需要一个栈来存储字节码指令的操作数。

Android 的 VM 是基于寄存器的，所以没有操作栈区域。

> Android VM 采用寄存器存储操作数有两个主要原因：1. 寄存器乃是 CPU 内部的高速内存, 读写寄存器是与 CPU 交互最快的方式。2. 智能手机多使用 ARM 架构的 CPU, ARM 架构的 CPU 有很多通用寄存器可使用。

**动态链接**

方法体中调用其他方法时，会把将要调用的方法在常量池中的符号引用，转化为将要其在方法区内存中的开始地址信息，并储存到动态链接中。

**方法返回地址**

一个方法执行完毕之后，线程需要值得回到哪里继续执行，方法返回地址就是存储这个信息的。返回地址一般就是当前方法的调用者的程序计数器的值 (PC 寄存器)。

*   正常完成出口: 方法正常返回时，如果有返回值，返回值会被压入调用方法的操作数栈中
*   异常完成出口: 当方法发生了异常，且在异常表中没有找到匹配的异常处理流程时，方法将不会有返回值

方法调用
====

方法调用并不等同于方法执行，方法调用阶段唯一的任务就是确定被调用方法的版本（即调用哪一个方法）

调用方法的指令
-------

有以下字节码指令用于方法的调用:

<table><thead><tr><th>指令</th><th>用途</th><th>说明</th></tr></thead><tbody><tr><td><code>invokestatic</code></td><td>调用类的静态方法</td><td></td></tr><tr><td><code>invokespecfical</code></td><td>调用对象的构造函数和私有方法</td><td></td></tr><tr><td><code>invokevirtual</code></td><td>调用对象的 <code>public</code>/<code>protected</code> 的方法</td><td>可能通过继承复写的方法称做 virtual method: 表示要到运行时才能定位到真正的方法实现。通过符号引用确定虚方法直接引用的过程又叫做<em>动态分派</em></td></tr><tr><td><code>invokeinterface</code></td><td>调用接口的方法</td><td>具体的实现类将在调用时确定</td></tr><tr><td><code>invokedynamic</code></td><td>JDK1.7 为了让 JVM 支持动态类型语言引入的指令</td><td>让用户可以决定如何查找目标方法</td></tr></tbody></table>

符号引用到直接引用
---------

由于 Java 的编译没有 C C++ 编译过程中的链接阶段，所以 Class 文件中储存的只是符号引用，等到了在运行时才通过符号引用定位到方法区中方法代码在内存布局中的位置 -- 直接引用。

符号引用到直接引用的替换又涉及两种方式。一种是**解析**，另一种是**分派**。解析发生在类加载的解析阶段，分派发生在编译或方法调用阶段。

### 解析

在类加载的_解析阶段_会把满足「编译期可知，运行期不可变」的方法的符号引用替换为指向方法区的直接引用，不会延迟到运行时再去完成。

满足**编译期可知，运行期不可变**的方法有：构造函数、私有方法、静态方法、`final`修饰的方法。不满足上述条件的方法的符号引用替换发生在方法调用期间。

### 分派 Dispatch

> 多态的实现原理

#### 变量类型

理解分派之前，需要先看两个类型概念。

比如：`Object obj = new String("");`

*   静态类型

定义变量时，声明的类型。比如这里 `obj` 的静态类型就是 `Object`。静态类型在编译期的编译器就能知道。

*   实际类型

变量赋值时的实际类型。比如这里 `obj` 的实际类型就是 `String`。实际类型在编译期的编译器是不可知的。

#### 静态分派

根据变量的「静态类型 (外观类型)」匹配调用方法的过程称为静态分派。发生的场景为**方法重载**。

如下代码:

```
public class StaticDispatch {

    static abstract class Human { }
    static class Man extends Human { }
    static class Woman extends Human { }
    static class Child extends Human { }

    public void say(Human human) {
        System.out.println("human");
    }

    public void say(Man man) {
        System.out.println("man");
    }

    public void say(Woman woman) {
        System.out.println("woman");
    }

    public void say(Child child) {
        System.out.println("child");
    }
}
```

```
public static void main(String[] args) {
    Human man = new Man();
    Human woman = new Woman();
    Human child = new Child();

    StaticDispatch dispatch = new StaticDispatch();
    dispatch.say(man);
    dispatch.say(woman);
    dispatch.say(child);
}
```

`main` 方法的执行结果:

```
human
human
human
```

虽然 `StaticDispatch` 为每种 `Human` 的子类都重载了一个 `say` 方法，但是由于重载采用的是静态分派，是根据对象的静态类型做方法匹配的。所以结果全都匹配到了 `public void say(Human human)` 方法。`main` 方法编译之后的字节码:

```
public static main([Ljava/lang/String;)V
  NEW method_invoke/StaticDispatch$Man
  DUP
  INVOKESPECIAL method_invoke/StaticDispatch$Man.<init> ()V
  ASTORE 1
  NEW method_invoke/StaticDispatch$Woman
  DUP
  INVOKESPECIAL method_invoke/StaticDispatch$Woman.<init> ()V
  ASTORE 2
  NEW method_invoke/StaticDispatch$Child
  DUP
  INVOKESPECIAL method_invoke/StaticDispatch$Child.<init> ()V
  ASTORE 3
  NEW method_invoke/StaticDispatch
  DUP
  INVOKESPECIAL method_invoke/StaticDispatch.<init> ()V
  ASTORE 4
  // 下面为调用 say
  ALOAD 4
  ALOAD 1
  INVOKEVIRTUAL method_invoke/StaticDispatch.say (Lmethod_invoke/StaticDispatch$Human;)V
  ALOAD 4
  ALOAD 2
  INVOKEVIRTUAL method_invoke/StaticDispatch.say (Lmethod_invoke/StaticDispatch$Human;)V
  ALOAD 4
  ALOAD 3
  INVOKEVIRTUAL method_invoke/StaticDispatch.say (Lmethod_invoke/StaticDispatch$Human;)V
  RETURN
```

从字节码也能看到，编译器确实是按照静态分派选择了匹配静态类型的 `StaticDispatch.say(LStaticDispatch$Human;)V` 方法，而没有按照变量的实际类型去匹配重载的方法。

```
public class Overload {
    public static void out(char a) { System.out.println("char " + a); }
    public static void out(int a) {System.out.println("int " + a);}
    public static void out(long a) { System.out.println("long " + a); }
    public static void out(float a) { System.out.println("float " + a); }
    public static void out(double a) { System.out.println("double " + a); }
    public static void out(Integer a) { System.out.println("integer"); }
    public static void out(Character a) { System.out.println("character"); }
    public static void out(Serializable a) { System.out.println("serializable " + a); }
    public static void out(Comparable a) { System.out.println("comparable " + a); }
    public static void out(Object a) { System.out.println("object " + a); }
    public static void out(char... a) { System.out.println("char ... " + Arrays.toString(a)); }

    public static void main(String[] args) {
        out('c');
    }
}
```

这段代码也是一个静态分派的例子，编译器会选择参数类型做合适的函数去调用。可以注释掉所有 `out` 函数，留下 `out(Serializable a)`，你会发现程序也能成功编译和运行。如果留下`Serializeable` 和 `Comparable` 编译则会失败，提示对 `out` 的引用不明确。

#### 动态分派

根据变量的「实际类型」匹配调用方法的过程称为动态分派。发生的场景为**方法重写**。当调用一个可能被子类重写或继承的方法时，就会触发动态分派。

```
public class DynamicDispatch {

    static class Human {
        public void say() {
            System.out.println("human");
        }
    }

    static class Man extends Human {
        @Override
        public void say() {
            System.out.println("man");
        }
    }

    static class Woman extends Human {
        @Override
        public void say() {
            System.out.println("woman");
        }
    }
}
```

```
public static void main(String[] args) {
    Human human = new Human();
    Human man = new Man();
    Human woman = new Woman();
    human.say();
    man.say();
    woman.say();
}
```

`main` 方法的执行结果:

```
human
man
woman
```

意料之中，所谓的多态就是这样。那多态是如何实现的？

其实多态的实现过程也就是确定被重写的方法版本的过程。`main` 方法编译之后的字节码:

```
public static main([Ljava/lang/String;)V
  NEW method_invoke/DynamicDispatch$Human
  DUP
  INVOKESPECIAL method_invoke/DynamicDispatch$Human.<init> ()V
  ASTORE 1
  NEW method_invoke/DynamicDispatch$Man
  DUP
  INVOKESPECIAL method_invoke/DynamicDispatch$Man.<init> ()V
  ASTORE 2
  NEW method_invoke/DynamicDispatch$Woman
  DUP
  INVOKESPECIAL method_invoke/DynamicDispatch$Woman.<init> ()V
  ASTORE 3
  // 下面为多态调用 say
  ALOAD 1
  INVOKEVIRTUAL method_invoke/DynamicDispatch$Human.say ()V
  ALOAD 2
  INVOKEVIRTUAL method_invoke/DynamicDispatch$Human.say ()V
  ALOAD 3
  INVOKEVIRTUAL method_invoke/DynamicDispatch$Human.say ()V
  RETURN
```

这里通过字节码感觉都会调用`Hunman#say`方法的，但是运行之后并不是。

当 JVM 执行这两行字节码时:

```
ALOAD 1 
// 由上面 ASTORE 1 可知, 局部变量表的第一个变量是 Woman 的对象
INVOKEVIRTUAL method_invoke/DynamicDispatch$Human.say ()V
// INVOKEVIRTUAL 指令就会到 Woman 类中去寻找 say 方法
```

调用 say 方法时，JVM 会先去当前调用的对象的类中查找是否存在和目标方法的描述符、简单名称一样的方法，如果存在则将符号引用替换为找到的方法的直接引用，否则就向父类去查找，向父类的父类去查找..., 直到最后找不到抛出 _NoSuchMethod_ 异常。

Human 的 say 方法的签名:

```
public void say();
    descriptor: ()V
```

Woman 的 say 方法的签名:

```
public void say();
    descriptor: ()V
```

可见 Woman 类的 Human 类中的 say 方法的描述符和简单名称是一样的，所以 JVM 会优先匹配 Woman 类中的方法。这也是多态调用的底层逻辑。

> 阅读《深入理解 Java 虚拟机》记