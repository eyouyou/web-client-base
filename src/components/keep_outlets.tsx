import React from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { Freeze } from 'react-freeze'
import { RouteItem } from '~/models/route'

interface IKeepContext {
    drop: (path: string) => void,
    addPageRef: (item: RouteItem, ref: any) => void
    addOutletRef: (path: string, ref: any) => void
}

interface KeepProps {
    exclude?: string[]
    max?: number,
    name?: string
}

const keepContext = React.createContext<IKeepContext>({
    drop: () => undefined,
    addPageRef: (item: RouteItem, ref: any) => undefined,
    addOutletRef: (item: string, ref: any) => undefined
})

const { Provider: KeepProvider } = keepContext

function useForcedUpdate(): [() => void, number] {
    const [key, setKey] = React.useState(getNewKey())
    const forceUpdate = React.useCallback(() => setKey(getNewKey()), [])
    return [forceUpdate, key]
}

export function useKeepControl() {
    return React.useContext<IKeepContext>(keepContext)
}

function getNewKey(): number {
    return Date.now() / 1000
}

export function useKeepOutlets({ exclude = [], max = Infinity, name }: KeepProps = {}) {
    const { drop: dropParent, addOutletRef: addToParentOutlet } = useKeepControl()
    const [forcedUpdate] = useForcedUpdate()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const keepOutlets = React.useRef<any>({})
    const outletRenderKeys = React.useRef<any>({})
    /// 孩子的ref
    const pageRef = React.useRef<any>({})
    const currentElement = useOutlet()
    const path = React.useRef<any>()
    const currentRoute = React.useRef<RouteItem>()

    const location = useLocation()

    const drop = React.useCallback((path: string) => {
        delete keepOutlets.current[path]
        outletRenderKeys.current[path] = getNewKey()

        if (typeof dropParent === 'function') {
            dropParent(path)
        }

        forcedUpdate()
    }, [])

    /// 孩子outlets
    const childrenOutletRef = React.useRef<any>({})
    const currentRef = React.useRef<any>({ isVisible: false })

    const notifyVisibility = React.useCallback((isVisible: boolean, currentPath?: string, isOutletNotify?: boolean) => {
        const isOriginShow = currentRef.current.isVisible
        currentRef.current.isVisible = isVisible

        for (const k in pageRef.current) {
            // 是否显隐性变化
            // 是否path匹配
            // 如果通知 则选择当前选中页面进行处理
            if ((isOutletNotify && currentPath == null && k == path.current || k == currentPath) && isOriginShow != isVisible) {
                const value = (pageRef.current as any)[k]
                value?.current?.onVisibilityChanged?.(isVisible)
            }
        }

        // 对所有孩子进行通知处理 
        for (const k in childrenOutletRef.current) {
            if (currentPath == null || k == currentPath) {
                const value = (childrenOutletRef.current as any)[k]
                value.current?.notifyVisibility?.(isVisible, undefined, true)
            }
            // 通知隐藏属性的时候 子outlet需要设置当前path为空 模拟第一次进入的状态
            // 但是还需要增加一个标记 在多级路由切回来的时候进行强制的显示通知
            // if (isOutletNotify) {
            //   path.current = undefined
            //   setForceRenderWhenShow(getNewKey())
            // }
        }
    }, [])

    currentRef.current.notifyVisibility = notifyVisibility

    const addPageRef = React.useCallback((item: RouteItem, ref: any) => {
        pageRef.current[item.absolutePath] = ref
    }, [])

    const addOutletRef = React.useCallback((path: string, ref: any) => {
        childrenOutletRef.current[path] = ref
    }, [])

    const getCurrentRoute = React.useCallback(() => {
        return currentRoute.current
    }, [])

    const stack = [...(currentElement?.props?.children?.props.routeContext?.matches ?? [])]

    const matchedPath = stack.pop()?.pathname

    const basePath = stack.pop()?.pathname

    if (matchedPath) {
        keepOutlets.current[matchedPath] = currentElement
        outletRenderKeys.current[matchedPath] = outletRenderKeys.current[matchedPath] ?? getNewKey()
    }

    const renderConfigs = Object.entries(keepOutlets.current).slice(-1 * max) // 限制最大渲染数
    keepOutlets.current = {} // 先清空，目的是应用最大渲染数

    const original_show = path.current


    const vDoms = renderConfigs.map(([pathname, element]: any) => {
        const isMatch = currentElement === element || (!currentElement && path.current == pathname)

        keepOutlets.current[pathname] = element // 恢复幸存内容

        if (isMatch) {
            path.current = pathname
            currentRoute.current = currentElement?.props?.children?.props?.children?.props?.route
            // console.log(path.current)
        }

        const outletRenderKey = outletRenderKeys.current[pathname]

        return (
            <Freeze key={outletRenderKey} freeze={!isMatch} placeholder={<></>}>
                {element}
            </Freeze>
        )
    })

    const now_show = path.current

    const ctxValue = React.useMemo(
        () => ({
            drop,
            addPageRef,
            addOutletRef,
            getCurrentRoute
        }),
        [drop, addPageRef, addOutletRef, getCurrentRoute],
    )

    if (basePath) {
        addToParentOutlet?.(basePath, currentRef)
    }


    if (original_show != now_show) {
        notifyVisibility(false, original_show)
    }

    React.useEffect(() => {
        // if (currentRoute.current?.absolutePath.startsWith(location.pathname)) {
        //     setCurrentRoute(currentRoute.current)
        // }
    })

    React.useEffect(() => {
        if (original_show != now_show) {
            notifyVisibility(true, now_show)
        }
        // 当前不显示 但是需要显示
        else if (!currentRef.current.isVisible) {
            notifyVisibility(true, now_show)
        }
    }, [notifyVisibility, now_show, original_show])

    React.useEffect(() => {
        if (exclude.includes(matchedPath)) {
            return () => drop(matchedPath)
        }
        // return () => { console.log(`${matchedPath} 卸载`) }
    }, [exclude, matchedPath, drop])

    return (
        <KeepProvider value={ctxValue}>
            {vDoms}
        </KeepProvider>
    )
}

/**
 * 使用该控件 通过获得当前渲染对象 对对象进行锁定 保证状态存在
 * 该渲染对象为 使用方的 当前该层route孩子
 */
export default function KeepOutlets(props: KeepProps) {
    return <>{useKeepOutlets(props)}</>
}
