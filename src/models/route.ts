import { Permission } from './permission'

export interface RouteItem {

    name: string,
    path: string,
    component: string,
    authority?: Permission,
    routes?: RouteItem[],
    redirect?: string,
    title?: string,
    /**
     * 是否孩子需要默认跳转到首页 不设置默认为true 
     * 默认有家
     */
    notChildrenIndexed?: boolean,
    /**
     * 后面会对其进行拼接处理
     */
    absolutePath: string,
    hasHome: () => boolean,
}


export function hasHome(item: RouteItem): boolean {
    return item.notChildrenIndexed == null || item.notChildrenIndexed
}

export interface RouteProperty {
    route: RouteItem,
    ref?: any
}