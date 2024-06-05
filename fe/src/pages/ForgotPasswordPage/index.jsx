import React, { useState } from 'react'
import { Form, Input, Button, Spin, notification } from 'antd'
import { Link } from 'react-router-dom'
import FARM from '../../services/farmService'
import farmerImage from '../../assets/images/farmer.jpg'
import '../LoginPage/style.css'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      const response = await FARM.forgotPassword({ email: values.email })
      console.log('response:', response)
      if (response.status === 200) {
        openNotificationWithIcon('success', 'Thành công', 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.')
      } else {
        console.error('Error submitting forgot password form:', response.message)
        openNotificationWithIcon('error', 'Lỗi', response.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error submitting forgot password form:', error.message)
      openNotificationWithIcon('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="login-page">
        <Spin spinning={loading} size="large">
          <div className="login-box">
            <div className="illustration-wrapper">
              <img src={farmerImage} alt="Forgot Password" />
            </div>
            <div id="login-form">
              <Form name="forgot-password-form" onFinish={handleSubmit} autoComplete="off">
                <p className="form-title">Quên mật khẩu</p>
                <p>Nhập email của bạn để khôi phục mật khẩu</p>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Hãy nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Gửi
                  </Button>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/login">Quay về đăng nhập</Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Spin>
      </div>
    </>
  )
}

export default ForgotPasswordPage
