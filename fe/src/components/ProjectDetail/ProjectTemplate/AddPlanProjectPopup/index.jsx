import React, { useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select } from 'antd'
import './style.css'
const { Option } = Select
const AddPlanProjectPopup = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="Choose Template"
      okText="Create"
      cancelText="Cancel"
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
            <Option value="default">Default</Option>
            <Option value="farm">From Farm</Option>
            <Option value="none">Empty</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlanProjectPopup
