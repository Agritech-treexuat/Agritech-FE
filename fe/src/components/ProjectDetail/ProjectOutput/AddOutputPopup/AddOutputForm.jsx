import { Button, Form, Input, InputNumber, Upload, Space, Select } from 'antd'
import { useRef } from 'react'
import './style.css'
import { UploadOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
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

const AddOutputForm = ({ handleCloseForm, refetch, alllDistributer, openNotificationWithIcon }) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const date = today.getDate().toString().padStart(2, '0')

  const currentDate = `${year}-${month}-${date}`
  const formRef = useRef(null)
  const params = useParams()

  const onSearch = (value) => {
    console.log('search:', value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const onFinish = (values) => {
    console.log('values', values)
    const images = values.upload ? values.upload.map((upload) => upload.response.metadata.thumb_url) : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue['amount per one']
    delete updatedValue.upload
    const data = {
      tx: 'b',
      ...updatedValue,
      exportQR: false,
      distributerWithAmount: updatedValue.npp.map((item) => ({
        distributer: item.name,
        amount: item.amount
      }))
    }
    const totalNppAmount = values.npp ? values.npp.reduce((total, item) => total + item.amount, 0) : 0

    if (values.amount >= totalNppAmount) {
      handleSubmitOutput(data, params.id)
      console.log('data', data)
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
    }
  }

  const handleSubmitOutput = async (data, projectId) => {
    try {
      const res = await PROJECT.addOutput(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thành công', 'Thêm đầu ra thành công')
      } else {
        openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
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
    onChange(info) {
      if (info.file.status === 'done') {
        console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        console.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      initialValues={{
        date: currentDate,
        amount: 1000,
        'amount per one': 10
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
      {/* List npp */}
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
                      message: 'Missing name'
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
                      message: 'Missing amount'
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
          Thêm
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddOutputForm
