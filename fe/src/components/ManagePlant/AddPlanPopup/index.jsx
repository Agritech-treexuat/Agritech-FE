import React from 'react'
import { Form, Modal, Select } from 'antd'
import './style.css'
const { Option } = Select
const AddPlanPopup = ({ open, onCreate, onCancel, allSeedByPlant }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="Thêm quy trình mới"
      okText="Thêm"
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
              <Option key={seed.id} value={seed.id}>
                {seed.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="template"
          label="Quy trình"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select placeholder="Chọn quy trình">
            <Option value="default">Quy trình gợi ý</Option>
            <Option value="none">Trống</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlanPopup
