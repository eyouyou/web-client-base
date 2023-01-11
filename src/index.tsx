import React from 'react'
import { render } from 'react-dom'
import { HashRouter, } from 'react-router-dom'
import RouteFactory from './layouts/route_item_gen'
import { BuildConfig } from './models/external'

import 'antd/dist/antd.css'
import { UserContextProvider } from './context/user_context'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
    const config = BUILD_DATA as BuildConfig
    return (
        <React.StrictMode>
            <UserContextProvider>
                <HashRouter window={window}>
                    <RouteFactory routes={config.routes} />
                </HashRouter>
            </UserContextProvider>
        </React.StrictMode>
    )
}

render(<App />, mainElement)
