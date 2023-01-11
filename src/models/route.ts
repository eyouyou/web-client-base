import { Permission } from './permission'
/**
 * 路由核心
 */
export class RouteItem {
    absolutePath!: string

    /**
     *
     */
    constructor(
        readonly key: string,
        readonly path: string,
        readonly component: string,
        readonly properties: object,
        readonly routes?: RouteItem[],
        /** 可以不带 后面会对其进行拼接处理*/
        absolutePath?: string,
        /**自动刷新 */
        readonly autoRefresh?: boolean,
        readonly authority?: Permission,
        readonly redirect?: string,
        readonly title?: string,
        readonly subTitle?: string,
        /**
         * 是否孩子需要默认跳转到首页 不设置默认为true 
         * 默认有家
         */
        readonly notChildrenIndexed?: boolean,
        /** 给跳转的时候带入的默认search */
        readonly search?: string,
        readonly show?: boolean,
    ) {
        if (absolutePath) this.absolutePath = absolutePath
    }

    hasHome = () => {
        return this.notChildrenIndexed == null || this.notChildrenIndexed
    }

    /** 是否展示 */
    display = () => {
        return this.show ?? true
    }

    hideNavigation = (hiddenOnlyOneItem?: boolean) => {
        return (hiddenOnlyOneItem && this.routes?.filter(it => it.display()).length == 1) ?? false
    }

    copyWith = (children?: RouteItem[]) => {
        return new RouteItem(
            this.key,
            this.path,
            this.component,
            this.properties,
            children ?? this.routes,
            this.absolutePath,
            this.autoRefresh,
            this.authority,
            this.redirect,
            this.title,
            this.subTitle,
            this.notChildrenIndexed,
            this.search,
            this.show
        )
    }

    isAutoRefresh = () => {
        return this.autoRefresh ?? false
    }
}

export interface RouteProperty {
    route: RouteItem,
    ref?: any
}

export interface RouteAccess {
    getRoute: () => RouteItem
}
