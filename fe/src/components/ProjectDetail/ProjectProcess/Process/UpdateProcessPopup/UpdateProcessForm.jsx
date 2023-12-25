import React from 'react'
import { Button, Form, Input, Select, Space, InputNumber } from 'antd'
import FARM from '../../../../../services/farmService'
import { useParams } from 'react-router'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
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

const UpdateProcessForm = ({ handleCloseForm, process, setProcessData }) => {
  const params = useParams()
  const dateObj = new Date(process.time)

  const yearData = dateObj.getFullYear()
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const dateData = dateObj.getDate().toString().padStart(2, '0')

  const formattedDate = `${yearData}-${monthData}-${dateData}`
  const formRef = React.useRef(null)
  let initValue = {
    date: formattedDate,
    type: process.type,
    note: process.note
  }

  if (process.type === 'phân bón' || process.type === 'BVTV') {
    initValue = {
      date: formattedDate,
      type: process.type,
      agroChemicalItems: process.agroChemicalItems,
      note: process.note
    }
  }

  const onFinish = (values) => {
    if ('other name' in values) {
      values.name = values['other name']
    }
    let updatedValue = { ...values, time: values.date }
    if (updatedValue.type === 'other') {
      updatedValue.name = ''
      updatedValue.amount = ''
    }
    delete updatedValue.date
    const data = {
      tx: 'b',
      ...updatedValue
    }
    handleSubmitProcess(data, params.id, process._id)
  }

  const handleSubmitProcess = async (data, projectId, processId) => {
    try {
      const res = await FARM.editProcess(data, projectId, processId)
      setProcessData(res.data.updatedProcess)
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
        <Select placeholder="Chọn loại">
          <Option value="phân bón">Phân bón</Option>
          <Option value="BVTV">BVTV</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      {/* item whe check type */}
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
        {({ getFieldValue }) =>
          getFieldValue('type') === 'phân bón' || getFieldValue('type') === 'BVTV' ? (
            <div>
              {/* name */}
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
                          <InputNumber addonAfter={getFieldValue('type') === 'phân bón' ? 'kg/ha' : 'lit/ha'} />
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
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateProcessForm
