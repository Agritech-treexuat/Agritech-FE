import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import GARDEN from '../../../services/gardenService'

import {
  Col,
  notification,
  Row,
  Image,
  Card,
  Button,
  Table,
  Column,
  ColumnGroup,
  Form,
  Input,
  Modal,
  Divider,
  Flex,
  Select,
  DatePicker,
  Space
} from 'antd'
import { HistoryOutlined, EditFilled, CloseOutlined } from '@ant-design/icons'

import Loading from '../../../pages/Loading'
import MenuDivider from 'antd/es/menu/MenuDivider'

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
  console.log('init dât; ', listPlant)
  return (
    <Modal
      open={open}
      title="Thêm mới"
      okText="Thêm"
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
          plants: listPlant.map((p) => {
            p.key = p.id
            return p
          })
        }}
      >
        <Form.Item name="startDate" label="Ngày bắt đầu">
          <DatePicker
            defaultValue={dayjs(new Date()).add(1, 'day')}
            placeholder="Chọn ngày giao"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Danh sách" name="plants">
          <Form.List name="plants">
            {(subFields, subOpt) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 16
                }}
              >
                {subFields.map((subField, i) => (
                  <Space key={subField.key}>
                    <span>{listPlant[i].name ? listPlant[i].name : ''}</span>
                    <Form.Item noStyle name={[subField.name, 'amount']} label={listPlant[i]?.name}>
                      <Input
                        type={(() => {
                          if (listPlant[i].name !== 'Tặng') {
                            return 'number'
                          }
                          return ''
                        })()}
                        addonAfter={(() => {
                          if (listPlant[i].name !== 'Tặng') {
                            return 'kg'
                          }
                          return ''
                        })()}
                      />
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => {
                        subOpt.remove(subField.name)
                      }}
                    />
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    listPlant.push({
                      key: listPlant.length + 1,
                      id: listPlant.length + 1,
                      name: 'Tặng'
                    })
                    subOpt.add()
                  }}
                  block
                >
                  + Thêm hàng hóa
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input placeholder="Điền ghi chú" style={{ width: '100%' }} />
        </Form.Item>
        <div></div>
      </Form>
    </Modal>
  )
}
const GardenProjectOutput = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const [open, setOpen] = useState(false)
  const gardenId = useParams().id
  const onCreate = (values) => {
    console.log('Received values of form thêm: ', values)

    const fetchData = async () => {
      const addData = {
        deliveryDetails: values?.plants.map((plant) => {
          if (plant.amount) {
            return {
              plant: plant.name,
              amount: plant.amount
            }
          } else {
            return undefined
          }
        }),
        note: values.note,
        date: values.startDate ? values.startDate.dateString : dayjs(new Date()).add(1, 'day') // Check if values.startDate is undefined
      }

      try {
        const data = await GARDEN.addDelivery(addData, gardenId)
        console.log('ssssssssssssssssssss', data)
        openNotificationWithIcon('success', 'Thông báo', 'Tạo mới thành công')
      } catch (error) {
        console.error('Error adding delivery:', error)
        openNotificationWithIcon('erro', 'Thông báo', 'Có lỗi xảy ra')
        // Handle error as needed
      }
    }
    fetchData()
    setOpen(false)
  }
  const [initData, setInitData] = useState([])
  const [listPlant, setListPlant] = useState([])
  const [deliveried, setDeliveried] = useState([])
  const [notDeliveried, setNotDeliveried] = useState([])
  const projectID = useParams()
  console.log('params: ', projectID)
  console.log(deliveried)

  useEffect(() => {
    // 1 là đã giao, 0 là chưa giao
    setListPlant([
      {
        id: '1',
        name: 'Cây 1'
      },
      {
        id: '2',
        name: 'Cây 2'
      },
      {
        id: '3',
        name: 'Cây 3'
      },
      {
        id: '4',
        name: 'Cây 4'
      }
    ])
  }, [])

  useEffect(() => {
    // 1 là đã giao, 0 là chưa giao
    setInitData([
      {
        time: new Date().toISOString(),
        plants: [
          { name: 'Cây 1', amount: 5 },
          { name: 'Cây 2', amount: 5 },
          { name: 'Cây 3', amount: 0 },
          { name: 'Cây 4', amount: 0 }
        ],
        status: 1
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: 'Cây 1', amount: 5 },
          { name: 'Cây 1', amount: 5 }
        ],
        status: 1
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: 'Cây 1', amount: 5 },
          { name: 'Cây 1', amount: 5 }
        ],
        status: 1
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: 'Cây 1', amount: 5 },
          { name: 'Cây 1', amount: 5 }
        ],
        status: 0
      }
    ])
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenOutput(gardenId)
      console.log('Data: here ', data.data)

      data.data.deliveries
        ? setInitData(
            data.data.deliveries.map((item) => {
              return {
                id: item._id,
                time: item.date,
                plants: item.deliveryDetails.map((plant) => ({
                  name: plant.plant,
                  amount: plant.amount,
                  id: plant._id
                })),
                note: item.note,
                status: item.status,
                clientAccept: item.clientAccept,
                clientNote: item.clientNote
              }
            })
          )
        : setInitData([])
    }
    console.log('initData API', initData)
    fetchData()
  }, [])

  useEffect(() => {
    console.log('Init: ', initData)
    // 1 là đã giao, 0 là chưa giao
    setDeliveried(initData.filter((i) => i.status === 'done'))
  }, [initData])

  useEffect(() => {
    // 1 là đã giao, 0 là chưa giao
    setNotDeliveried(initData.filter((i) => i.status === 'coming'))
  }, [initData])

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{record?.time}</div>
    },
    {
      title: 'Thông tin',
      key: 'value',
      dataIndex: 'value',
      render: (_, record) => (
        <div>
          {record.plants.map((plant) => (
            <div>
              {plant.amount > 0 ? (
                <div>
                  {plant?.name} - {plant?.amount} kg
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Khách chấp nhận',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.clientAccept}</div>
    },
    {
      title: 'Ghi chú của Khách',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.clientNote}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.note}</div>
    }
  ]

  return (
    <div>
      {contextHolder}
      {initData ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true)
            }}
          >
            Thêm
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false)
            }}
            listPlant={listPlant}
          />
          <h2 style={{ marginBottom: '1rem' }}>Sắp giao</h2>
          <Table bordered={true} columns={columns} dataSource={notDeliveried} />{' '}
          <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Đã giao</h2>
          <Table bordered={true} columns={columns} dataSource={deliveried} />{' '}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectOutput
