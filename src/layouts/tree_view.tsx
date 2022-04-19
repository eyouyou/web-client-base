import { Col, Layout, Row } from "antd"
import React from "react"
import { Outlet } from "react-router-dom"
import KeepOutlets from "~/components/keep_outlets"
import { RouteProperty } from "~/models/route"
import MenuNavigator from "./menu"

const { Content, Sider } = Layout

const TreeView = ({ route }: RouteProperty) => {
    return (
        <Layout>
            <Sider>
                <MenuNavigator route={route} mode="inline" />
            </Sider>
            <Content>
                <KeepOutlets />
            </Content>
        </Layout>

    )
}

export default TreeView