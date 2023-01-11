import React from "react"
import { VisibilityRef } from "~/common/hooks"
import { ProviderProperty } from "~/common/property"

export interface IVisibilityContext {
    register: (component: React.Ref<VisibilityRef>) => void,
    unRegister: (component: React.Ref<VisibilityRef>) => void,
    onVisibilityChanged: (value: boolean) => void
}

export const VisibilityContext = React.createContext<IVisibilityContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    register: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unRegister: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    onVisibilityChanged: (value: boolean) => { }
})


const VisibilityProvider = React.forwardRef(({ children }: ProviderProperty, ref: React.Ref<VisibilityRef>) => {
    const visibilityComponents = React.useRef<React.Ref<VisibilityRef>[]>([])

    const register = React.useCallback((component: React.Ref<VisibilityRef>) => {
        if (component) {
            visibilityComponents.current.push(component)
        }
    }, [])

    const unRegister = React.useCallback((component: React.Ref<VisibilityRef>) => {
        if (component) {
            const index = visibilityComponents.current.indexOf(component)
            if (index > -1) {
                visibilityComponents.current.splice(index, 1)
            }
        }
    }, [])

    const onVisibilityChanged = React.useCallback((value: boolean) => {
        const components = [...visibilityComponents.current]
        for (const component of components) {
            if (typeof component === 'function') {
                component?.({ onVisibilityChanged })
            } else {
                component?.current?.onVisibilityChanged(value)
            }
        }
    }, [])

    React.useImperativeHandle(ref, () => ({
        onVisibilityChanged: onVisibilityChanged
    }))

    return (
        <VisibilityContext.Provider value={{ register, unRegister, onVisibilityChanged }}>
            {children}
        </VisibilityContext.Provider>
    )
})
export default VisibilityProvider
