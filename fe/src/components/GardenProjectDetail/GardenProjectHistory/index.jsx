import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import {
  Tooltip,
  Card,
  Button,
  Table,
  Space,
  DatePicker,
  Form,
  Input,
  Modal,
  Divider,
  Flex,
  Select,
  Radio,
  notification
} from 'antd'
import { HistoryOutlined, EditFilled, CloseOutlined } from '@ant-design/icons'
import GARDEN from '../../../services/gardenService'
import Loading from '../../../pages/Loading'
import { formatDate, formatDateTime } from '../../../utils/helpers'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant }) => {
  const [form] = Form.useForm()

  return (
    <Modal
      open={open}
      title="Thêm hoạt động"
      okText="Thêm mới"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.error('Error: ', info)
          })
      }}
    >
      <Form
        form={form}
        {...layout}
        name="form_in_modal"
        initialValues={{
          modifier: 'public'
        }}
      >
        <Form.Item
          name="plant"
          label="Chọn cây"
          rules={[
            {
              required: true,
              message: 'Trường thông tin không được để trống!'
            }
          ]}
        >
          <Select
            showSearch
            style={{
              width: '100%'
            }}
            placeholder="Chọn cây"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={listPlant?.map((plant) => {
              plant.label = plant.name
              plant.value = plant.id
              return plant
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CollectionPlansForm = ({ open, onCreate, onCancel, plans }) => {
  const [formPlans] = Form.useForm()

  useEffect(() => {
    formPlans.setFieldsValue({
      items: plans
    })
  }, [formPlans, plans])

  return (
    <Modal
      open={open}
      title="Chọn hoạt động"
      okText="Xác nhận"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        formPlans
          .validateFields()
          .then((values) => {
            formPlans.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.error('Error: ', info)
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
        form={formPlans}
        layout="vertical"
        name="form_in_modal"
        style={{
          maxWidth: 600
        }}
      >
        <Form.Item name="plan" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Space direction="vertical">
              {plans?.map((plan) => (
                <Radio value={plan}>
                  {`${plan.time} (${plan.type}): ${plan.note}`} <br />
                  {plan.agroChemicalItems.map((d) => (
                    <span>{`${d.name}: ${d.amountPerHa} ${plan.type === 'phân bón' ? 'kg/ha' : 'lit/ha'} `}</span>
                  ))}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

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
      title="Thêm hoạt động"
      okText="Tạo mới"
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
            console.error('Error: ', info)
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
          {(fields) => (
            <div
              style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column'
              }}
            >
              {fields?.map((field) => (
                <Card size="small" title={`Kế hoạch`} key={field.key}>
                  <Form.Item label="Thời gian" name={[field.name, 'time']}>
                    <Input type="date" />
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
                                    formTemplate.getFieldValue(['items', field.name, 'type']) === 'phân bón'
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
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

const CollectionEditForm = ({ open, onCreate, onCancel, data, fetilizer, BVTV }) => {
  const [formEdit] = Form.useForm()

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

  return (
    <Modal
      open={open}
      title="Chỉnh sửa hoạt động"
      okText="Chỉnh sửa"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        formEdit
          .validateFields()
          .then((values) => {
            formEdit.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={formEdit} {...layout} name="form_in_modal" initialValues={data}>
        <Form.Item label="Thời gian" name="time">
          <Form.Item name="startDate">
            <DatePicker
              defaultValue={dayjs(new Date(data?.time))}
              placeholder="Chọn thời gian"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>

        <Form.Item label="Loại" name="loai_canh_tac">
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
          <Form.List name="detail">
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
                        options={data.loai_canh_tac === 'phân bón' ? fetilizer_name : BVTV_name}
                      />
                    </Form.Item>
                    <Form.Item noStyle name={[subField.name, 'amountPerHa']}>
                      <Input
                        placeholder="Số lượng"
                        type="number"
                        addonAfter={data.loai_canh_tac === 'phân bón' ? 'kg/ha' : 'lit/ha'}
                      />
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => {
                        subOpt.remove(subField.name)
                      }}
                    />
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CollectionHistoryForm = ({ open, onCreate, onCancel, history }) => {
  return (
    <Modal open={open} title="Lịch sử chỉnh sửa" footer={null} onCancel={onCancel}>
      {history ? (
        history.map((process) => (
          <>
            <Divider>Chỉnh sửa lúc: {formatDateTime(process.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>Tx: {process.tx}</p>
              <p>Thời gian: {formatDate(process.time)}</p>
              <p>Loại canh tác: {process.type}</p>
              {process.type === 'phân bón' || process.type === 'BVTV' ? (
                <div>
                  {process.agroChemicalItems.map((item) => (
                    <ul>
                      <li>
                        Tên: {item.name}, {item.amountPerHa} {process.type === 'phân bón' ? 'kg/ha' : 'lit/ha'}
                      </li>
                    </ul>
                  ))}
                  <p>Ghi chú: {process.note}</p>
                </div>
              ) : (
                <p>Ghi chú: {process.note}</p>
              )}
            </div>
          </>
        ))
      ) : (
        <>Không có lịch sử chỉnh sửa</>
      )}
    </Modal>
  )
}

const GardenProjectHistory = () => {
  const [initData, setInitData] = useState([])
  const [templates, setTemplates] = useState([])
  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openHistory, setHistory] = useState(false)
  const [editData, setEditData] = useState(null)
  const [historyData, setHistoryData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [plans, setPlans] = useState([])
  const [planSelected, setPlanSelected] = useState(null)
  const [processSelected, setProcessSelected] = useState(null)
  const [projectIDSelected, setProjectIDSelected] = useState(null)
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])
  const gardenId = useParams().id
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
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

  useEffect(() => {
    loadCultivates()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenProject(gardenId)

      if (data.data.projects) {
        setInitData({
          id: 1,
          plants: data.data.projects.map((prj) => {
            return {
              id: prj.projectId,
              name: prj.name,
              status: prj.status,
              plan: prj.process.map((p) => {
                return {
                  tx: p._id,
                  time: p.time,
                  loai_canh_tac: p.type,
                  detail: p.agroChemicalItems,
                  note: p.note,
                  id: p._id,
                  isEdited: p.isEdited,
                  historyProcess: p.historyProcess ? p.historyProcess : []
                }
              })
            }
          })
        })
        setTemplates({
          id: '1',
          plants: data.data.projects.map((s) => {
            return {
              id: s.projectId,
              name: s.name,
              seed: s.input.seed,
              img: s.input.images,
              plan: s.plan.map((p) => {
                return {
                  id: p._id,
                  time: p.time,
                  note: p.note,
                  type: p.type,
                  agroChemicalItems: p.agroChemicalItems
                }
              })
            }
          })
        })
      }
    }

    fetchData()
  }, [])

  const onCreate = (values) => {
    setPlanSelected(values.plant)
    setPlans(templates.plants.find((s) => s.id === values.plant)?.plan)
    setOpen(false)
    setOpenPlans(true)
  }

  const onCreatePlans = (values) => {
    setOpenPlans(false)
    let newTemp = []
    newTemp.push(values.plan)
    newTemp[0].note = newTemp[0].note + newTemp[0].time
    const dateObj = new Date()

    const yearData = dateObj.getFullYear()
    const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const dateData = dateObj.getDate().toString().padStart(2, '0')

    const formattedDate = `${yearData}-${monthData}-${dateData}`
    newTemp[0].time = formattedDate
    setDefaultTemplate(newTemp)
    setOpenTemplate(true)
  }

  const onCreateTemplate = async (values) => {
    try {
      delete values.items[0].id
      const res = await FARM.addProcess(values.items[0], planSelected)
      setOpenTemplate(false)
      setInitData({
        id: '1',
        plants: initData.plants.map((data) => {
          if (data.id === res.data.projectId) {
            data.plan = res.data.updatedProjectProcess.map((p) => {
              return {
                tx: p._id,
                time: p.time,
                loai_canh_tac: p.type,
                detail: p.agroChemicalItems,
                note: p.note
              }
            })
          }
          return data
        })
      })
      openNotificationWithIcon('success', 'Thông báo', 'Tạo mới thành công')
    } catch (error) {
      openNotificationWithIcon('error', 'Thông báo', 'Có lỗi xảy ra')
      console.error(error?.response?.data?.message)
    }
  }

  const onCreateEdit = async (values) => {
    try {
      let body = {
        time: values.time,
        agroChemicalItems: values.detail,
        type: values.loai_canh_tac,
        note: values.note
      }
      const res = await FARM.editProcess(body, projectIDSelected, processSelected)
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      const editData = initData.plants.find((obj) => obj.id === projectIDSelected)
      setInitData({
        id: '1',
        plants: initData?.plants?.map((plant) => {
          if (plant.id === editData.id) {
            plant.plan = res?.data.updatedProcess.map((i) => {
              return {
                detail: i.agroChemicalItems,
                loai_canh_tac: i.type,
                note: i.note,
                time: i.time,
                id: i._id
              }
            })
          }
          return plant
        })
      })
      setOpenEdit(false)
    } catch (e) {
      console.error(e?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Có lỗi xảy ra')
    }
  }

  const handleChangeStatus = (value) => {}

  const columns = [
    {
      title: 'Cây',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <div style={{ textAlign: 'center' }}>{record.name}</div>
    },
    {
      title: 'Hoạt động canh tác',
      key: 'plan',
      dataIndex: 'plant',
      render: (_, record) =>
        record.plan.length > 0 ? (
          <div>
            {record.plan.map((rec) => (
              <div>
                <Flex justify="space-between">
                  <div
                    style={{
                      color: '#476930',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      onClick={() => {
                        setOpenEdit(true)
                        setEditData(rec)
                        setProcessSelected(rec.id)
                        setProjectIDSelected(record.id)
                      }}
                    >
                      <EditFilled /> Chỉnh sửa
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#476930',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setHistory(true)
                      setHistoryData(rec.historyProcess)
                    }}
                  >
                    <HistoryOutlined /> Lịch sử chỉnh sửa
                  </span>
                </Flex>
                <p>Transaction hash: {rec.tx}</p>
                <p>Thời gian: {formatDate(rec.time)}</p>
                <p>Loại canh tác: {rec.loai_canh_tac}</p>
                <p>
                  Chi tiết:{' '}
                  <ul>
                    {rec.detail.map((item, index) => (
                      <li key={index}>
                        <strong>{item.name}:</strong> {item.amountPerHa}
                      </li>
                    ))}
                  </ul>
                </p>
                <Divider></Divider>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>Không có thông tin</div>
        )
    },
    {
      title: 'Chỉnh sửa trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        record.status ? (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                color: '#476930',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              <span
                style={{
                  display: isEdit ? 'none' : 'flex',
                  alignItems: 'center'
                }}
              >
                {record.status}
              </span>
              <Select
                defaultValue={record.status}
                style={{
                  width: 160,
                  display: isEdit ? 'flex' : 'none'
                }}
                onChange={handleChangeStatus}
                options={[
                  {
                    value: '1',
                    label: 'Đang canh tác'
                  },
                  {
                    value: '2',
                    label: 'Đang thu hoạch'
                  },
                  {
                    value: '3',
                    label: 'Sắp thu hoạch xong'
                  },
                  {
                    value: '4',
                    label: 'Thu hoạch xong'
                  }
                ]}
              />
            </div>
            <div>
              <Tooltip
                title={isEdit ? 'Lưu trạng thái' : 'Chỉnh sửa trạng thái'}
                onClick={() => {
                  setIsEdit(!isEdit)
                }}
              >
                <EditFilled />
              </Tooltip>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>Không có thông tin</div>
        )
    }
  ]

  return (
    <div>
      {contextHolder}
      {initData ? (
        <div>
          <h2 style={{ margin: '0px' }}>Các hoạt động canh tác</h2>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true)
            }}
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          >
            Thêm hoạt động
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false)
            }}
            listPlant={initData.plants}
          />
          <CollectionPlansForm
            open={openPlans}
            onCreate={onCreatePlans}
            onCancel={() => {
              setOpenPlans(false)
            }}
            plans={plans}
          />
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
          <CollectionEditForm
            open={openEdit}
            onCreate={onCreateEdit}
            onCancel={() => {
              setOpenEdit(false)
            }}
            data={editData}
            fetilizer={fetilizer}
            BVTV={BVTV}
          />
          <CollectionHistoryForm
            open={openHistory}
            onCancel={() => {
              setHistory(false)
            }}
            history={historyData}
          />
          <Table
            bordered={true}
            columns={columns}
            dataSource={initData?.plants?.map((data, index) => {
              data.key = index
              return data
            })}
          />{' '}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectHistory
