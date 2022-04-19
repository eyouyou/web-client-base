import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import Tab from '~/layouts/tab'
import { RouteProperty } from '~/models/route'

const Main = ({ route }: RouteProperty) => {
    const navigate = useNavigate()
    const to_hello = () => {
        navigate("/main/hello")
    }
    console.log("Main")
    return (
        <>
            <Tab route={route} />
            <Button onClick={to_hello}>查看欢迎页</Button>
        </>
    )
}

export default Main
