import React, { useEffect } from 'react'
import { Modal, InputNumber, Input, Space, Form, Button, Row, Col, Select, Divider } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'

const AddPlantFarmingPopup = ({ open, onCreate, onCancel, recommendPlantFarming, isUpdate }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(recommendPlantFarming)
  }, [recommendPlantFarming])

  return (
    <Modal
      open={open}
      title={isUpdate ? 'Cập nhật quy trình trồng' : 'Thêm quy trình trồng'}
      okText={isUpdate ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={1500}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.setFieldsValue(values)
            onCreate(values)
          })
          .catch((error) => {
            console.log('Validation failed:', error)
          })
      }}
    >
      <Form form={form} name="dynamic_form_complex" initialValues={recommendPlantFarming}>
        <Row gutter={[16, 16]}>
          <Col span={12} style={{ padding: '16px', borderRadius: '8px', paddingRight: '6px' }}>
            <Space
              direction="vertical"
              style={{ backgroundColor: '#dcedc8', width: '100%', margin: '8px', borderRadius: '8px', padding: '12px' }}
            >
              <h1 style={{ textAlign: 'center', marginBottom: '0', padding: '0' }}>Thông tin cơ bản</h1>
              <h2 style={{ marginTop: '0' }}>Thời gian cấy trồng</h2>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%', backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                  <Form.List name="timeCultivates">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <div key={`timeCultivates_${index}`}>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '0 16px' }}>
                              <Space
                                direction="horizonal"
                                style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}
                              >
                                <div style={{ display: 'flex' }}>
                                  <Form.Item
                                    fieldKey={[field.key, 'start']}
                                    name={[field.name, 'start']}
                                    label="Bắt đầu"
                                  >
                                    <InputNumber min={0} placeholder="Bắt đầu" style={{ width: '80%' }} />
                                  </Form.Item>
                                  <Form.Item fieldKey={[field.key, 'end']} name={[field.name, 'end']} label="Kết thúc">
                                    <InputNumber min={0} placeholder="Kết thúc" style={{ width: '80%' }} />
                                  </Form.Item>
                                </div>
                              </Space>
                              <CloseOutlined onClick={() => remove(field.name)} />
                            </div>
                          </div>
                        ))}
                        <Button
                          style={{ backgroundColor: '#558b2f', color: '#ffffff' }}
                          type="dashed"
                          onClick={() => add()}
                          block
                        >
                          + Thêm thông tin
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Space>

              <h2 style={{ marginTop: '0' }}>Thời gian tốt nhất để trồng</h2>
              <Form.Item style={{ margin: '16px' }}>
                <Space
                  direction="horizonal"
                  style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <Form.Item name={['bestTimeCultivate', 'start']} label="Bắt đầu">
                    <InputNumber min={0} placeholder="Bắt đầu" style={{ width: '80%' }} />
                  </Form.Item>
                  <Form.Item name={['bestTimeCultivate', 'end']} label="Kết thúc">
                    <InputNumber min={0} placeholder="Kết thúc" style={{ width: '80%' }} />
                  </Form.Item>
                </Space>
              </Form.Item>

              <div style={{ margin: '16px' }}>
                <h2 style={{ marginTop: '0' }}>Thời gian trồng và thu hoạch</h2>
                <Space
                  direction="horizonal"
                  style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <Form.Item style={{ width: '80%' }} label="Thời gian trồng" name="farmingTime">
                    <InputNumber min={0} placeholder="Thời gian trồng" style={{ width: '80%' }} />
                  </Form.Item>
                  <Form.Item label="Thời gian thu hoạch" name="harvestTime">
                    <InputNumber min={0} placeholder="Thời gian thu hoạch" style={{ width: '80%' }} />
                  </Form.Item>
                </Space>
              </div>
            </Space>

            <Space
              direction="vertical"
              style={{ backgroundColor: '#dcedc8', width: '100%', margin: '8px', borderRadius: '8px', padding: '12px' }}
            >
              <h1 style={{ textAlign: 'center', marginBottom: '0', padding: '0' }}>Hoạt động kiểm soát sâu bệnh</h1>
              <h2 style={{ marginTop: '0' }}>Danh sách các hoạt động kiểm soát, phòng ngừa</h2>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%', backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                  <Form.List name="pestAndDiseaseControlActivities">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <div key={`pestAndDiseaseControlActivities_${index}`}>
                            <div style={{ display: 'flex' }}>
                              <Space direction="vertical" style={{ width: '100%', marginTop: '8px', padding: '8px' }}>
                                <CloseOutlined style={{ float: 'right' }} onClick={() => remove(field.name)} />
                                <Form.Item fieldKey={[field.key, 'name']} name={[field.name, 'name']} label="Tên">
                                  <Input placeholder="Tên" style={{ width: '28.5rem', float: 'right' }} />
                                </Form.Item>
                                <Form.Item fieldKey={[field.key, 'type']} name={[field.name, 'type']} label="Loại">
                                  <Select style={{ width: '28.5rem', float: 'right' }} placeholder="Chọn loại">
                                    <Select.Option value="pest">Sâu</Select.Option>
                                    <Select.Option value="disease">Bệnh</Select.Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  fieldKey={[field.key, 'symptoms']}
                                  name={[field.name, 'symptoms']}
                                  label="Triệu chứng"
                                >
                                  <Input.TextArea
                                    placeholder="Triệu chứng"
                                    style={{ width: '28.5rem', float: 'right' }}
                                    autoSize={{ minRows: 5 }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  fieldKey={[field.key, 'description']}
                                  name={[field.name, 'description']}
                                  label="Mô tả"
                                >
                                  <Input.TextArea
                                    placeholder="Mô tả"
                                    style={{ width: '28.5rem', float: 'right' }}
                                    autoSize={{ minRows: 5 }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  fieldKey={[field.key, 'solution']}
                                  label="Giải pháp"
                                  name={[field.name, 'solution']}
                                >
                                  <Form.List name={[field.name, 'solution']}>
                                    {(subFields, { add: addSolution, remove: removeSolution }) => (
                                      <>
                                        {subFields.map((subField, index) => (
                                          <div
                                            key={`solution_${index}`}
                                            style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              float: 'right',
                                              alignItems: 'flex-end'
                                            }}
                                          >
                                            <CloseOutlined
                                              style={{ float: 'right' }}
                                              onClick={() => removeSolution(subField.name)}
                                            />
                                            <Form.Item
                                              fieldKey={[subField.key, 'solution']}
                                              name={[subField.name]}
                                              noStyle
                                            >
                                              <Input.TextArea
                                                placeholder="Giải pháp"
                                                style={{ width: '28.5rem', float: 'right' }}
                                                autoSize={{ minRows: 5 }}
                                              />
                                            </Form.Item>
                                          </div>
                                        ))}
                                        <Button
                                          style={{
                                            width: '28.5rem',
                                            float: 'right',
                                            backgroundColor: '#558b2f',
                                            color: '#ffffff',
                                            marginTop: '16px'
                                          }}
                                          type="dashed"
                                          onClick={() => addSolution()}
                                          block
                                        >
                                          + Thêm giải pháp
                                        </Button>
                                      </>
                                    )}
                                  </Form.List>
                                </Form.Item>
                              </Space>
                            </div>
                            <Divider />
                          </div>
                        ))}
                        <Button
                          style={{ backgroundColor: '#558b2f', color: '#ffffff' }}
                          type="dashed"
                          onClick={() => add()}
                          block
                        >
                          + Thêm thông tin
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Space>
            </Space>
          </Col>
          <Col span={12} style={{ padding: '16px', borderRadius: '8px', paddingLeft: '6px' }}>
            <Space
              direction="vertical"
              style={{ backgroundColor: '#dcedc8', width: '100%', margin: '8px', borderRadius: '8px', padding: '12px' }}
            >
              <h1 style={{ textAlign: 'center', marginBottom: '0', padding: '0' }}>Hoạt động làm đất và gieo trồng</h1>
              <h2 style={{ marginTop: '0' }}>Hoạt động làm đất</h2>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%', backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                  <Form.List name="cultivationActivities">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <div key={`cultivationActivities_${index}`}>
                            <div style={{ margin: '16px' }}>
                              <CloseOutlined style={{ float: 'right' }} onClick={() => remove(field.name)} />
                              <Space direction="vertical" style={{ width: '100%', marginTop: '8px', padding: '8px' }}>
                                <Form.Item fieldKey={[field.key, 'name']} name={[field.name, 'name']} label="Tên">
                                  <Input placeholder="Tên" style={{ width: '28.5rem', float: 'right' }} />
                                </Form.Item>
                                <Form.Item
                                  fieldKey={[field.key, 'description']}
                                  name={[field.name, 'description']}
                                  label="Mô tả"
                                >
                                  <Input.TextArea
                                    placeholder="Mô tả"
                                    style={{ width: '28.5rem', float: 'right' }}
                                    autoSize={{ minRows: 5 }}
                                  />
                                </Form.Item>
                              </Space>
                              <Divider />
                            </div>
                          </div>
                        ))}
                        <Button
                          style={{ backgroundColor: '#558b2f', color: '#ffffff' }}
                          type="dashed"
                          onClick={() => add()}
                          block
                        >
                          + Thêm thông tin
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Space>

              <h2 style={{ marginTop: '0' }}>Hoạt động gieo trồng</h2>
              <Form.Item name="plantingActivity" style={{ margin: '16px' }}>
                <Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
                  <Form.Item name={['plantingActivity', 'density']} label="Mật độ">
                    <Input placeholder="Mật độ" style={{ width: '38.5rem', float: 'right' }} />
                  </Form.Item>
                  <Form.Item name={['plantingActivity', 'description']} label="Mô tả">
                    <Input.TextArea
                      placeholder="Mô tả"
                      style={{ width: '38.5rem', float: 'right' }}
                      autoSize={{ minRows: 5 }}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
            </Space>
            <Space
              direction="vertical"
              style={{ backgroundColor: '#dcedc8', width: '100%', margin: '8px', borderRadius: '8px', padding: '12px' }}
            >
              <h1 style={{ textAlign: 'center', marginBottom: '0', padding: '0' }}>Hoạt động bón phân</h1>
              <h2 style={{ marginTop: '0' }}>Danh sách các hoạt động bón phân</h2>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%', backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                  <Form.List name="fertilizationActivities">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <div key={`fertilizationActivities_${index}`}>
                            <div style={{ display: 'flex' }}>
                              <Space direction="vertical" style={{ width: '100%', marginTop: '8px', padding: '8px' }}>
                                <CloseOutlined style={{ float: 'right' }} onClick={() => remove(field.name)} />
                                <Form.Item
                                  fieldKey={[field.key, 'fertilizationTime']}
                                  name={[field.name, 'fertilizationTime']}
                                  label="Thời gian phân bón"
                                >
                                  <Input
                                    placeholder="Thời gian phân bón"
                                    style={{ width: '28.5rem', float: 'right' }}
                                  />
                                </Form.Item>
                                <Form.Item fieldKey={[field.key, 'type']} name={[field.name, 'type']} label="Loại">
                                  <Select style={{ width: '28.5rem', float: 'right' }} placeholder="Chọn loại">
                                    <Select.Option value="baseFertilizer">Bón lót</Select.Option>
                                    <Select.Option value="topFertilizer">Bón thúc</Select.Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  fieldKey={[field.key, 'description']}
                                  name={[field.name, 'description']}
                                  label="Mô tả"
                                >
                                  <Input.TextArea
                                    placeholder="Mô tả"
                                    style={{ width: '28.5rem', float: 'right' }}
                                    autoSize={{ minRows: 5 }}
                                  />
                                </Form.Item>
                              </Space>
                            </div>
                            <Divider />
                          </div>
                        ))}
                        <Button
                          style={{ backgroundColor: '#558b2f', color: '#ffffff' }}
                          type="dashed"
                          onClick={() => add()}
                          block
                        >
                          + Thêm thông tin
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Space>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddPlantFarmingPopup
