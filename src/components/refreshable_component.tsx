import React, { } from "react"
import { useRefreshCallback } from "~/common/hooks"
import { ConvergeRefreshContext, IRefreshContext, RefreshContext, ConvergeRefreshContextProvider, RefreshRef } from "./refreshable_context"


const RefreshableComponentGen = function (_RefreshContext: React.Context<IRefreshContext>) {
  return function <P>(WrappedComponent: React.ComponentType<P>) {
    const HOC = React.forwardRef((props: P, ref: React.Ref<RefreshRef>) => {
      const { register, unRegister } = React.useContext(_RefreshContext)
      const refreshRef = React.useRef(null)

      const r = ref ?? refreshRef
      React.useEffect(() => {
        register(r)
        return () => {
          unRegister(r)
        }
      }, [])

      return (
        <WrappedComponent {...props} ref={r}></WrappedComponent>
      )
    })
    return HOC
  }
}

/**
 * TODO: 增加到[`RefreshContext`] 需要组件自己[`useRefreshCallback`] 暴露接口
 * 直接向路由刷新层注册组件
 * 
 * 需要包在[`RefreshRef`]外
 * 
 * warning: 不支持利用显隐性控制组件 隐藏不调用释放的
 * 
 * 从上至下
 */
export const RefreshableConnect = function <P>(WrappedComponent: React.ComponentType<P>) {
  return RefreshableComponentGen(RefreshContext)(WrappedComponent)
}

export interface RefreshableComponentProps {
  children: React.ReactNode
}

/**
 * 关联[`ConvergeRefreshableConnect`]
 * 
 * 该组件不能与状态同层 不然会导致孩子重新刷新
 */
export const RefreshableComponent = RefreshableConnect(React.forwardRef(({ children }: RefreshableComponentProps, ref: React.Ref<RefreshRef>) => {
  const refreshRef = React.useRef<RefreshRef>(null)

  useRefreshCallback(ref, async () => {
    refreshRef.current?.refresh()
  })

  return (
    <ConvergeRefreshContextProvider ref={refreshRef} >
      {children}
    </ConvergeRefreshContextProvider>)
}))


/**
 * 向汇聚层注册组件 方便直接调用
 * 脱离全局刷新机制
 * 
 * 需要包在[`RefreshRef`]外
 * 
 * 从下至上
 */
export const ConvergeRefreshableConnect = function <P>(WrappedComponent: React.ComponentType<P>) {
  return RefreshableComponentGen(ConvergeRefreshContext)(WrappedComponent)
}
