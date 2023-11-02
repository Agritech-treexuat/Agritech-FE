import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import FARM from '../../services/farmService';
// import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";

const onFinish = (values) => {
  console.log('Success:', values);
  console.log(values.email, values.password)
  handle_login(values.email, values.password)
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const handle_login = async (email, password) => {
  try {
    const res = await FARM.login({
        email: email,
        password: password
    });
    console.log("res: ", res)
    const token = res?.data?.accessToken;
    if (token) {
        localStorage.setItem('token', token);
    }
    const id = res?.data?.id;
    if (id) {
        localStorage.setItem('id', id);
    }
    console.log('Login success');
    <Navigate to='/home' />
} catch (error) {
    console.error(error?.response?.data?.message);
}
}
const LoginPage = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please input your email!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);
export default LoginPage;
