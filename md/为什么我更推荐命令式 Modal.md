什么是声明式 Modal
------------
组件库中一般都会内置这类组件，最为参见的声明式 Modal 定义。
例如 Antd 5 中的声明式 Modal 是这样定义的。
```tsx
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}
```

Copy

上面是一个受控的声明式 Modal 定义，写起来非常臃肿。你需要手动控制 Modal 的 Open 状态。并且你需要首先定义一个状态，然后在编写 UI，将状态和 UI 绑定。

这样的写法，我们需要在同一个组件定义一个状态，一个触发器（例如 Button）-> 控制状态 -> 流转到 Modal 显示。不仅写起来复杂，后期维护起来也很困难。

业务越积越多，后面你的页面上可能是这样的。

TSX

```
<>
  <Button type="primary" onClick={showModal}>
    Open Modal 1
  </Button>

  <Button type="primary" onClick={showModal}>
    Open Modal 2
  </Button>

  {/* More buttons */}
  <Modal
    title="Basic Modal"
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
  >
    <p>Some contents...</p>
  </Modal>

  <Modal
    title="Basic Modal 2"
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
  >
    <p>Some contents...</p>
  </Modal>
  <Modal
    title="Basic Modal 3"
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
  >
    <p>Some contents...</p>
  </Modal>
</>
```

Copy

一个组件中填满了无数个 Modal 和 Button。

这个时候你会想去抽离 Modal 到外部。像这样：

TSX

```
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <BaseModal1 {...{ isModalOpen, handleOk, handleCancel }} />
    </>
  )
}
const BaseModal1 = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
    </Modal>
  )
}
```

Copy

然后你会发现控制 Modal 的状态还是在父组件顶层。导致父组件状态堆积越来越多。

TSX

```
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  // ....
}
```

Copy

然后你思来想去，直接把 Modal 和 Button 抽离到一起。

TSX

```
const App: React.FC = () => {
  return <BaseModal1 />
}
const BaseModal1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
      </Modal>
    </>
  )
}
```

Copy

好了，这样 Button 和 Modal 直接耦合了，后续你想单独复用 Modal 几乎不可能了。

想来想去，再把 Modal 拆了。像这样：

TSX

```
const App: React.FC = () => {
  return <BaseModal1WithButton />
}
const BaseModal1WithButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <BaseModal1 open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />
    </>
  )
}

const BaseModal1 = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
    </Modal>
  )
}
```

Copy

我去，为了解耦一个 Modal 居然要写这么多代码，而且还是不可复用的，乱七八糟的状态。

想象一下这才一个 Modal，就要写这么多。

后来，你又会遇到了这样的问题，因为控制 Modal 状态下沉了，导致你的 Modal 无法在父组件中直接控制。

然后你会直接在外部 Store 或者 Context 中下放这个状态。

TSX

```
import { atom } from 'jotai'
const BasicModal1OpenedAtomContext = createContext(atom(false))
const App: React.FC = () => {
  const ctxValue = useMemo(() => atom(false), [])

  return (
    <BasicModal1OpenedAtomContext.Provider value={ctxValue}>
      <button
        onClick={() => {
          jotaiStore.set(ctxValue, true)
        }}
      >
        Open Modal 1
      </button>
      <BaseModal1WithButton />
    </BasicModal1OpenedAtomContext.Provider>
  )
}

const BaseModal1 = ({ handleOk, handleCancel }) => {
  const [isModalOpen, setIsModalOpen] = useAtom(
    useContext(BasicModal1OpenedAtomContext),
  )
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
    </Modal>
  )
}
```

Copy

最后 ctx 或者 Store 里面的状态越来越多，你会发现你的代码越来越难以维护。最后你都不知道这个 Modal 状态到底需不需要。

**何况，Modal 就算没有显示，但是 Modal 还是存在于 React tree 上的，祖先组件的状态更新，也会导致 Modal 重新渲染产生性能开销。**

快试试命令式 Modal
------------

某些组件库中也会提供命令式 Modal，在 Antd 5 中是这样的。

TSX

```
function Comp() {
  const [modal, contextHolder] = Modal.useModal()

  return (
    <>
      <Button
        onClick={async () => {
          const confirmed = await modal.confirm(config)
          console.log('Confirmed: ', confirmed)
        }}
      >
        Confirm
      </Button>
      {contextHolder}
    </>
  )
}
```

Copy

上面的写法是不是简单了很多，不在需要外部状态控制显示隐藏。

但是看上去这个命令式 Modal 定义过于简单，一般只适用于对话框提示。并不会去承载复杂的业务逻辑。

好了，按照这样的思路，我们可以尝试一下自己实现一个命令式 Modal。我们实现的 Modal 需要做到最小化迁移原先的声明式 Modal，同时又能够承载复杂的业务逻辑。

总体思路，我们需要在应用顶层使用一个 Context 来存储所有 Modal 的状态。当 Modal 使用 `present` 时，创建一个 Modal 实例记录到 Context 中。当 Modal 被关闭时，销毁 Modal 实例。所以在顶层 `ModalStack` 中的状态应该只包含现在渲染的 Modal 实例。最大化节省内存资源。

实现一个命令式 Modal
-------------

接下来我使用 Antd Modal + [Jotai](https://jotai.org/) 的进行实现。其他类似组件实现方式基本一致。

首先，我们实现 `ModalStack`。

TSX

```
import { ModalProps as AntdModalProps, Modal } from 'antd'

type ModalProps = {
  id?: string

  content: ReactNode | ((props: ModalContentProps) => ReactNode)
} & Omit<AntdModalProps, 'open'>

const modalStackAtom = atom([] as (Omit<ModalProps, 'id'> & { id: string })[])

const ModalStack = () => {
  const stack = useAtomValue(modalStackAtom)

  return (
    <>
      {stack.map((props, index) => {
        return <ModalImpl key={props.id} {...props} index={index} />
      })}
    </>
  )
}
```

Copy

定义 `useModalStack` 用于唤出 Modal。

TSX

```
const modalIdToPropsMap = {} as Record<string, ModalProps>

export const presetModal = (
  props: ModalProps,
  modalId = ((Math.random() * 10) | 0).toString(),
) => {
  jotaiStore.set(modalStackAtom, (p) => {
    const modalProps = {
      ...props,
      id: props.id ?? modalId,
    } satisfies ModalProps
    modalIdToPropsMap[modalProps.id!] = modalProps
    return p.concat(modalProps)
  })

  return () => {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.filter((item) => item.id !== modalId)
    })
  }
}

export const useModalStack = () => {
  const id = useId()
  const currentCount = useRef(0)
  return {
    present(props: ModalProps) {
      const modalId = `${id}-${currentCount.current++}`
      return presetModal(props, modalId)
    },
  }
}
```

Copy

上面的代码，我们定义了 `modalStackAtom` 用于存储 Modal 实例。`presetModal` 用于唤出 Modal。`useModalStack` 的 `present` 用于唤出一个新的 Modal。

由于我们使用了 Jotai 外部状态去管理 Modal 实例，所以 `presetModal` 被提取到了外部，日后我们可以直接脱离 React 使用。

注意这个类型定义，我们基本直接继承了原有的 `ModalProps`，但是过滤了 `open` 属性。因为我们不需要外部控制 Modal 的显示隐藏，而是直接在 `ModalStack` 中控制 Modal 的显隐。

而 `content` 属性，后续方便我们去扩展传入的 props。比如这里，我们可以传入一个 ModalActions 作为 props。那么以后定义 Content 时候可以直接接受一个 props，通过 dismiss 方法关闭当前 Modal。

TSX

```
type ModalContentProps = {
  dismiss: () => void
}

type ModalProps = {
  id?: string

  content: ReactNode | ((props: ModalContentProps) => ReactNode)
} & Omit<AntdModalProps, 'open' | 'content'>
```

Copy

`<ModalImpl />` 的实现是非常简单的，在此之前，我们先定义一下 `ModalActionContext`，后续可以在 Modal 中直接调用使用。

TSX

```
const actions = {
  dismiss(id: string) {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.filter((item) => item.id !== id)
    })
  },
  dismissTop() {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.slice(0, -1)
    })
  },
  dismissAll() {
    jotaiStore.set(modalStackAtom, [])
  },
}
```

Copy

改进 `useModalStack`

DIFF

```
export const useModalStack = () => {
  const id = useId()
  const currentCount = useRef(0)
  return {
    present(props: ModalProps) {
      const modalId = `${id}-${currentCount.current++}`
      return presetModal(props, modalId)
    },
+    ...actions
  }
}
```

Copy

现在可以通过 `useModalStack().dismiss` 关闭某个 Modal 了，也可以通过 `useModalStack().dismissTop` 关闭最上层的 Modal 等等。

现在编写 `<ModalImpl />`：

TSX

```
const ModalActionContext = createContext<{
  dismiss: () => void
}>(null!)

export const useCurrentModalAction = () => useContext(ModalActionContext)

const ModalImpl: FC<
  Omit<ModalProps, 'id'> & {
    id: string
    index: number
  }
> = memo((props) => {
  const { content } = props
  const [open, setOpen] = useState(true)
  const setStack = useSetAtom(modalStackAtom)

  const removeFromStack = useEventCallback(() => {
    setStack((p) => {
      return p.filter((item) => item.id !== props.id)
    })
  })

  useEffect(() => {
    let isCancelled = false
    let timerId: any
    if (!open) {
      timerId = setTimeout(() => {
        if (isCancelled) return
        removeFromStack()
      }, 1000) // 这里控制一个时间差，等待 Modal 关闭后的动画完成，销毁 Modal 实例
    }
    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [open, removeFromStack])
  const onCancel = useEventCallback(() => {
    setOpen(false)
    props.onCancel?.()
  })

  return (
    <ModalActionContext.Provider // 这里在当前 Modal 上下文提供一些 Modal Actions
      value={useMemo(() => ({ dismiss: onCancel }), [onCancel])}
    >
      <Modal {...props} open={open} destroyOnClose onCancel={onCancel}>
        {typeof content === 'function'
          ? createElement(content, { dismiss: onCancel }) // 这里可以通过 props 传递参数到 content 中
          : content}
      </Modal>
    </ModalActionContext.Provider>
  )
})
ModalImpl.displayName = 'ModalImpl'
```

Copy

OK，这样就整体实现完了。

现在我们来到 React App 顶层组件，挂载 `<ModalStack />`。

TSX

```
const App = document.getElementById('root')
const Root: FC = () => {
  return (
    <div>
      <ModalStack />
    </div>
  )
}
```

Copy

然后像这样使用：

DIFF

```
<div>
      <ModalStack />
+      <Page />
  </div>
```

CopyTSX

```
const Page = () => {
  const { present } = useModalStack()
  return (
    <>
      <div>
        <button
          onClick={() => {
            present({
              title: 'Title',
              content: <ModalContent />,
            })
          }}
        >
          Modal Stack
        </button>
      </div>
    </>
  )
}

const ModalContent = () => {
  const { dismiss } = useCurrentModalAction() // 控制当前 Modal 的 actions

  return (
    <div>
      This Modal content.
      <br />
      <button onClick={dismiss}>Dismiss</button>
    </div>
  )
}
```

Copy

当然你也可以在 Modal 内部继续使用 `useModalStack` 唤出新的 Modal。

TSX

```
const ModalContent = () => {
  const { dismiss } = useCurrentModalAction()
  const { present, dismissAll } = useModalStack()

  return (
    <div>
      This Modal content.
      <ButtonGroup>
        <Button
          onClick={() => {
            present({
              title: 'Title',
              content: <ModalContent />,
            })
          }}
        >
          Present New
        </Button>
        <Button onClick={dismiss}>Dismiss This</Button>
        <Button onClick={dismissAll}>Dismiss All</Button>
      </ButtonGroup>
    </div>
  )
}
```

Copy<video src="https://cdn.jsdelivr.net/gh/Innei/fancy-2023@main/2023/1028192458.mp4" control></video>

甚至，你可以在 React 外部使用。

TS

```
const eventHandler = (type: Events) => {
  switch (type) {
    case 'Notify':
      presetModal({
        title: 'Title',
        content: () => createElement('div', null, 'Some notify here'),
      })
  }
}
```

Copy

完整案例
----

上面是基于 Antd 实现的一版，如果你的组件库没有提供命令式 Modal API，完全可以根据这个思路自己实现。

当然在某些情况下，我们可能需要不借助组件库实现一个 Modal。

而自己实现一个 Modal 你更需要考虑 Modal 堆叠时候的层级问题和出场动画的问题。

在很久以前，我曾在 [kami](https://github.com/mx-space/kami) 中实现了最初的一版。没有借助任何组件库和动画库。

[https://github.com/mx-space/kami/blob/v3.14.7/src/components/universal/Modal/stack.context.tsx](https://github.com/mx-space/kami/blob/v3.14.7/src/components/universal/Modal/stack.context.tsx)

TYPESCRIPT

```
import { clsx } from 'clsx'
import uniqueId from 'lodash-es/uniqueId'
import { observer } from 'mobx-react-lite'
import type {
  FC,
  FunctionComponentElement,
  ReactChildren,
  ReactElement,
  ReactNode,
} from 'react'
import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useIsClient } from '~/hooks/use-is-client'
import { useStore } from '~/store'

import type { ModalProps, ModalRefObject } from '.'
import { Modal } from '.'
import type { OverlayProps } from '../Overlay'
import { Overlay } from '../Overlay'

/**
 * @param {boolean} immediately 立即销毁，不会等待动画结束
 */
type Disposer = (immediately?: boolean) => void

export type ModalStackContextType = {
  /**
   * 递交一个 Modal
   */
  present<T>(comp: IModalStackComponent<T>): Disposer
  /**
   * 获取当前所有的 ModalStack
   */
  getStack: () => IModalStackStateType[]
  /**
   * 根据 Name 找到 Modal 实例
   */
  findCurrentByName: (name: string) => IModalStackStateType | undefined
  /**
   * 销毁所有 Modal
   */
  disposeAll: (immediately?: boolean) => Promise<void>
}

const ModalStackContext = createContext<ModalStackContextType>({
  present: () => () => void 0,
  getStack: () => [],
  findCurrentByName: () => void 0,
  disposeAll: () => Promise.resolve(undefined),
})

export const useModalStack = () => useContext(ModalStackContext)

export interface IModalStackComponent<T = any> extends UniversalProps {
  /**
   * 传递一个 Modal 组件
   */
  component: ReactNode | ReactElement | React.FC<T>
  /**
   * 传递组件的 props, 可以是一个函数, 如果是函数, 则会在 Modal 出现的时候调用获取 props
   */
  props?: T | (() => T)
  /**
   * 传递 Modal 的 Props
   */
  modalProps?: ModalProps
}

interface UniversalProps {
  overlayProps?: Partial<OverlayProps>
  /**
   * Only used by find stack
   */
  name?: string
  /**
   * 在移动端视图 使用底部 Drawer 样式
   * @default true
   */
  useBottomDrawerInMobile?: boolean
}

interface IModalStackStateType extends UniversalProps {
  component: FunctionComponentElement<any>
  id: string
  disposer: Disposer
}

export const ModalStackProvider: FC<{
  children?: ReactNode | ReactChildren
}> = observer((props) => {
  const { children } = props
  const [modalStack, setModalStack] = useState<IModalStackStateType[]>([])
  const [extraModalPropsMap, setExtraModalPropsMap] = useState<
    Map<
      string,
      {
        overlayShow: boolean
      }
    >
  >(new Map())

  const modalRefMap = useRef(
    new WeakMap<FunctionComponentElement<any>, ModalRefObject>(),
  )

  const dismissFnMapRef = useRef(
    new WeakMap<FunctionComponentElement<any>, () => any>(),
  )

  const present = useCallback((comp: IModalStackComponent): Disposer => {
    const {
      component,
      props,
      modalProps,
      useBottomDrawerInMobile = true,
      ...rest
    } = comp

    const id = uniqueId('modal-stack-')

    let modalChildren: ReactChildren | ReactNode[] | ReactNode
    if (React.isValidElement(component)) {
      modalChildren = component
      // JSX
    } else if (typeof component === 'function') {
      // React.FC
      modalChildren = createElement(
        component as any,
        typeof props === 'function' ? props() : props,
      )
    } else {
      console.error(
        'ModalStackProvider: component must be ReactElement or React.FC',
      )
      return () => null
    }

    const $modalElement: FunctionComponentElement<any> = createElement(
      Modal,
      {
        ...modalProps,
        modalId: id,
        useBottomDrawerInMobile,
        key: id,
        ref: (ins) => {
          modalRefMap.current.set($modalElement, ins!)
        },
        disposer: () => {
          dismissFnMapRef.current.delete($modalElement)
          setModalStack((prev) => prev.filter((item) => item.id !== id))
        },
      },
      modalChildren,
    )

    const disposer = (immediately = false) => {
      const immediatelyDisposer = () => {
        setModalStack((stack) => {
          return stack.filter((item) => item.id !== id)
        })
      }
      if (immediately) {
        immediatelyDisposer()
      } else {
        const fn = dismissFnMapRef.current.get($modalElement)
        if (!fn) {
          immediatelyDisposer()
          return
        }
        fn()
      }
    }

    setModalStack((stack) => {
      return [
        ...stack,
        {
          component: $modalElement,
          id,
          disposer,
          ...rest,
        },
      ]
    })

    setExtraModalPropsMap((map) => {
      map.set(id, {
        overlayShow: true,
      })
      return new Map(map)
    })
    return disposer
  }, [])

  const findCurrentByName = useCallback(
    (name: string) => {
      return modalStack.find((item) => item.name === name || item.id === name)
    },
    [modalStack],
  )

  const getStack = useCallback(() => {
    return modalStack.concat()
  }, [modalStack])

  const disposeAll = useCallback(
    async (immediately = false) => {
      const reversedStack = modalStack.concat().reverse()
      if (immediately) {
        reversedStack.forEach((current) => current.disposer())
      } else {
        for (const current of reversedStack) {
          const instance = modalRefMap.current.get(current.component)

          if (!instance) {
            current.disposer()
            continue
          }
          await instance.dismiss()
          current.disposer()
        }
      }
    },
    [modalStack],
  )

  const isClient = useIsClient()

  // TODO  抽离 不再依赖
  const {
    appUIStore: {
      viewport: { mobile },
    },
  } = useStore()

  return (
    <ModalStackContext.Provider
      value={useMemo(
        () => ({ present, findCurrentByName, getStack, disposeAll }),
        [disposeAll, findCurrentByName, getStack, present],
      )}
    >
      {children}

      {isClient &&
        modalStack.map((comp, index) => {
          const {
            component: Component,
            id,
            disposer,
            overlayProps,
            useBottomDrawerInMobile = true,
          } = comp
          const extraProps = extraModalPropsMap.get(id)!

          const onClose = () => {
            const instance = modalRefMap.current.get(Component)

            if (!instance) {
              disposer(true)
            } else {
              const dismissTask = instance.dismiss()

              setExtraModalPropsMap((map) => {
                map.set(id, {
                  ...extraProps,
                  overlayShow: false,
                })
                return new Map(map)
              })

              dismissTask.then(() => {
                disposer(true)
                extraModalPropsMap.delete(id)
              })
            }
          }

          dismissFnMapRef.current.set(Component, onClose)
          return (
            <Overlay
              center={!mobile && useBottomDrawerInMobile}
              standaloneWrapperClassName={clsx(
                mobile && useBottomDrawerInMobile && 'items-end justify-center',
              )}
              show={extraProps.overlayShow}
              onClose={() => disposer()}
              zIndex={60 + index}
              key={id}
              {...overlayProps}
            >
              {Component}
            </Overlay>
          )
        })}
    </ModalStackContext.Provider>
  )
})
```

Copy

而目前在 Shiro 中，我使用 Radix + framer motion 实现了一个较为可用的 `ModalStack`，可以进行参考。

[https://github.com/Innei/Shiro/blob/main/src/providers/root/modal-stack-provider.tsx](https://github.com/Innei/Shiro/blob/main/src/providers/root/modal-stack-provider.tsx)

TYPESCRIPT

```
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  createElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import { AnimatePresence, m, useAnimationControls } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import type { Target, Transition } from 'framer-motion'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

import { CloseIcon } from '~/components/icons/close'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { Divider } from '~/components/ui/divider'
import { microReboundPreset } from '~/constants/spring'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsClient } from '~/hooks/common/use-is-client'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

const modalIdToPropsMap = {} as Record<string, ModalProps>

export type ModalContentComponent<T> = FC<ModalContentPropsInternal & T>
type ModalContentPropsInternal = {
  dismiss: () => void
}

interface ModalProps {
  title: string
  content: FC<ModalContentPropsInternal>
  CustomModalComponent?: FC<PropsWithChildren>
  clickOutsideToDismiss?: boolean
  modalClassName?: string
  modalContainerClassName?: string
}

const modalStackAtom = atom([] as (ModalProps & { id: string })[])

const useDismissAllWhenRouterChange = () => {
  const pathname = usePathname()
  useEffect(() => {
    actions.dismissAll()
  }, [pathname])
}

export const useModalStack = () => {
  const id = useId()
  const currentCount = useRef(0)
  return {
    present(props: ModalProps & { id?: string }) {
      const modalId = `${id}-${currentCount.current++}`
      jotaiStore.set(modalStackAtom, (p) => {
        const modalProps = {
          ...props,
          id: props.id ?? modalId,
        }
        modalIdToPropsMap[modalProps.id] = modalProps
        return p.concat(modalProps)
      })

      return () => {
        jotaiStore.set(modalStackAtom, (p) => {
          return p.filter((item) => item.id !== modalId)
        })
      }
    },

    ...actions,
  }
}

const actions = {
  dismiss(id: string) {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.filter((item) => item.id !== id)
    })
  },
  dismissTop() {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.slice(0, -1)
    })
  },
  dismissAll() {
    jotaiStore.set(modalStackAtom, [])
  },
}
export const ModalStackProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <ModalStack />
    </>
  )
}

const ModalStack = () => {
  const stack = useAtomValue(modalStackAtom)

  const isClient = useIsClient()
  useDismissAllWhenRouterChange()
  if (!isClient) return null

  return (
    <AnimatePresence>
      {stack.map((item, index) => {
        return <Modal key={item.id} item={item} index={index} />
      })}
    </AnimatePresence>
  )
}

const enterStyle: Target = {
  scale: 1,
  opacity: 1,
}

const initialStyle: Target = {
  scale: 0.96,
  opacity: 0,
}

const modalTransition: Transition = {
  ...microReboundPreset,
}

const Modal: Component<{
  item: ModalProps & { id: string }
  index: number
}> = memo(function Modal({ item, index }) {
  const setStack = useSetAtom(modalStackAtom)
  const close = useEventCallback(() => {
    setStack((p) => {
      return p.filter((modal) => modal.id !== item.id)
    })
  })

  const onClose = useCallback(
    (open: boolean): void => {
      if (!open) {
        close()
      }
    },
    [close],
  )
  const animateController = useAnimationControls()
  useEffect(() => {
    animateController.start(enterStyle)
  }, [])
  const {
    CustomModalComponent,
    modalClassName,
    content,
    title,
    clickOutsideToDismiss,
    modalContainerClassName,
  } = item
  const modalStyle = useMemo(() => ({ zIndex: 99 + index }), [index])
  const dismiss = useCallback(
    (e: SyntheticEvent) => {
      stopPropagation(e)
      close()
    },
    [close],
  )
  const noticeModal = useCallback(() => {
    animateController
      .start({
        scale: 1.05,
        transition: {
          duration: 0.06,
        },
      })
      .then(() => {
        animateController.start({
          scale: 1,
        })
      })
  }, [animateController])

  const ModalProps: ModalContentPropsInternal = {
    dismiss: close,
  }

  if (CustomModalComponent) {
    return (
      <Dialog.Root open onOpenChange={onClose}>
        <Dialog.Portal>
          <DialogOverlay zIndex={20} />
          <Dialog.Content asChild>
            <div
              className={clsxm(
                'fixed inset-0 z-[20] overflow-auto',
                modalContainerClassName,
              )}
              onClick={clickOutsideToDismiss ? dismiss : undefined}
            >
              <div class onClick={stopPropagation}>
                <CustomModalComponent>
                  {createElement(content, ModalProps)}
                </CustomModalComponent>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <DialogOverlay zIndex={20} />
        <Dialog.Content asChild>
          <div
            className={clsxm(
              'fixed inset-0 z-[20] flex center',
              modalContainerClassName,
            )}
            onClick={clickOutsideToDismiss ? dismiss : noticeModal}
          >
            <m.div
              style={modalStyle}
              exit={initialStyle}
              initial={initialStyle}
              animate={animateController}
              transition={modalTransition}
              className={clsxm(
                'relative flex flex-col overflow-hidden rounded-lg',
                'bg-slate-50/80 dark:bg-neutral-900/80',
                'p-2 shadow-2xl shadow-stone-300 backdrop-blur-sm dark:shadow-stone-800',
                'max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[calc(100vh-20rem)] lg:max-w-[70vw]',
                'border border-slate-200 dark:border-neutral-800',
                modalClassName,
              )}
              onClick={stopPropagation}
            >
              <Dialog.Title class>
                {title}
              </Dialog.Title>
              <Divider class />

              <div class>
                {createElement(content, ModalProps)}
              </div>

              <Dialog.DialogClose
                onClick={close}
                className="absolute right-0 top-0 z-[9] p-5"
              >
                <CloseIcon />
              </Dialog.DialogClose>
            </m.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})
```

Copy

总结
--

优点

*   状态解耦：命令式 Modal 允许我们将 Modal 的状态管理从组件内部解耦出来，这样不仅简化了组件本身的逻辑，也使得状态管理更为灵活和清晰。
*   删起来快：由于 Modal 的逻辑不再与特定组件紧密绑定，当需要移除或更改 Modal 时，我们可以更快速地进行修改，无需深入繁杂的组件树结构。
*   写起来方便：命令式的写法相对简洁直观，尤其在需要快速实现功能时，能够大幅减少编码工作量。这对于快速迭代的项目来说是一个显著的优势。
*   复用方便：命令式 Modal 由于其解耦的特性，使得在不同的组件或场景中复用变得更加容易，提高了开发效率和代码的可维护性。

缺点

*   数据响应式更新的限制：命令式 Modal 的一个主要缺点是无法直接通过 props 实现数据的响应式更新。这意味着当 Modal 需要响应外部数据变化时，可能需要依赖外部状态管理库（如 Redux、MobX 等）来实现。这增加了一定的复杂性，并可能导致状态管理分散于不同的系统或框架中。

复制 w 引用评论

文章标题：为什么我更推荐命令式 Modal

文章作者：Innei

文章链接：https://innei.in/posts/programming/why-i-prefer-imperative-modal [复制]

最后修改时间: 暂没有修改过

* * *

商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，您可以自由地在任何媒体以任何形式复制和分发作品，也可以修改和创作，但是分发衍生作品时必须采用相同的许可协议。  
本文采用[知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)进行许可。

站点已开启邮件订阅，点亮小铃铛，订阅最新文章哦~