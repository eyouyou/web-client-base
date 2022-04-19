import React from 'react'
import { useOutlet } from 'react-router-dom'
import { Freeze } from 'react-freeze'
import { RouteItem } from '~/models/route'
import pathHelper from "path-browserify"

interface IKeepContext {
    drop: (path: string) => void,
    addPageRef: (item: RouteItem, ref: any) => void
    addOutletRef: (path: string, ref: any) => void
}

interface KeepProps {
    exclude?: string[]
    max?: number
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

export function useKeepOutlets({ exclude = [], max = Infinity }: KeepProps = {}) {
    const { drop: dropParent, addOutletRef: addToParentOutlet } = useKeepControl()
    const [forcedUpdate] = useForcedUpdate()
    const keepOutlets = React.useRef<any>({})
    const outletRenderKeys = React.useRef<any>({})
    /// 孩子的ref
    const pageRef = React.useRef<any>({})
    const currentElement = useOutlet()
    const path = React.useRef<any>()

    const drop = React.useCallback((path) => {
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

    const notifyVisibility = React.useCallback((isVisible: boolean, path?: string) => {
        const isOriginShow = currentRef.current.isVisible
        currentRef.current.isVisible = isVisible

        for (const k in pageRef.current) {
            // 是否显隐性变化
            // 是否path匹配
            // 如果隐藏直接通知
            if ((!isVisible && path == null || k == path) && isOriginShow != isVisible) {
                const value = (pageRef.current as any)[k]
                value?.current.onVisibilityChange?.(isVisible)
            }
        }

        if (!isVisible) {
            for (const k in childrenOutletRef.current) {
                if (path == null || k == path) {
                    const value = (childrenOutletRef.current as any)[k]
                    value.current.notifyVisibility?.(isVisible)
                }
            }
        }
    }, [])

    currentRef.current.notifyVisibility = notifyVisibility

    const addPageRef = React.useCallback((item: RouteItem, ref: any) => {
        pageRef.current[item.absolutePath] = ref
    }, [])

    const addOutletRef = React.useCallback((path: string, ref: any) => {
        childrenOutletRef.current[path] = ref
    }, [])

    const stack = [...(currentElement?.props?.children?.props.value?.matches ?? [])]

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
            console.log(path.current)
        }

        const outletRenderKey = outletRenderKeys.current[pathname]

        return (
            <Freeze key={outletRenderKey} freeze={!isMatch}>
                {element}
            </Freeze>
        )
    })

    const now_show = path.current

    const ctxValue = React.useMemo(
        () => ({
            drop,
            addPageRef,
            addOutletRef
        }),
        [],
    )

    if (basePath) {
        addToParentOutlet?.(basePath, currentRef)
    }

    if (original_show != now_show) {
        notifyVisibility(false, original_show)
        notifyVisibility(true, now_show)
    }
    // 当前不显示 但是需要显示
    else if (!currentRef.current.isVisible) {
        notifyVisibility(true, now_show)
    }

    React.useEffect(() => {
        if (exclude.includes(matchedPath)) {
            return () => drop(matchedPath)
        }
        return () => { console.log(`${matchedPath} 卸载`) }
    }, [matchedPath])

    return (
        <KeepProvider value={ctxValue}>
            {vDoms}
        </KeepProvider>
    )
}

export default function KeepOutlets(props: KeepProps) {
    return <>{useKeepOutlets(props)}</>
}