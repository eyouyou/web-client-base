import React from 'react'
import TreeView from '~/layouts/tree_view'
import { RouteProperty } from '~/models/route'

const World = ({ route }: RouteProperty) => {
    return (
        <>
            <TreeView route={route} />
        </>
    )
}

export default World
