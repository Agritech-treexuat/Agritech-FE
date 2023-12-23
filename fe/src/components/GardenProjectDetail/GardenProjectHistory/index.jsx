import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import {
  Tooltip,
  Col,
  Row,
  Image,
  Card,
  Button,
  Table,
  Column,
  Space,
  ColumnGroup,
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
import { HistoryOutlined, EditFilled, CloseOutlined, DatabaseFilled } from '@ant-design/icons'
import GARDEN from '../../../services/gardenService'

import Loading from '../../../pages/Loading'

const { Meta } = Card

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

  const handlePlantChange = (value) => {
    console.log(value)
  }

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
            console.log('Validate Failed:', info)
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
            options={listPlant.map((plant) => {
              plant.label = plant.name
              plant.value = plant.id
              return plant
            })}
            onChange={handlePlantChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CollectionHistoryForm = ({ open, onCreate, onCancel, history }) => {
  return (
    <Modal open={open} title="Lịch sử chỉnh sửa" footer={null} onCancel={onCancel}>
      <p>{history}</p>
    </Modal>
  )
}

const CollectionPlansForm = ({ open, onCreate, onCancel, plans }) => {
  const [formPlans] = Form.useForm()
  console.log(plans)

  useEffect(() => {
    formPlans.setFieldsValue({
      items: plans
    })
  }, [formPlans, plans])

  const handlePlantChange = (value) => {
    console.log(value)
  }
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
                  {`${plan.time} ${plan.type}`} <br />
                  {plan.agroChemicalItems.map((d) => (
                    <span>{`${d.name}: ${d.amountPerHa} kg `}</span>
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
  console.log('defaultTemplate', defaultTemplate)

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

  const handlePlantChange = (value) => {
    console.log(value)
  }
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
                  <Form.Item label="Time" name={[field.name, 'time']}>
                    <Input type="date" />
                  </Form.Item>

                  <Form.Item label="Note" name={[field.name, 'note']}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Type" name={[field.name, 'type']}>
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
                        }
                      ]}
                    ></Select>
                  </Form.Item>

                  <Form.Item label="List">
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
                                <Input placeholder="Số lượng" type="number"/>
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name)
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
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

const CollectionEditForm = ({ open, onCreate, onCancel, data, fetilizer, BVTV }) => {
  const [formEdit] = Form.useForm()

  const handlePlantChange = (value) => {
    console.log(value)
  }

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
        <Form.Item label="Time" name="time">
          <Form.Item name="startDate">
            <DatePicker
              defaultValue={dayjs(new Date(data?.time))}
              placeholder="Chọn ngày giao"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input />
        </Form.Item>

        <Form.Item label="Type" name="loai_canh_tac">
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
              }
            ]}
          ></Select>
        </Form.Item>

        <Form.Item label="List">
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
                      <Input placeholder="Số lượng" type="number" />
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

const GardenProjectHistory = () => {
  const [initData, setInitData] = useState(null)
  const [templates, setTemplates] = useState(null)
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
  const projectID = useParams()
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])
  console.log('params: ', projectID)
  const gardenId = useParams().id
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  useEffect(() => {
    setTemplates({
      id: '1',
      transaction_hash: 'adakdhakjdsas',
      //Cây
      seeds: [
        {
          id: '1',
          name: 'cây 1',
          seed: 'abc',
          startDate: '23/11/2023',
          amount: 10000,
          img: ['https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg'],
          plan: [
            {
              time: '12h',
              note: 'note',
              type: 'Phân bón',
              agroChemicalItems: [
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                }
              ]
            },
            {
              time: '14h',
              note: 'note',
              type: 'type select',
              agroChemicalItems: [
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: 'cây 2',
          seed: 'Hạt giống',
          startDate: '23/11/2023',
          amount: 1000,
          img: ['https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg'],
          plan: [
            {
              time: '12h',
              note: 'note',
              type: 'type select',
              agroChemicalItems: [
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                }
              ]
            }
          ]
        },
        {
          id: '3',
          name: 'cây 3',
          seed: 'Hạt giống',
          startDate: '23/11/2023',
          amount: 1000,
          img: ['https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg'],
          plan: [
            {
              time: '12h',
              note: 'note',
              type: 'type select',
              agroChemicalItems: [
                {
                  name: 'name',
                  amountPerHa: 12
                },
                {
                  name: 'name',
                  amountPerHa: 12
                }
              ]
            }
          ]
        },
        {
          id: '4',
          name: 'cây 4',
          seed: 'Hạt giống',
          startDate: '23/11/2023',
          amount: 1000,
          img: ['https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg'],
          plan: []
        },
        {
          id: '5',
          name: 'cây 5',
          seed: 'Hạt giống',
          startDate: '23/11/2023',
          amount: 1000,
          img: ['https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg'],
          plan: []
        }
      ]
    })
  }, [])

  useEffect(() => {
    setBVTV([
      {
        name: 'type 1'
      },
      {
        name: 'type 2'
      }
    ])

    setFetilizer([
      {
        name: 'Fetilizer 1'
      },
      {
        name: 'Fetilizer 2'
      }
    ])
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenProject(gardenId)
      console.log('Data: ', data.data)

      data.data.projects
        ? setInitData({
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
                    id: p._id
                  }
                })
              }
            })
          })
        : setInitData([])
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenProject(gardenId)
      console.log('Data to look: ', data)

      data.data.projects
        ? setTemplates({
            id: '1',
            seeds: data.data.projects.map((s) => {
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
        : setTemplates([])
    }
    fetchData()
  }, [])

  const onCreate = (values) => {
    console.log('Received values of onCreate abcdjcndjcndj: ', values)
    setPlanSelected(values.plant)
    console.log(templates.seeds)
    setPlans(templates.seeds.find((s) => s.id === values.plant)?.plan)
    console.log('plans', plans)
    setOpen(false)
    setOpenPlans(true)
  }

  const onCreatePlans = (values) => {
    console.log('Received values of onCreatePlans: ', values)
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
    setBVTV([
      {
        name: 'type 1'
      },
      {
        name: 'type 2'
      }
    ])

    setFetilizer([
      {
        name: 'Fetilizer 1'
      },
      {
        name: 'Fetilizer 2'
      }
    ])
    setOpenTemplate(true)
  }

  const onCreateTemplate = async (values) => {
    try {
      delete values.items[0].id
      const res = await FARM.addProcess(values.items[0], planSelected)
      console.log('res: ', res)
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
      console.log('Received values of editttttttt: ', values)
      let body = {
        time: values.time,
        agroChemicalItems: values.detail,
        type: values.loai_canh_tac,
        note: values.note
      }
      const res = await FARM.editProcess(body, projectIDSelected, processSelected)
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      console.log('initData', initData)
      const editData = initData.plants.find((obj) => obj.id === projectIDSelected)
      setInitData({
        id: '1',
        plants: initData.plants.map((plant) => {
          console.log('here:', plant, editData)
          if (plant.id == editData.id) {
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

  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`)
  }

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
                        console.log('rec', rec)
                        console.log('record', record)
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
                      setHistoryData(rec.tx)
                      console.log(rec.tx)
                    }}
                  >
                    <HistoryOutlined /> Lịch sử chỉnh sửa
                  </span>
                </Flex>
                <p>Transaction hash: {rec.tx}</p>
                <p>Thời gian: {rec.time}</p>
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
            dataSource={initData.plants.map((data, index) => {
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
