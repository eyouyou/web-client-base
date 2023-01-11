import React from "react"
import { createHashRouter, RouteObject, RouterProvider } from "react-router-dom"
import RouteToElement from "./route_element"
import { RouteItem } from "~/models/route"
import path from "path-browserify"

const NestRouteFactory = (parent: RouteItem, items: RouteItem[]): RouteObject => {
    items.forEach(route => {
        route.absolutePath = path.join(parent.absolutePath, route.path)
    })
    return {
        path: parent.path, element: <RouteToElement route={parent} />,
        children: items.distinct((item) => item.key).map((route: RouteItem) => {
            return route.routes != null ? NestRouteFactory(route, route.routes)
                : { path: route.path, element: <RouteToElement route={route} /> }
        })
    }
}

interface RouteProps {
    routes: RouteItem[]
}

/**不暴露根 自带根*/
const RouteFactory = ({ routes: children }: RouteProps) => {
    const [router, setRouter] = React.useState<any>()
    React.useEffect(() => {
        const hash = [NestRouteFactory(new RouteItem(
            "root",
            "/",
            "layouts/root",
            {},
            children,
            "/"
        ), children)]

        const tree = createHashRouter(hash)
        setRouter(tree)
    }, [])

    return (
        router ? <RouterProvider router={router}></RouterProvider> : <></>
    )
}

export default RouteFactory

