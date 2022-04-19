import React from "react"
import styles from "./style.less"

interface SettingsProperties {
    isFastSpeedChecked: boolean
}

const LoginSettings = ({ isFastSpeedChecked }: SettingsProperties) => {
    return (<h2>Settings</h2>)
}

export default LoginSettings