> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.patterns.dev](https://www.patterns.dev/react/compound-pattern)

> Create multiple components that work together to perform a single task

Design Pattern

In our application, we often have components that belong to each other. They’re dependent on each other through the shared state, and share logic together. You often see this with components like `select`, dropdown components, or menu items. The **compound component pattern** allows you to create components that all work together to perform a task.

* * *

Context API
-----------

Let’s look at an example: we have a list of squirrel images! Besides just showing squirrel images, we want to add a button that makes it possible for the user to edit or delete the image. We can implement a `FlyOut` component that shows a list when the user toggles the component.

Within a `FlyOut` component, we essentially have three things:

*   The `FlyOut` wrapper, which contains the toggle button and the list
*   The `Toggle` button, which toggles the `List`
*   The `List` , which contains the list of menu items

Using the Compound component pattern with React’s [Context API](https://reactjs.org/docs/context.html) is perfect for this example!

First, let’s create the `FlyOut` component. This component keeps the state, and returns a `FlyOutProvider` with the value of the toggle to all the children it receives.

```
const FlyOutContext = createContext();

function FlyOut(props) {
  const [open, toggle] = useState(false);

  return (
    <FlyOutContext.Provider value={{ open, toggle }}>
      {props.children}
    </FlyOutContext.Provider>
  );
}
```

We now have a stateful `FlyOut` component that can pass the value of `open` and `toggle` to its children!

Let’s create the `Toggle` component. This component simply renders the component on which the user can click in order to toggle the menu.

```
function Toggle() {
  const { open, toggle } = useContext(FlyOutContext);

  return (
    <div onClick={() => toggle(!open)}>
      <Icon />
    </div>
  );
}
```

In order to actually give `Toggle` access to the `FlyOutContext` provider, we need to render it as a child component of `FlyOut`! We _could_ just simply render this as a child component. However, we can also make the `Toggle` component a property of the `FlyOut` component!

```
const FlyOutContext = createContext();

function FlyOut(props) {
  const [open, toggle] = useState(false);

  return (
    <FlyOutContext.Provider value={{ open, toggle }}>
      {props.children}
    </FlyOutContext.Provider>
  );
}

function Toggle() {
  const { open, toggle } = useContext(FlyOutContext);

  return (
    <div onClick={() => toggle(!open)}>
      <Icon />
    </div>
  );
}

FlyOut.Toggle = Toggle;
```

This means that if we ever want to use the `FlyOut` component in any file, we only have to import `FlyOut`!

```
import React from "react";
import { FlyOut } from "./FlyOut";

export default function FlyoutMenu() {
  return (
    <FlyOut>
      <FlyOut.Toggle />
    </FlyOut>
  );
}
```

Just a toggle is not enough. We also need to have a `List` with list items, which open and close based on the value of `open`.

```
function List({ children }) {
  const { open } = React.useContext(FlyOutContext);
  return open && <ul>{children}</ul>;
}

function Item({ children }) {
  return <li>{children}</li>;
}
```

The `List` component renders its children based on whether the value of `open` is `true` or `false`. Let’s make `List` and `Item` a property of the `FlyOut` component, just like we did with the `Toggle` component.

```
const FlyOutContext = createContext();

function FlyOut(props) {
  const [open, toggle] = useState(false);

  return (
    <FlyOutContext.Provider value={{ open, toggle }}>
      {props.children}
    </FlyOutContext.Provider>
  );
}

function Toggle() {
  const { open, toggle } = useContext(FlyOutContext);

  return (
    <div onClick={() => toggle(!open)}>
      <Icon />
    </div>
  );
}

function List({ children }) {
  const { open } = useContext(FlyOutContext);
  return open && <ul>{children}</ul>;
}

function Item({ children }) {
  return <li>{children}</li>;
}

FlyOut.Toggle = Toggle;
FlyOut.List = List;
FlyOut.Item = Item;
```

We can now use them as properties on the `FlyOut` component! In this case, we want to show two options to the user: **Edit** and **Delete**. Let’s create a `FlyOut.List` that renders two `FlyOut.Item` components, one for the **Edit** option, and one for the **Delete** option.

```
import React from "react";
import { FlyOut } from "./FlyOut";

export default function FlyoutMenu() {
  return (
    <FlyOut>
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item>Edit</FlyOut.Item>
        <FlyOut.Item>Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
}
```

Perfect! We just created an entire `FlyOut` component without adding any state in the `FlyOutMenu` itself!

JavaScript iconindex.jsJavaScript iconFlyOut.jsJavaScript iconFlyoutMenu.jsJavaScript iconImages.js

```
1import React from "react";2import "./styles.css";3import { FlyOut } from "./FlyOut";4
5export default function FlyoutMenu() {6  return (7    <FlyOut>8      <FlyOut.Toggle ></FlyOut>9      <FlyOut.List>10        <FlyOut.Item>Edit</FlyOut.Item>11        <FlyOut.Item>Delete</FlyOut.Item>12      </FlyOut.List>13    </FlyOut>14  );15}
```

[Open CodeSandbox](https://codesandbox.io/embed/provider-pattern-2-ck29r)

The compound pattern is great when you’re building a component library. You’ll often see this pattern when using UI libraries like [Semantic UI](https://react.semantic-ui.com/modules/dropdown/#types-dropdown).

* * *

[`React.Children.map`](https://reactjs.org/docs/react-api.html#reactchildrenmap)
--------------------------------------------------------------------------------

We can also implement the Compound Component pattern by mapping over the children of the component. We can add the `open` and `toggle` properties to these elements, by [cloning](https://reactjs.org/docs/react-api.html#cloneelement) them with the additional props.

```
export function FlyOut(props) {
  const [open, toggle] = React.useState(false);

  return (
    <div>
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, { open, toggle })
      )}
    </div>
  );
}

```

All children components are cloned, and passed the value of `open` and `toggle`. Instead of having to use the Context API like in the previous example, we now have access to these two values through `props`.

JavaScript iconindex.jsJavaScript iconFlyOut.jsJavaScript iconFlyoutMenu.jsJavaScript iconImages.js

```
1import React from "react";2import Icon from "./Icon";3
4const FlyOutContext = React.createContext();5
6export function FlyOut(props) {7  const [open, toggle] = React.useState(false);8
9  return (10    <div>11      {React.Children.map(props.children, child =>12        React.cloneElement(child, { open, toggle })13      )}14    </div>15  );16}17
18function Toggle() {19  const { open, toggle } = React.useContext(FlyOutContext);20
21  return (22    <div class onClick={() => toggle(!open)}>23      <Icon ></Icon>24    </div>25  );26}27
28function List({ children }) {29  const { open } = React.useContext(FlyOutContext);30  return open && <ul class>{children}</ul>;31}32
33function Item({ children }) {34  return <li class>{children}</li>;35}36
37FlyOut.Toggle = Toggle;38FlyOut.List = List;39FlyOut.Item = Item;
```

[Open CodeSandbox](https://codesandbox.io/embed/provider-pattern-2-j9l1k)

* * *

Pros
----

Compound components manage their own internal state, which they share among the several child components. When implementing a compound component, we don’t have to worry about managing the state ourselves.

When importing a compound component, we don’t have to explicitly import the child components that are available on that component.

```
import { FlyOut } from "./FlyOut";

export default function FlyoutMenu() {
  return (
    <FlyOut>
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item>Edit</FlyOut.Item>
        <FlyOut.Item>Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
}

```

* * *

Cons
----

When using the `React.Children.map` to provide the values, the component nesting is limited. Only _direct children_ of the parent component will have access to the `open` and `toggle` props, meaning we can’t wrap any of these components in another component.

```
export default function FlyoutMenu() {
  return (
    <FlyOut>
      {/* This breaks */}
      <div>
        <FlyOut.Toggle />
        <FlyOut.List>
          <FlyOut.Item>Edit</FlyOut.Item>
          <FlyOut.Item>Delete</FlyOut.Item>
        </FlyOut.List>
      </div>
    </FlyOut>
  );
}

```

Cloning an element with `React.cloneElement` performs a shallow merge. Already existing props will be merged together with the new props that we pass. This could end up in a naming collision, if an already existing prop has the same name as the props we’re passing to the `React.cloneElement` method. As the props are shallowly merged, the value of that prop will be overwritten with the latest value that we pass.

* * *

References
----------

*   [Render Props - React](https://reactjs.org/docs/render-props.htm)
*   [React Hooks: Compound Components - Kent C. Dodds](https://kentcdodds.com/blog/compound-components-with-react-hooks)