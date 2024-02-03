import React from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
import './style.css'
import PROJECT from '../../../../services/projectService'
import { useParams } from 'react-router'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
}

const AddExpectForm = ({ handleCloseForm, refetch }) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const date = today.getDate().toString().padStart(2, '0')

  const currentDate = `${year}-${month}-${date}`
  const formRef = React.useRef(null)
  const params = useParams()

  const onFinish = (values) => {
    console.log('Values: ', values)

    const updatedValue = { ...values, time: values.date }
    delete updatedValue.date
    console.log(updatedValue)
    const data = {
      tx: 'b',
      ...updatedValue
    }
    handleSubmitExpect(data, params.id)
  }

  const handleSubmitExpect = async (data, projectId) => {
    try {
      console.log('data to send: ', data, projectId)
      const res = await PROJECT.addExpect(data, projectId)
      console.log('res: ', res)
      refetch()
      handleCloseForm()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      initialValues={{
        date: currentDate,
        note: ''
      }}
      name="control-ref"
      onFinish={onFinish}
      style={{
        maxWidth: 600
      }}
    >
      {/* date */}
      <Form.Item
        name="date"
        label="Thời gian"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Input type="date" />
      </Form.Item>
      {/* amount */}
      <Form.Item
        name="amount"
        label="Lượng"
        rules={[
          {
            required: true
          }
        ]}
      >
        <InputNumber addonAfter="kg" />
      </Form.Item>
      {/* note */}
      <Form.Item name="note" label="Ghi chú">
        <Input />
      </Form.Item>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddExpectForm
