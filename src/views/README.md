# front_web_views

_业务界面部分_

## 使用方式

### 开发

直接在路由中配置对应的页面路径

带有子路由的业务界面

```js

const World1 = ({ route }: RouteProperty) => {
    // 使用路由配置中的默认路由 默认第一个
    useDefaultRoute(route);

    return (
        <>
            <h2>World1</h2>
            <KeepOutlets />
        </>
    )
}

```

叶子路由的业务界面

```js

const World2 = () => {
    return (
        <h2>World2</h2>
    )
}

```

带有显隐性控制的叶子路由

```js

const World11 = ({ route }: RouteProperty, ref: any) => {
    useVisibilityChanged(ref, (value: boolean) => {
        console.log(`显隐性 ${value}`)
    });
    return (
        <h2>World11</h2>
    )
}

export default React.forwardRef(World11)

```
