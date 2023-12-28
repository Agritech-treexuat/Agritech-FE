import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { Collapse, Card, Form, Input, Modal, Button, Select, notification, Divider, Space } from 'antd'
import { EditFilled, CloseOutlined } from '@ant-design/icons'
import Loading from '../../../pages/Loading'
import './style.css'
import GARDEN from '../../../services/gardenService'

const CollectionTemplateForm = ({ open, onCreate, onCancel, defaultTemplate, fetilizer, BVTV }) => {
  const [formTemplate] = Form.useForm()

  const BVTV_name = BVTV?.map((BVTV_item) => {
    return {
      value: BVTV_item.name,
      label: BVTV_item.name
    }
  })

  const fetilizer_name = fetilizer?.map((fetilizer_item) => {
    return {
      value: fetilizer_item.name,
      label: fetilizer_item.name
    }
  })

  useEffect(() => {
    formTemplate.setFieldsValue({
      items: defaultTemplate
    })
  }, [formTemplate, defaultTemplate])

  return (
    <Modal
      open={open}
      title="Cập nhật quy trình"
      okText="Cập nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        formTemplate
          .validateFields()
          .then((values) => {
            formTemplate.resetFields()
            onCreate(values)
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
        form={formTemplate}
        name="dynamic_form_complex"
        style={{
          maxWidth: 600
        }}
        initialValues={{
          items: defaultTemplate
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
              {fields?.map((field) => (
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
                    <Select
                      placeholder="Chọn loại"
                      options={[
                        {
                          label: 'Phân bón',
                          value: 'phân bón'
                        },
                        {
                          label: 'BVTV',
                          value: 'BVTV'
                        },
                        {
                          label: 'Khác',
                          value: 'other'
                        }
                      ]}
                    ></Select>
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
                                    formTemplate.getFieldValue(['items', field.name, 'type']) == 'phân bón'
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
                                    formTemplate.getFieldValue(['items', field.name, 'type']) === 'phân bón'
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

const GardenProjectTemplate = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const [initData, setInitData] = useState(null)
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [selectedPlant, setSelectedPlant] = useState('')
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])
  const gardenId = useParams().id

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenTemplate(gardenId)

      data.data.projects
        ? setInitData({
            id: 1,
            seeds: data.data.projects.map((prj) => {
              return {
                id: prj.projectId,
                name: prj.name,
                seed: prj.input.seed,
                plan: prj.plan
              }
            })
          })
        : setInitData([])
    }
    fetchData()
  }, [])

  const items = initData
    ? initData.seeds
        ?.filter((seed) => seed.plan.length > 0)
        .map((plant, index) => {
          plant.key = index.toString()
          plant.label = (
            <div>
              <FontAwesomeIcon icon={faTree} style={{ color: '#476930' }} />{' '}
              <span>{`${plant.name.charAt(0).toUpperCase()} ${plant.name.slice(1)}`}</span>
            </div>
          )
          plant.children = (
            <div>
              <div style={{ cursor: 'pointer' }}>
                <EditFilled style={{ color: '#86B049', fontSize: '18px' }} onClick={() => handleEdit(plant)} />
                {'  '}Chỉnh sửa thông tin
              </div>
              <div>
                <p>
                  <strong>Tên hạt giống:</strong> {plant.seed}
                </p>
                {plant.plan.map((p) => (
                  <div>
                    <Divider orientation="center" style={{ fontSize: '18px' }}>
                      Thời gian: {p.time}
                    </Divider>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <p style={{ width: '25%' }}>
                        <strong>Ghi chú:</strong> {p.note}
                      </p>
                      <p style={{ width: '25%' }}>
                        <strong>Type:</strong> {p.type}
                      </p>
                    </div>
                    <p style={{ fontSize: '16px', margin: '0 1rem' }}>
                      <strong>
                        <Divider orientation="left" style={{ marginRight: '1rem', width: '80%' }}>
                          <i>Chi tiết hoạt động </i>
                        </Divider>
                      </strong>
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {p.agroChemicalItems.map((i) => (
                        <div
                          style={{
                            width: '25%',
                            backgroundColor: '#fff',
                            marginBottom: '1rem'
                          }}
                        >
                          <p>Tên: {i.name}</p>
                          <p>Số lượng trên ha: {i.amountPerHa}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
          return plant
        })
    : []

  const handleEdit = async (plant) => {
    setSelectedPlant(plant)
    await loadCultivates()
    setDefaultTemplate(plant.plan)
    setOpenTemplate(true)
  }

  const loadCultivates = async () => {
    const data = await FARM.getCultivative()
    const fetilizer = []
    const BVTV = []

    if (data.data) {
      data.data.cultivatives.forEach((cultivative) => {
        if (cultivative.type === 'phân bón') {
          fetilizer.push({ name: cultivative.name })
        } else if (cultivative.type === 'BVTV') {
          BVTV.push({ name: cultivative.name })
        }
      })

      setFetilizer(fetilizer)
      setBVTV(BVTV)
    }
  }

  const [openTemplate, setOpenTemplate] = useState(false)
  const onCreateTemplate = (values) => {
    const data = {
      plan: values.items
    }
    updateTemplate(data, selectedPlant.id)
    setOpenTemplate(false)
  }

  const updateTemplate = async (data, projectId) => {
    const new_data = await FARM.updatePlantCultivatesToProject(data, projectId)
    openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    setInitData({
      id: '1',
      seeds: initData.seeds.map((data) => {
        if (data.id === selectedPlant.id) {
          data.plan = new_data.data.updatedProjectPlan
        }
        return data
      })
    })
  }

  return (
    <div>
      {contextHolder}
      {initData ? (
        <div>
          <CollectionTemplateForm
            open={openTemplate}
            onCreate={onCreateTemplate}
            onCancel={() => {
              setOpenTemplate(false)
            }}
            defaultTemplate={defaultTemplate}
            fetilizer={fetilizer}
            BVTV={BVTV}
          />
          <div>
            <Collapse style={{ marginTop: '1.5rem' }} items={items} defaultActiveKey={['1']} />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectTemplate
