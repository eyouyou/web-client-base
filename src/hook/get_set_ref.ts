import React from "react"

export function useRefProperty<T>(init?: T) {
    const tRef = React.useRef<T | null>(init ?? null)
    const get = React.useCallback(() => tRef.current ?? undefined, [])
    const set = React.useCallback((t: T | undefined) => {
        return tRef.current = t ?? null
    }, [])
    return { tRef, get, set }
}
