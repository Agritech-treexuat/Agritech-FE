import React from 'react'
import { Form, Modal, Select } from 'antd'
import './style.css'
const { Option } = Select
const AddPlanProjectPopup = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="Chọn loại khởi tạo"
      okText="Chọn"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="template"
          label="Template"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select placeholder="Chọn template">
            <Option value="default">Gợi ý của hệ thống</Option>
            <Option value="farm">Từ quy trình chuẩn của bạn</Option>
            <Option value="none">Trống</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlanProjectPopup
