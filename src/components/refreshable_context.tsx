import React from "react"
import { ProviderProperty } from "~/common/property"

export interface RefreshRef {
    refresh: () => void
}

export interface IRefreshContext {
    register: (component: React.Ref<RefreshRef>) => void,
    unRegister: (component: React.Ref<RefreshRef>) => void,
    refresh: () => void
}

export const RefreshContext = React.createContext<IRefreshContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    register: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unRegister: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refresh: async () => { }
})

export const ConvergeRefreshContext = React.createContext<IRefreshContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    register: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unRegister: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refresh: async () => { }
})


const RefreshContextProviderGen = function (_RefreshContext: React.Context<IRefreshContext>) {
    return React.forwardRef(({ children }: ProviderProperty, ref: React.Ref<RefreshRef>) => {
        const refreshableComponents = React.useRef<React.Ref<RefreshRef>[]>([])

        const register = React.useCallback((component: React.Ref<RefreshRef>) => {
            if (component) {
                refreshableComponents.current.push(component)
            }
        }, [])

        const unRegister = React.useCallback((component: React.Ref<RefreshRef>) => {
            if (component) {
                const index = refreshableComponents.current.indexOf(component)
                if (index > -1) {
                    refreshableComponents.current.splice(index, 1)
                }
            }
        }, [])

        const refresh = React.useCallback(async () => {
            const components = [...refreshableComponents.current]
            for (const component of components) {
                try {
                    if (typeof component === 'function') {
                        component?.({ refresh })
                    } else {
                        component?.current?.refresh()
                    }
                }
                catch (ex) {
                    console.error("refresh error！")
                }
            }
        }, [])

        React.useImperativeHandle(ref, () => ({
            refresh
        }))

        return (
            <_RefreshContext.Provider value={{ register, unRegister, refresh }}>
                {children}
            </_RefreshContext.Provider>
        )
    })
}


/**
 * 通知孩子进行
 */
export const RefreshContextProvider = RefreshContextProviderGen(RefreshContext)

/**
 * 进行汇聚操作
 */
export const ConvergeRefreshContextProvider = RefreshContextProviderGen(ConvergeRefreshContext)

/**
 *  指向该页面所有已显示组件 通过该上下文刷新该引用
 */
export const RouteRefreshContext = React.createContext<IRefreshContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refresh: async () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function 
    register: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unRegister: () => { },
})

/**
 * 全局显示组件
 * 调用[`RefreshContextProvider`]的刷新
 */
export const RouteRefreshContextProvider = RefreshContextProviderGen(RouteRefreshContext)

/**
 * 易于在router部分划分特定区域 作用于当前刷新区域
 */
export const ScopeRefreshContext = React.createContext<IRefreshContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refresh: async () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function 
    register: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unRegister: () => { },
})

export const ScopeRefreshContextProvider = RefreshContextProviderGen(ScopeRefreshContext)
