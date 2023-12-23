import React from 'react'
import { Button, Form, Input, Select, Space, InputNumber } from 'antd'
import FARM from '../../../../../services/farmService'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import './style.css'
const { Option } = Select

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

const testForm = null

const fertilizers = ['NHK', 'Kali', 'Other name']
const bvtvs = ['BVTV1', 'BVTV2', 'Other name']

const AddProcessForm = ({ handleCloseForm, setProcessData, process }) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0') // Cần thêm 1 vào tháng vì tháng bắt đầu từ 0
  const date = today.getDate().toString().padStart(2, '0')

  const currentDate = `${year}-${month}-${date}`
  console.log('Today: ', currentDate)
  const params = useParams()
  const formRef = React.useRef(null)
  let initValue = {
    date: currentDate
  }

  if (process) {
    initValue = {
      date: currentDate,
      type: process.type,
      agroChemicalItems: process.agroChemicalItems,
      note: process.time + '-' + process.note
    }
    console.log('init: ', initValue)
  }

  const onFinish = (values) => {
    console.log('Values: ', values)
    if ('other name' in values) {
      values.name = values['other name']
    }
    const updatedValue = { ...values, time: values.date }
    delete updatedValue.date
    console.log(updatedValue)
    const data = {
      tx: 'b',
      ...updatedValue
    }
    console.log('test form: ', data)
    handleSubmitProcess(data, params.id)
  }

  const handleSubmitProcess = async (data, projectId) => {
    try {
      console.log('data to send: ', data, projectId)
      const res = await FARM.addProcess(data, projectId)
      console.log('res: ', res)
      setProcessData(res.data.updatedProjectProcess)
      handleCloseForm()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <Form
      {...layout}
      form={testForm}
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
      {/* type */}
      <Form.Item
        name="type"
        label="Loại canh tác"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Select placeholder="Chọn loại ">
          <Option value="phân bón">Phân Bón</Option>
          <Option value="BVTV">BVTV</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      {/* item whe check type */}
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
        {({ getFieldValue }) =>
          getFieldValue('type') === 'phân bón' || getFieldValue('type') === 'BVTV' ? (
            <div>
              <Form.List name="agroChemicalItems">
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
                          <Select placeholder="Select a name">
                            {getFieldValue('type') === 'phân bón'
                              ? fertilizers.map((fertilizer) => (
                                  <Option key={fertilizer} value={fertilizer}>
                                    {fertilizer}
                                  </Option>
                                ))
                              : bvtvs.map((bv) => (
                                  <Option key={bv} value={bv}>
                                    {bv}
                                  </Option>
                                ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'amountPerHa']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing amount per ha'
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
                        Thêm cụ thể
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              {/* note */}
              <Form.Item name="note" label="Ghi chú">
                <Input />
              </Form.Item>
            </div>
          ) : (
            // note
            <Form.Item name="note" label="Ghi chú">
              <Input />
            </Form.Item>
          )
        }
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

export default AddProcessForm
