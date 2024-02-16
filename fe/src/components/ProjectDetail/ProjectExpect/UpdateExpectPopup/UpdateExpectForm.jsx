import React from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
import PROJECT from '../../../../services/projectService'
import { useParams } from 'react-router'
import './style.css'

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

const UpdateExpectForm = ({ handleCloseForm, expect, refetch, openNotificationWithIcon }) => {
  const params = useParams()
  const dateObj = new Date(expect.time)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const formRef = React.useRef(null)
  const initValue = {
    date: formattedDate,
    amount: expect.amount,
    note: expect.note
  }

  const onFinish = (values) => {
    const data = {
      time: values.date,
      amount: values.amount,
      note: values.note
    }
    handleSubmitexpect({ data, projectId: params.id, expectId: expect.id })
  }

  const handleSubmitexpect = async ({ data, projectId, expectId }) => {
    try {
      const res = await PROJECT.editExpect(data, projectId, expectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
      handleCloseForm()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      initialValues={initValue}
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
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateExpectForm
