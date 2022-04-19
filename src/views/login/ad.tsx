import React from "react"
import styles from "./style.less"

interface AdProperties {
    picUrl: string
}

const Ad = ({ picUrl }: AdProperties) => {
    return (<div className={styles.ad} ></div>)
}

export default Ad