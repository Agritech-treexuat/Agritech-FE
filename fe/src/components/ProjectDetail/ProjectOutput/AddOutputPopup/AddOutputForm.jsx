import { Button, Form, Input, InputNumber, Select, Upload, Space } from 'antd'
import { useRef } from 'react'
import './style.css'
import { UploadOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import FARM from '../../../../services/farmService'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

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

const AddOutputForm = ({ handleCloseForm, setOutputData }) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0') // Cần thêm 1 vào tháng vì tháng bắt đầu từ 0
  const date = today.getDate().toString().padStart(2, '0')

  const currentDate = `${year}-${month}-${date}`
  const formRef = useRef(null)
  const params = useParams()

  const onFinish = (values) => {
    console.log('Values: ', values)
    const images = values.upload ? values.upload.map((upload) => upload.name) : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue['amount per one']
    delete updatedValue.upload
    const data = {
      tx: 'b',
      ...updatedValue,
      exportQR: false
    }
    const totalNppAmount = values.npp ? values.npp.reduce((total, item) => total + item.amount, 0) : 0

    if (values.amount >= totalNppAmount) {
      handleSubmitOutput(data, params.id)
      // handleSubmitOutput(data, params.id);
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
      // Hiển thị thông báo hoặc thực hiện các xử lý khác tại đây nếu cần.
    }
  }

  const handleSubmitOutput = async (data, projectId) => {
    try {
      console.log('data to send: ', data, projectId)
      const res = await FARM.addOutput(data, projectId)
      console.log('res: ', res)
      setOutputData(res.data.updatedProjectOutput)
      handleCloseForm()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  const uploadProps = {
    name: 'logo',
    action: 'http://35.247.150.142:8080/upload/error', // URL của API upload
    method: 'post',
    accept: 'image/*',
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
        <InputNumber addonAfter="kg"/>
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
        <InputNumber addonAfter="kg"/>
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
                  <Input placeholder="NPP Name" />
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
                  <InputNumber addonAfter="kg"/>
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
