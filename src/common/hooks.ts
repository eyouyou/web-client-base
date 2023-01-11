import React from "react"
import { RouteItem } from "~/models/route"
import { useNavigate } from "react-router-dom"

export function useDefaultRoute(route: RouteItem): [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] {
    const navigate = useNavigate()

    const [currentKey, setCurrentKey] = React.useState(route.hasHome() ? route.routes?.[0].absolutePath : undefined)

    React.useEffect(() => {
        if (route.hasHome() && currentKey != null) {
            navigate(currentKey)
        }
    }, [route])


    // React.useEffect(() => {
    //     if (currentKey != null) {
    //     }
    // }, [currentKey])

    return [currentKey, setCurrentKey]
}
export interface VisibilityRef {
    /**
     * 不应包含初始化逻辑
     */
    onVisibilityChanged: (value: boolean) => void
}

export interface RefreshRef {
    refresh: () => void
}

export function useVisibilityChanged(ref: React.Ref<VisibilityRef>, onVisibilityChanged: (value: boolean, initial?: boolean) => void, initial = false) {
    React.useImperativeHandle(ref, () => ({
        onVisibilityChanged: (v) => onVisibilityChanged(v, false)
    }))

    React.useEffect(() => {
        if (initial) {
            onVisibilityChanged(true, true)
        }
        return () => {
            onVisibilityChanged(false, false)
        }
    }, [])
}

export function useRefreshCallback(ref: React.Ref<RefreshRef>, refresh: () => void) {
    React.useImperativeHandle(ref, () => ({
        refresh: refresh
    }))
}
