import React from 'react'
import { Modal, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Space } from 'antd'
import './style.css'
const { Option } = Select
const UpdateTemplateProjectPopup = ({ open, onCreate, onCancel, template, fetilizer, BVTV, plantCultivateId }) => {
  const [form] = Form.useForm()
  const BVTV_name = BVTV.map((BVTV_item) => {
    return {
      value: BVTV_item.name,
      label: BVTV_item.name
    }
  })

  const fetilizer_name = fetilizer.map((fetilizer_item) => {
    return {
      value: fetilizer_item.name,
      label: fetilizer_item.name
    }
  })
  return (
    <Modal
      open={open}
      title="Cập nhật quy trình"
      okText="Cập nhật"
      cancelText="Thoát"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values, plantCultivateId)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      getContainer={false}
    >
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
          maxWidth: 600
        }}
        initialValues={{
          items: template
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column'
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Việc ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name)
                      }}
                    />
                  }
                >
                  <Form.Item label="Thời điểm" name={[field.name, 'time']}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Ghi chú" name={[field.name, 'note']}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Loại" name={[field.name, 'type']}>
                    <Select placeholder="Chọn loại">
                      <Option value="phân bón">Phân bón</Option>
                      <Option value="BVTV">BVTV</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Cụ thể">
                    <Form.List name={[field.name, 'agroChemicalItems']}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 16
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item noStyle name={[subField.name, 'name']}>
                                <Select
                                  placeholder="Chọn tên"
                                  options={
                                    form.getFieldValue(['items', field.name, 'type']) === 'phân bón'
                                      ? fetilizer_name
                                      : BVTV_name
                                  }
                                />
                              </Form.Item>
                              <Form.Item noStyle name={[subField.name, 'amountPerHa']}>
                                <Input
                                  placeholder="Số lượng"
                                  type="number"
                                  addonAfter={
                                    form.getFieldValue(['items', field.name, 'type']) === 'phân bón'
                                      ? 'kg/ha'
                                      : 'lit/ha'
                                  }
                                />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name)
                                }}
                              />
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => subOpt.add()} block>
                            + Thêm
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Thêm việc
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

export default UpdateTemplateProjectPopup
