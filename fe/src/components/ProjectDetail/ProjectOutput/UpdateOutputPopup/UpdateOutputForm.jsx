import React from 'react'
import { Button, Form, Input, InputNumber, Upload, Space, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadOutlined } from '@ant-design/icons'
import FARM from '../../../../services/farmService'
import { useParams } from 'react-router'
import './style.css'
import PROJECT from '../../../../services/projectService'
import token from '../../../../utils/token'
const { getAccessToken, getRefreshToken } = token

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
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const UpdateOutputForm = ({ handleCloseForm, output, refetch, alllDistributer, openNotificationWithIcon }) => {
  const params = useParams()
  const dateObj = new Date(output.time)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const formRef = React.useRef(null)
  console.log('output: ', output)
  const initValue = {
    date: formattedDate,
    amount: output.amount,
    'amount per one': output.amountPerOne,
    upload: output.images,
    npp: output.distributerWithAmount.map((item) => ({
      id: item.distributer._id,
      name: item.distributer.name,
      amount: item.amount
    }))
  }

  console.log('init: ', initValue)

  const onSearch = (value) => {
    console.log('search:', value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const onFinish = (values) => {
    console.log('values', values)
    const images = values.upload
      ? values.upload.map((upload) => (upload.response ? upload.response.metadata.thumb_url : upload))
      : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue.upload
    delete updatedValue['amount per one']
    console.log('updatedValue: ', updatedValue)
    const data = {
      tx: 'b',
      ...updatedValue,
      distributerWithAmount: updatedValue.npp.map((item) => ({
        distributer: item.id || item.name,
        amount: item.amount
      }))
    }

    console.log('data: ', data)

    const totalNppAmount = values.npp.reduce((total, item) => total + item.amount, 0)
    if (values.amount >= totalNppAmount) {
      handleSubmitOutput(data, params.id, output.id)
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
    }
  }

  const handleSubmitOutput = async (data, projectId, outputId) => {
    try {
      const res = await PROJECT.editOutput(data, projectId, outputId)
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

  const uploadProps = {
    action: 'http://127.0.0.1:3052/v1/api/upload/single',
    multiple: true,
    method: 'post',
    accept: 'image/*',
    name: 'file',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    fileList: output.images.map((image, index) => ({
      uid: String(index),
      name: `image-${index}.png`,
      status: 'done',
      url: image
    })),
    onChange(info) {
      if (info.file.status === 'done') {
        console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        console.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  console.log('uploadProps: ', uploadProps)

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
        <Upload {...uploadProps} listType="picture">
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
                  value={[name, 'id']}
                  rules={[
                    {
                      required: true,
                      message: 'Thiếu tên'
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={alllDistributer.map((distributer) => ({
                      value: distributer.id,
                      label: distributer.name
                    }))}
                  />
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
