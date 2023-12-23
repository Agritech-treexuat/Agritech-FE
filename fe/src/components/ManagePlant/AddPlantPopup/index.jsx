import React, { useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select } from 'antd'
import './style.css'
const { Option } = Select
const AddPlantPopup = ({ open, onCreate, onCancel, allPlants }) => {
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
          name="_id"
          label="Tên"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select placeholder="Chọn tên">
            {allPlants.map((plant) => (
              <Option key={plant.id} value={plant._id}>
                {plant.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlantPopup
