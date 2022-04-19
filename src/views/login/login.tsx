import { BoldOutlined, CheckOutlined, DownSquareTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons"
import { AutoComplete, Button, Checkbox, Col, Form, Image, Input, Radio, Row, Select } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useContext, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UserContext } from "~/context/user_context"
import { User } from "~/models/user"
import styles from "./style.less"
const { Option } = Select
interface LoginProperties {
    title: string
    iconUrl: string,
}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginMain = ({ title, iconUrl }: LoginProperties) => {
    const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { addUser } = useContext(UserContext)

    const onFinish = async (values: any, onLogin: (u: User) => void) => {
        console.log('Success:', values)

        try {
            onLogin(new User("1"))
            const redirect = searchParams.get("redirect")
            navigate(redirect ?? "/")
        }
        catch (error) {
            console.error(error)
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                wrapperCol: { span: 14 },
            }
            : null
    return (
        <div className={styles.form}>
            <Row>
                <Col span={2}>
                    <Image height={28} preview={false} src={require(`/assets/${iconUrl}`)} />
                </Col>
                <Col span={22}>
                    <Title level={4}>{title}</Title>
                </Col>
            </Row>
            <Form {...formItemLayout}
                layout={formLayout}
                name="basic"
                initialValues={{ linkFast: true, remember: true, validate: "validateCode", loginType: "normal" }}
                onFinish={async (values: any) => { await onFinish(values, addUser) }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item wrapperCol={{ span: 24 }} name="loginType">
                    <Radio.Group optionType="button" buttonStyle="solid" size="middle" className={styles.grid}>
                        <Radio.Button value="normal">1</Radio.Button>
                        <Radio.Button value="margin">2</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <AutoComplete
                        options={[{ value: 'text 1' }, { value: 'text 2' }]}
                    >
                        <Input prefix={<UserOutlined />} suffix={<DownSquareTwoTone />} />
                    </AutoComplete>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <div className={styles.validateCode}>
                    <Form.Item name="validate" noStyle>
                        <Select >
                            <Option value="validateCode">验证码</Option>
                        </Select>
                    </Form.Item >
                    <Form.Item name="validateCode" noStyle>
                        <Input suffix={<BoldOutlined />} />
                    </Form.Item>
                </div>

                <Form.Item wrapperCol={{ span: 24 }} className={styles.loginButton}>
                    <Button type="primary" htmlType="submit" block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginMain