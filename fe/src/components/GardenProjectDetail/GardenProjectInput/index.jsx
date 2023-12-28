import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Card, Tooltip, Form, Input, Modal, Button, Flex, InputNumber, Select, notification } from 'antd'
import { EditFilled } from '@ant-design/icons'
import Loading from '../../../pages/Loading'
import GARDEN from '../../../services/gardenService'
import { formatDate, formatDateToInput } from '../../../utils/helpers'

const { Meta } = Card

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const today = new Date()
const year = today.getFullYear()
const month = (today.getMonth() + 1).toString().padStart(2, '0')
const date = today.getDate().toString().padStart(2, '0')

const currentDate = `${year}-${month}-${date}`

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant }) => {
  const [form] = Form.useForm()
  const [listSeed, setlistSeed] = useState([])

  const handlePlantChange = (value) => {
    setlistSeed(listPlant.find((plant) => plant.value === value).seeds)
  }

  return (
    <Modal
      open={open}
      title="Thêm cây mới"
      cancelText="Hủy"
      okText="Thêm"
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
          startDate: currentDate
        }}
      >
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input type="date" />
        </Form.Item>
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
              plant.value = plant.name
              return plant
            })}
            onChange={handlePlantChange}
          />
        </Form.Item>
        <Form.Item
          name="seed"
          label="Chọn hạt giống"
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
            placeholder="Chọn hạt giống"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={listSeed.map((seed) => {
              seed.label = seed.name
              seed.value = seed.name
              return seed
            })}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true,
              message: 'Trường thông tin không được để trống!'
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} addonAfter="g" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CollectionEditForm = ({ open, onCreate, onCancel, seedDetail, seed }) => {
  const [formEdit] = Form.useForm()
  const [listSeed, setListSeed] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getAllSeedByPlantName(seedDetail ? seedDetail.name : '')
      if (data.data) {
        setListSeed(data.data.result)
      }
    }
    fetchData()
  }, [seedDetail])

  return (
    <Modal
      open={open}
      title="Cập nhật thông tin"
      cancelText="Hủy"
      okText="Cập nhật"
      onCancel={onCancel}
      onOk={() => {
        formEdit
          .validateFields()
          .then((values) => {
            formEdit.resetFields()
            onCreate(values, seed)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={formEdit}
        {...layout}
        name="form_in_modal"
        initialValues={{
          startDate: seed.input?.initDate ? formatDateToInput(seed.input?.initDate) : currentDate,
          seed: seed.input?.seed ? seed.input?.seed : null,
          amount: seed.input?.amount ? seed.input?.amount : null
        }}
      >
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="seed"
          label="Chọn hạt giống"
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
            placeholder="Chọn hạt giống"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={listSeed?.map((seed) => {
              seed.label = seed.name
              seed.value = seed.name
              return seed
            })}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true,
              message: 'Trường thông tin không được để trống!'
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} addonAfter="kg" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const GardenProjectInput = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const [initData, setInitData] = useState(null)
  const [seedDetail, setSeedDetail] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [listPlant, setListPlant] = useState([])
  const gardenId = useParams().id
  const [selectedSeed, setSelectedSeed] = useState([])

  const handleSubmitInput = async (data, projectId) => {
    try {
      const res = await FARM.editInput(data, projectId)
      setInitData(
        initData.map((data) => {
          if (data.projectId === res.data.projectId) {
            data.input.seed = res.data.updatedInput.seed
            data.input.amount = res.data.updatedInput.amount
            data.input.initDate = res.data.updatedInput.initDate
          }
          return data
        })
      )
      openNotificationWithIcon('success', 'Thông báo', 'Chỉnh sửa/Cập nhật thành công')
      setOpenEdit(false)
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  const handleSubmitCreate = async (values) => {
    try {
      const data = { ...values, initDate: values.startDate, name: values.plant }
      const res = await FARM.createProjectGarden(data, gardenId)
      setInitData([
        ...initData,
        {
          name: res.data.project.name,
          projectId: res.data.project._id,
          input: res.data.project.input,
          plantImage: res.data.plantImage
        }
      ])
      openNotificationWithIcon('success', 'Thông báo', 'Tạo mới thành công')
      setOpen(false)
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  const onCreateEdit = (values, seed) => {
    const updatedValue = { ...values, initDate: values.startDate }
    handleSubmitInput(updatedValue, seed.projectId)
  }

  const onCreate = (values) => {
    handleSubmitCreate(values)
  }

  useEffect(() => {
    // Gọi api list
    async function fetchData() {
      const data = await GARDEN.getGardenInput(gardenId)
      if (data.data.projects) {
        setInitData(data.data.projects)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlantWithSeed()
      if (data.data.result) {
        setListPlant(data.data.result)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {contextHolder}
      {initData ? (
        <div>
          <Flex justify="space-between" align="center">
            <h2 style={{ margin: '0px' }}>Thông tin khởi tạo</h2>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true)
              }}
            >
              Thêm cây mới
            </Button>
          </Flex>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            {initData.map((project) => (
              <Card
                style={{
                  width: '23%',
                  marginBottom: '1.5rem',
                  marginRight: '1.5rem'
                }}
                hoverable
                cover={<img alt="example" src={project.plantImage} />}
              >
                <Meta
                  align={'center'}
                  style={{ fontStyle: 'italic' }}
                  title={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>Cây: {project.name}</span>{' '}
                      <Tooltip title="Sửa/Cập nhật thông tin">
                        <EditFilled
                          style={{ color: '#476930' }}
                          onClick={() => {
                            setSeedDetail(project)
                            setSelectedSeed({
                              ...project,
                              startDate: project.startDate ? new Date(project.startDate) : new Date()
                            })
                            setOpenEdit(true)
                          }}
                        />
                      </Tooltip>{' '}
                    </div>
                  }
                />
                <div style={{ textAlign: 'left' }}>
                  <p>Hạt giống: {project.input.seed || 'Chưa có thông tin'}</p>
                  <p>
                    Ngày bắt đầu: {project.input.initDate ? formatDate(project.input.initDate) : 'Chưa có thông tin'}
                  </p>
                  <p>Số lượng: {project.input.amount + ' gram' || 'Chưa có thông tin'}</p>
                </div>
              </Card>
            ))}
          </div>

          <CollectionEditForm
            open={openEdit}
            onCreate={onCreateEdit}
            onCancel={() => {
              setOpenEdit(false)
            }}
            seedDetail={seedDetail}
            seed={selectedSeed}
          />
          <CollectionCreateForm
            open={open}
            listPlant={listPlant}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false)
            }}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectInput
