import React from 'react'
import { Button, Form, Input, InputNumber, Upload, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadOutlined } from '@ant-design/icons'
import FARM from '../../../../services/farmService'
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
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const UpdateOutputForm = ({ handleCloseForm, output, setOutputData }) => {
  const params = useParams()
  const dateObj = new Date(output.time)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const formRef = React.useRef(null)
  const initValue = {
    date: formattedDate,
    amount: output.amount,
    'amount per one': output.amountPerOne,
    upload: output.images,
    npp: output.npp
  }

  const onFinish = (values) => {
    const images = values.upload.map((item) => (typeof item === 'string' ? item : item.name))
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue.upload
    delete updatedValue['amount per one']
    const data = {
      tx: 'b',
      ...updatedValue
    }
    const totalNppAmount = values.npp.reduce((total, item) => total + item.amount, 0)
    if (values.amount >= totalNppAmount) {
      handleSubmitOutput(data, params.id, output._id)
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
    }
  }

  const handleSubmitOutput = async (data, projectId, outputId) => {
    try {
      const res = await FARM.editOutput(data, projectId, outputId)
      setOutputData(res.data.updatedOutput)
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
      {/* amount per one */}
      <Form.Item
        name="amount per one"
        label="Lượng/sản phẩm"
        rules={[
          {
            required: true
          }
        ]}
      >
        <InputNumber addonAfter="kg" />
      </Form.Item>

      <Form.Item name="upload" label="Ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>Đăng ảnh</Button>
        </Upload>
      </Form.Item>
      {/* list npp */}
      <Form.List name="npp">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8
                }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[
                    {
                      required: true,
                      message: 'Thiếu tên'
                    }
                  ]}
                >
                  <Input placeholder="NPP Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'amount']}
                  rules={[
                    {
                      required: true,
                      message: 'Thiếu lượng'
                    }
                  ]}
                >
                  <InputNumber addonAfter="kg" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm nhà phân phối
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateOutputForm
