import React, { useEffect, useState } from "react"
import { Menu, Tabs } from "antd"

import { RouteItem, RouteProperty } from "~/models/route"
import { useDefaultRoute } from "../common/hooks"
import { useNavigate } from "react-router-dom"
const { SubMenu } = Menu


interface MenuRouteProperty extends RouteProperty {
    depth?: number
    mode?: 'horizontal' | 'vertical' | 'inline'
}

/**
 * 目前该组件只处理一层路由信息
 * <Outlet />自己定义
 */
const MenuNavigator = ({ route, depth, mode }: MenuRouteProperty) => {
    const navigate = useNavigate()

    const [currentKey, setCurrentKey] = useDefaultRoute(route)

    const handleClick = (e: any) => {
        navigate(e.key)
        setCurrentKey(e.key)
    }

    const makeTree = (items: RouteItem[], depth?: number): any[] | undefined => {
        if (depth != null && depth == 0) {
            return undefined
        }
        return items.map((item) => {
            if (item.routes != null && item.routes.length > 0) {
                return (<SubMenu key={item.absolutePath} title={item.title} onTitleClick={handleClick}>
                    {makeTree(item.routes, depth && depth - 1)}
                </SubMenu>)
            }
            return (<Menu.Item key={item.absolutePath}>
                {item.title}
            </Menu.Item>)
        })
    }

    return (
        <>
            <Menu onClick={handleClick} {...currentKey && { selectedKeys: [currentKey] }} mode={mode ?? "horizontal"}>
                {
                    route.routes && makeTree(route.routes, depth)
                }
            </Menu>
        </>
    )
}

export default MenuNavigator