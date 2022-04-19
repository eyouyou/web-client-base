import React from 'react'
import { RouteProperty } from '~/models/route'
import { useDefaultRoute } from "~/common/hooks"
import KeepOutlets from '~/components/keep_outlets'

const World1 = ({ route }: RouteProperty) => {
    useDefaultRoute(route)

    return (
        <>
            <h2>World1</h2>
            <KeepOutlets />
        </>
    )
}

export default World1
