import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Spin, notification } from 'antd'
import FARM from '../../services/farmService'
import farmerImage from '../../assets/images/farmer.jpg'
import '../LoginPage/style.css'

const ResetPasswordPage = () => {
  const { resetText, text } = useParams()
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const onFinish = async (values) => {
    const { password, confirmPassword } = values
    if (password !== confirmPassword) {
      openNotificationWithIcon('error', 'Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.')
      return
    }

    try {
      setLoading(true)
      const res = await FARM.resetPassword({ resetToken: resetText, email: text, newPassword: password })
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Thành công', 'Đặt lại mật khẩu thành công!')
        navigate('/login')
      } else {
        openNotificationWithIcon('error', 'Lỗi', res.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error resetting password:', error.message)
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
              <img src={farmerImage} alt="Reset Password" />
            </div>
            <div id="login-form">
              <Form name="reset-password-form" onFinish={onFinish} autoComplete="off">
                <p className="form-title">Đặt lại mật khẩu</p>
                <p>Nhập mật khẩu mới của bạn</p>
                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}>
                  <Input.Password placeholder="Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject('Mật khẩu và xác nhận mật khẩu không khớp')
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu mới" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Spin>
      </div>
    </>
  )
}

export default ResetPasswordPage
