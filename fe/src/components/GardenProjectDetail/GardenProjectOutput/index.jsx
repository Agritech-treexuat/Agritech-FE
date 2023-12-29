import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import GARDEN from '../../../services/gardenService'
import { notification, Button, Table, Form, Input, Modal, DatePicker, Space } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import Loading from '../../../pages/Loading'
import { formatDate } from '../../../utils/helpers'

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  return (
    <>
      {listPlant ? (
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
                            setIsButtonDisabled(false)
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
                        setIsButtonDisabled(true)
                      }}
                      disabled={isButtonDisabled}
                    >
                      + Thêm hàng tặng
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
      ) : (
        <Loading />
      )}
    </>
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
    const fetchData = async () => {
      let giveAway = ''
      if (!values.plants[values.plants.length - 1].name) {
        giveAway = values.plants[values.plants.length - 1].amount
      }
      const addData = {
        deliveryDetails: values?.plants
          .map((plant) => {
            if (plant.amount && plant.name) {
              return {
                plant: plant.name,
                amount: plant.amount
              }
            }
          })
          .filter((item) => item !== undefined),
        note: values.note ? values.note + ' - ' + giveAway : giveAway,
        date: values.startDate
          ? new Date(values.startDate.format('YYYY-MM-DD'))
          : new Date(dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'))
      }

      try {
        const data = await GARDEN.addDelivery(addData, gardenId)
        if (data.data) {
          setInitData(
            data.data.allDeliveries.map((item) => {
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
        }
        openNotificationWithIcon('success', 'Thông báo', 'Tạo mới thành công')
      } catch (error) {
        console.error('Error adding delivery:', error)
        openNotificationWithIcon('erro', 'Thông báo', 'Có lỗi xảy ra')
      }
    }
    fetchData()
    setOpen(false)
  }
  const [initData, setInitData] = useState([])
  const [listPlant, setListPlant] = useState([])
  const [deliveried, setDeliveried] = useState([])
  const [notDeliveried, setNotDeliveried] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getPlantCurrentGarden(gardenId)
      data.data.plants ? setListPlant(data.data.plants) : setListPlant([])
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getGardenOutput(gardenId)

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
    fetchData()
  }, [])

  useEffect(() => {
    setDeliveried(initData.filter((i) => i.status === 'done'))
  }, [initData])

  useEffect(() => {
    setNotDeliveried(initData.filter((i) => i.status === 'coming'))
  }, [initData])

  const columnsComing = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{formatDate(record?.time)}</div>
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
      title: 'Ghi chú',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.note}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => <div>{record.status}</div>
    }
  ]

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{formatDate(record?.time)}</div>
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
      title: 'Ghi chú',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.note}</div>
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
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => <div>{record.status}</div>
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
          <Table bordered={true} columns={columnsComing} dataSource={notDeliveried} />{' '}
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
