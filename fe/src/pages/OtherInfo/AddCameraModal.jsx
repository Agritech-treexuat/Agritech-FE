import React from 'react'
import { Modal, Form, Input } from 'antd'

const AddCameraModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={visible}
      title="Thêm camera mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values)
            form.resetFields()
            onCancel()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên">
          <Input />
        </Form.Item>
        <Form.Item name="rtsp_link" label="RTSP Link">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCameraModal
