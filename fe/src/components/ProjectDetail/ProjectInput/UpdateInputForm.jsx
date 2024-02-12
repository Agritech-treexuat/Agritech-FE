import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import './style.css'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const UpdateInputForm = ({ input, form }) => {
  const dateObj = new Date(input.startDate)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const initValue = {
    date: formattedDate,
    square: input.square,
    description: input.description
  }

  //   const update = useMutation({
  //     mutationFn: () => updateUserInfo({ ...data, userId: userData.id }),
  //     })

  // const onSubmit = () => {
  //     console.log(data);
  //     update.mutate(
  //         { ...data, userId: userData.id },
  //         {
  //             onSuccess: () => {
  //                 queryClient.invalidateQueries({
  //                     queryKey: ['getUser'],
  //                 });
  //             }
  //         }
  //     );
  // };

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
      {/* date */}
      <Form.Item
        name="date"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Input type="date" />
      </Form.Item>
      {/* seed */}
      {/* amount */}
      <Form.Item
        name="square"
        label="Diện tích trồng"
        rules={[
          {
            required: true
          }
        ]}
      >
        <InputNumber addonAfter="m2" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 3 }} />
      </Form.Item>
    </Form>
  )
}

export default UpdateInputForm
