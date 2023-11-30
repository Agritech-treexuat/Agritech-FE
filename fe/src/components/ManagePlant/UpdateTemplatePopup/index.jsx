import React, { useState } from 'react';
import { Modal, Radio, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography } from 'antd';
import './style.css'
const { Option } = Select;
const UpdateTemplatePopup = ({ open, onCreate, onCancel, template, fetilizer, BVTV, plantCultivateId }) => {
  const [form] = Form.useForm();
  console.log("default: ", template)
  console.log("fe: ", fetilizer, BVTV)
  // const fetilizer_name = fetilizer.map((fetilizer_item) => fetilizer_item.name)
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
  console.log("here 2: ", fetilizer_name, BVTV_name );
  return (
    <Modal
      open={open}
      title="Thêm cây mới"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values, plantCultivateId);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      getContainer={false}
    >
      <h1>hello</h1>
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          items: template,
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column',
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Item ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item label="Time" name={[field.name, 'time']}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Note" name={[field.name, 'note']}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Type" name={[field.name, 'type']}>
                    <Select placeholder="Chọn loại">
                      <Option value="phân bón">Phân bón</Option>
                      <Option value="BVTV">BVTV</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="List" >
                    <Form.List name={[field.name, 'cultivativeItems']}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item noStyle name={[subField.name, 'name']}>
                                <Select
                                  placeholder="Chọn tên"
                                  options={form.getFieldValue(['items', field.name, 'type']) == 'phân bón' ? fetilizer_name : BVTV_name}
                                />
                              </Form.Item>
                              <Form.Item noStyle name={[subField.name, 'amount_per_ha']}>
                                <Input placeholder="Số lượng" type='number' />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => subOpt.add()} block>
                            + Thêm Sub Item
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Add Item
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default UpdateTemplatePopup
