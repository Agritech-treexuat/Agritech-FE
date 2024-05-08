import React from 'react'
import { Form, Input, InputNumber, DatePicker } from 'antd'
import './style.css'
import dayjs from 'dayjs'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const UpdateInputForm = ({ input, form }) => {
  const initValue = {
    date: input.startDate ? dayjs(input.startDate) : null,
    square: input.square,
    description: input.description,
    expectedEndDate: input.expectedEndDate ? dayjs(input.expectedEndDate) : null,
    expectedOutput: input.expectedOutput
  }
  console.log('initValue', initValue)

  return (
    <Form
      {...layout}
      form={form}
      name="control-ref"
      initialValues={initValue}
      style={{
        maxWidth: 600
      }}
    >
      {/* Ngày bắt đầu */}
      <Form.Item
        name="date"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn ngày bắt đầu!'
          }
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      {/* Ngày dự kiến kết thúc */}
      <Form.Item
        name="expectedEndDate"
        label="Ngày dự kiến kết thúc"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn ngày dự kiến kết thúc!'
          }
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      {/* Sản lượng dự kiến */}
      <Form.Item
        name="expectedOutput"
        label="Sản lượng dự kiến"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập sản lượng dự kiến!'
          }
        ]}
      >
        <InputNumber addonAfter="kg" style={{ width: '100%' }} />
      </Form.Item>
      {/* Diện tích trồng */}
      <Form.Item
        name="square"
        label="Diện tích trồng"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập diện tích trồng!'
          }
        ]}
      >
        <InputNumber addonAfter="m2" style={{ width: '100%' }} />
      </Form.Item>
      {/* Mô tả */}
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập mô tả!'
          }
        ]}
      >
        <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
      </Form.Item>
    </Form>
  )
}

export default UpdateInputForm
