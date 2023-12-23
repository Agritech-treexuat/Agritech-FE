import React, { useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select } from 'antd'
import './style.css'
const { Option } = Select
const AddPlanPopup = ({ open, onCreate, onCancel, allSeedByPlant }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="Thêm cây mới"
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
          name="seed"
          label="Tên"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select placeholder="Chọn tên">
            {allSeedByPlant.map((seed) => (
              <Option key={seed.id} value={seed.name}>
                {seed.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
            <Option value="none">Empty</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlanPopup
