import React from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
import PROJECT from '../../../services/projectService'
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

const UpdateInputForm = ({ handleCloseForm, input, refetch }) => {
  const params = useParams()
  const dateObj = new Date(input.startDate)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const formRef = React.useRef(null)
  const initValue = {
    date: formattedDate,
    square: input.square
  }

  const onFinish = (values) => {
    const data = {
      startDate: values.date,
      square: values.square
    }
    handleSubmitInput(data, params.id)
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

  const handleSubmitInput = async (data, projectId) => {
    try {
      await PROJECT.editProjectInfo(data, projectId)
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
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateInputForm
