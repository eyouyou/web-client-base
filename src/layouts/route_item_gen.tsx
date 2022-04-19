import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import RouteToElement from "./route_element"
import { hasHome, RouteItem } from "~/models/route"
import path from "path-browserify"
/**不暴露根 */
interface RouteProperty {
    routes: RouteItem[]
}

/**解决 [`IndexRoute`] 不能拥有孩子的问题 */
const Redirect = (to: RouteItem) => {
    return (<Route key="$$$home$$$" index element={<RouteToElement route={to}><Navigate to={to.path} /></RouteToElement>} />)
}


const NestRouteFactory = (parent: RouteItem, items: RouteItem[]) => {
    return (<Route key={parent.name} path={parent.path} element={<RouteToElement route={parent} ></RouteToElement>} >
        {[...items.map((route, index) => {
            route.absolutePath = path.join(parent.absolutePath!, route.path)
            route.hasHome = function (): boolean {
                return hasHome(this)
            }
            return route.routes != null ? NestRouteFactory(route, route.routes)
                : <Route key={route.name} path={route.path} element={<RouteToElement route={route} />} />

        })]}
    </Route>)
}


const RouteFactory = ({ routes }: RouteProperty) => {
    const tree = NestRouteFactory({
        name: "root",
        path: "/",
        component: "layouts/blank",
        absolutePath: "/",
        hasHome: function (): boolean {
            return hasHome(this)
        },
        routes: routes
    }, routes)
    console.log(tree)
    return (<Routes>{tree}</Routes>)
}

export default RouteFactory

