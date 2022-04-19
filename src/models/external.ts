/**编译外部配置 */
import { RouteItem } from './route'

export interface BlazerConfig {
    routes: RouteItem[]
    title?: string,
    icon: string,
}


export function getBlazerConfig() {
    return BLAZER as BlazerConfig
}