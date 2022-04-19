import { Col, Layout, Row } from "antd"
import React from "react"
import KeepOutlets from "~/components/keep_outlets"
import { RouteProperty } from "~/models/route"
import MenuNavigator from "./menu"
import styles from './tab.less'
const { Content, Header, Footer } = Layout
/**
 * 目前该组件只处理一层路由信息
 */
const Tab = ({ route }: RouteProperty) => {
    console.log("Tab render")

    React.useEffect(() => {
        console.log("init")
        return () => { console.log("tab 卸载") }
    }, [])

    return (
        <Layout>
            <Header className={styles.header}>
                <MenuNavigator route={route} depth={1} mode="horizontal" />
            </Header>
            <Content>
                <KeepOutlets max={1000} />
            </Content>
            <Footer>Footer</Footer>
        </Layout>
    )
}

export default Tab