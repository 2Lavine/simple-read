> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [tailwindcss.com](https://tailwindcss.com/docs/utility-first)

[Overview](#overview)
---------------------
This approach allows us to implement a completely custom component design without writing a single line of custom CSS.

Now I know what you’re thinking, _“this is an atrocity, what a horrible mess!”_ and you’re right, it’s kind of ugly. In fact it’s just about impossible to think this is a good idea the first time you see it — **you have to actually try it**.

But once you’ve actually built something this way, you’ll quickly notice some really important benefits:

*   **You aren’t wasting energy inventing class names**. No more adding silly class names like `sidebar-inner-wrapper` just to be able to style something, and no more agonizing over the perfect abstract(抽象) name for something that’s really just a flex container.
*   **Your CSS stops growing**. Using a traditional approach, your CSS files get bigger every time you add a new feature. With utilities, everything is reusable so you rarely need to write new CSS.
*   **Making changes feels safer**. CSS is global and you never know what you’re breaking when you make a change. Classes in your HTML are local, so you can change them without worrying about something else breaking.

When you realize how productive you can be working exclusively in HTML with predefined utility classes, working any other way will feel like torture.

[Why not just use inline styles?](#why-not-just-use-inline-styles)
------------------------------------------------------------------
But using utility classes has a few important advantages over inline styles:
*   **Designing with constraints**. Using inline styles, every value is a magic number. With utilities, you’re choosing styles from a predefined [design system](https://tailwindcss.com/docs/theme), which makes it much easier to build visually consistent UIs.
*   **Responsive design**. You can’t use media queries in inline styles, but you can use Tailwind’s [responsive utilities](https://tailwindcss.com/docs/responsive-design) to build fully responsive interfaces easily.
*   **Hover, focus, and other states**. Inline styles can’t target states like hover or focus, but Tailwind’s [state variants](https://tailwindcss.com/docs/hover-focus-and-other-states) make it easy to style those states with utility classes.

This component is fully responsive and includes a button with hover and focus styles, and is built entirely with utility classes:
[Maintainability concerns](#maintainability-concerns)
-----------------------------------------------------
The biggest maintainability concern when using a utility-first approach is managing commonly repeated utility combinations.

This is easily solved by [extracting components and partials](https://tailwindcss.com/docs/reusing-styles#extracting-components-and-partials), and using [editor and language features](https://tailwindcss.com/docs/reusing-styles#using-editor-and-language-features) like multi-cursor editing and simple loops.

Aside from that, maintaining a utility-first CSS project turns out to be a lot easier than maintaining a large CSS codebase, simply because HTML is so much easier to maintain than CSS. 