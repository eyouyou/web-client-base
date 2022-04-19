import React from "react"
import { Outlet } from "react-router-dom"
import { RouteProperty } from "~/models/route"
import { useDefaultRoute } from "../common/hooks"

const Blank = ({ route }: RouteProperty) => {
    useDefaultRoute(route)
    console.log("Blank")
    return (
        <Outlet />
    )
}

export default Blank