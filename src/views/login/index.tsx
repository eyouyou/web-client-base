import { Col, Row } from 'antd'
import React, { useEffect } from 'react'
import { authClient } from '~/glue'
import { LoginRequest } from '~/grpc/base_pb'
import { getBlazerConfig } from '~/models/external'
import { webLocalStorage } from '~/store'
import Ad from './ad'
import LoginMain from './login'

const Login = () => {
    const config = getBlazerConfig()

    useEffect(() => {
        // webLocalStorage.setItem('a', { value: 1 })
        // console.log(webLocalStorage.getItem('a'))

        // // login("1", "2").then((x) => {
        // //     console.log(x)
        // // }).catch(() => { })

        return () => { console.log("login") }
    })

    return (
        <Row >
            <Col span={12}><Ad picUrl={''} /></Col>
            <Col span={12}><LoginMain title={config.title ?? ""} iconUrl={config.icon} /></Col>
        </Row>

    )
}
export default Login