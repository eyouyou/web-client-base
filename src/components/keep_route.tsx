import React from "react"
import { RefreshRef, useVisibilityChanged, VisibilityRef } from "~/common/hooks"
import { RouteAccess, RouteProperty } from "~/models/route"
import { RefreshContextProvider, RouteRefreshContext, ScopeRefreshContext } from "./refreshable_context"
import VisibilityProvider from "./visibility_component"

/** 
 * 两级刷新机制 [`RefreshableRoute`]为第一级 [`RefreshableComponent`]为第二级 
 * 好处： 
 *    1.[`RefreshableComponent`]必须要有 但是都写在[`RefreshableComponent`]扩展性会有影响 
 *    2.目前[`RefreshableRoute`]定制化程度太高 使用[`KeepOutlets`]中的显隐性通知机制 随时可能进行方案替换 不够通用
 *    3.[`RefreshableComponent`]相对通用 可以做局部的刷新 也可以多层 而按照目前的定制化逻辑只通知表层 [`RefreshableComponent`]
 * 
 * 缺点：
 *    1.[`KeepOutlets`]下的路由 先要包[`RefreshableRoute`] 然后内部的需要刷新的孩子需要包一层[`RefreshableComponent`]
 *      并提供 ref 操作较为繁琐
 * Router 相关需要通过[`useVisibilityChanged`] 进行关联 显示的时候触发增加全局可刷新
 * 
 * 中转显隐性控制
 * 
 * 这里不处理组件的转发 不然定制性不高
 * 挂在[`KeepOutlets`]下一层
 */
const KeepRouteConnect = function <P extends RouteProperty>(WrappedComponent: React.ComponentType<P>) {
    const HOC = React.forwardRef((props: P, ref: React.Ref<VisibilityRef>) => {
        const visibilityRef = React.useRef<VisibilityRef>(null)
        const routeComponentRef = React.useRef<RouteAccess>(null)
        const refreshRef = React.useRef<RefreshRef>(null)
        const { register, unRegister } = React.useContext(RouteRefreshContext)
        const { register: registerScope, unRegister: unRegisterScope } = React.useContext(ScopeRefreshContext)
        useVisibilityChanged(ref, (visibility, initial) => {
            // 增加或去除
            if (visibility) {
                register(refreshRef)
                registerScope(refreshRef)
                if (!initial && routeComponentRef.current?.getRoute().isAutoRefresh()) {
                    refreshRef.current?.refresh()
                }
            } else {
                unRegister(refreshRef)
                unRegisterScope(refreshRef)
            }

            visibilityRef.current?.onVisibilityChanged(visibility)
        }, true)

        return (
            <RefreshContextProvider ref={refreshRef}>
                <VisibilityProvider ref={visibilityRef}>
                    <WrappedComponent {...props} ref={routeComponentRef}></WrappedComponent >
                </VisibilityProvider>
            </RefreshContextProvider>
        )
    })

    return HOC
}

export default KeepRouteConnect
