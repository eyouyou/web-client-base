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


export function useVisibilityChanged(ref: any, onVisibilityChanged: (value: boolean) => void) {
    React.useImperativeHandle(ref, () => ({
        onVisibilityChange: onVisibilityChanged
    }))

    React.useEffect(() => {
        onVisibilityChanged(true)
    }, [])
}