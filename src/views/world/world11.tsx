import React from 'react'
import { useVisibilityChanged } from '~/common/hooks'
import { RouteProperty } from '~/models/route'

const World11 = ({ route }: RouteProperty, ref: any) => {
    useVisibilityChanged(ref, (value: boolean) => {
        console.log(`显隐性 ${value}`)
    })
    return (
        <h2>World11</h2>
    )
}

export default React.forwardRef(World11)
