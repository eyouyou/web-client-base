/**编译外部配置 */
import { RouteItem } from './route'

export interface BuildConfig {
    routes: RouteItem[]
    title?: string,
    icon: string,
}


export function getBuildConfig() {
    return BUILD_DATA as BuildConfig
}
