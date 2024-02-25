import React from 'react'
import { Form, Input, Button } from 'antd'

const ForgotPasswordPage = () => {
  const handleSubmit = (values) => {
    // Xử lý logic khi người dùng nhập email và ấn submit
    console.log(values)
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
      <Form name="forgot-password-form" initialValues={{ remember: true }} onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!'
            },
            {
              type: 'email',
              message: 'Please enter a valid email address!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ForgotPasswordPage
